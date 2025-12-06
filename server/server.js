const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "dev-refresh-secret";
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";
const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'todos.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const REFRESH_TOKENS_FILE = path.join(__dirname, 'refresh-tokens.json');

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

if (!fs.existsSync(REFRESH_TOKENS_FILE)) {
  fs.writeFileSync(REFRESH_TOKENS_FILE, JSON.stringify([]));
}

const readTodos = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
};

const writeTodos = (todos) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(todos, null, 2));
};

const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const readRefreshTokens = () => {
  try {
    return JSON.parse(fs.readFileSync(REFRESH_TOKENS_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
};

const writeRefreshTokens = (tokens) => {
  fs.writeFileSync(REFRESH_TOKENS_FILE, JSON.stringify(tokens, null, 2));
};

const users = readUsers();

function authGuard(req, res, next) {
  const h = req.header("authorization");
  if (!h || !h.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }
  const token = h.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/auth/register", async (req, res) => {
  const { email, password, age } = req.body || {};
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: "Некорректные данные" });
  }
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ message: "Email уже зарегистрирован" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { 
    id: uuid(), 
    email, 
    passwordHash, 
    age, 
    createdAt: new Date().toISOString() 
  };
  users.push(user);
  writeUsers(users);
  
  const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: ACCESS_TTL });
  const refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
  
  // Сохраняем refresh token в файл
  const refreshTokens = readRefreshTokens();
  refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    createdAt: new Date().toISOString()
  });
  writeRefreshTokens(refreshTokens);
  
  res.status(201).json({ 
    accessToken,
    refreshToken
  });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Неверные учетные данные" });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Неверные учетные данные" });
  }
  
  const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: ACCESS_TTL });
  const refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
  
  // Сохраняем refresh token в файл
  const refreshTokens = readRefreshTokens();
  refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    createdAt: new Date().toISOString()
  });
  writeRefreshTokens(refreshTokens);
  
  res.json({ accessToken, refreshToken });
});

app.post("/auth/refresh", (req, res) => {
  const { refreshToken } = req.body || {};
  
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }
  
  try {
    // Проверяем подпись токена
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const userId = payload.sub;
    
    // Проверяем, что токен есть в списке активных
    const refreshTokens = readRefreshTokens();
    const tokenExists = refreshTokens.some(t => t.token === refreshToken && t.userId === userId);
    
    if (!tokenExists) {
      return res.status(401).json({ message: "Refresh token not found or revoked" });
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    
    const newAccessToken = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: ACCESS_TTL });
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

app.get("/auth/me", authGuard, (req, res) => {
  const u = users.find(x => x.id === req.userId);
  if (!u) {
    return res.status(404).json({ message: "Not found" });
  }
  const { id, email, age, createdAt } = u;
  res.json({ id, email, age, createdAt });
});

app.post("/auth/change-password", authGuard, async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  const u = users.find(x => x.id === req.userId);
  if (!u) {
    return res.status(404).json({ message: "Not found" });
  }

  const ok = await bcrypt.compare(oldPassword, u.passwordHash);
  if (!ok) {
    return res.status(400).json({ message: "Bad old password" });
  }

  u.passwordHash = await bcrypt.hash(newPassword, 10);
  writeUsers(users);
  return res.json({ ok: true });
});

app.post("/auth/logout", authGuard, (req, res) => {
  const refreshToken = req.body?.refreshToken;
  
  if (refreshToken) {
    const refreshTokens = readRefreshTokens();
    const filtered = refreshTokens.filter(t => t.token !== refreshToken);
    writeRefreshTokens(filtered);
  }
  
  res.json({ ok: true });
});

app.get('/todos', authGuard, (req, res) => {
  const { page = 1, limit = 10, filter = 'all' } = req.query;
  let todosList = readTodos().filter(t => t.userId === req.userId);

  switch (filter) {
    case 'completed':
      todosList = todosList.filter(todo => todo.completed);
      break;
    case 'active':
      todosList = todosList.filter(todo => !todo.completed);
      break;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedTodos = todosList.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedTodos,
    pagination: {
      total: todosList.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(todosList.length / limit)
    }
  });
});

app.post('/todos', authGuard, (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  const todosList = readTodos();
  const newTodo = {
    id: uuid(),
    userId: req.userId,
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todosList.push(newTodo);
  writeTodos(todosList);
  
  res.status(201).json(newTodo);
});

app.put('/todos/:id', authGuard, (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  
  const todos = readTodos();
  const todoIndex = todos.findIndex(t => t.id === id && t.userId === req.userId);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  if (text !== undefined) todos[todoIndex].text = text;
  if (completed !== undefined) todos[todoIndex].completed = completed;
  
  writeTodos(todos);
  res.json(todos[todoIndex]);
});

app.delete('/todos/:id', authGuard, (req, res) => {
  const { id } = req.params;
  
  const todos = readTodos();
  const todoIndex = todos.findIndex(t => t.id === id && t.userId === req.userId);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(todoIndex, 1);
  writeTodos(todos);
  res.status(204).send();
});

app.patch('/todos/:id/toggle', authGuard, (req, res) => {
  const { id } = req.params;
  
  const todos = readTodos();
  const todoIndex = todos.findIndex(t => t.id === id && t.userId === req.userId);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos[todoIndex].completed = !todos[todoIndex].completed;
  writeTodos(todos);
  
  res.json(todos[todoIndex]);
});

app.listen(PORT, () => {
  console.log(`Todo API server running on http://localhost:${PORT}`);
  console.log(`API Documentation:
  GET    /todos?page=1&limit=10 - Get paginated todos
  POST   /todos - Create new todo (requires { text })
  PUT    /todos/:id - Update todo (requires { text, completed })
  DELETE /todos/:id - Delete todo
  PATCH  /todos/:id/toggle - Toggle todo status
  `);
});
