import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Filter, Todo, PaginatedResponse } from "../types/todo";
import {
  fetchTodos,
  createTodo,
  deleteTodo,
  toggleTodo,
  updateTodo,
  putTodo,
} from "../api/todos";

export interface TodosState {
  items: Todo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  filter: Filter;
}

const initialState: TodosState = {
  items: [],
  status: "idle",
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  filter: "all",
};

export const loadTodos = createAsyncThunk<
  PaginatedResponse<Todo>,
  { page: number; limit: number; filter: Filter }
>("todos/load", async (params) => {
  const data = await fetchTodos(params);

  return data;
});

export const createTodoThunk = createAsyncThunk<
  any,
  string,
  { state: { todos: TodosState } }
>("todos/create", async (text, { getState, dispatch }) => {
  await createTodo(text);

  const { page, limit, filter } = getState().todos;

  await dispatch(loadTodos({ page, limit, filter }));

  return null;
});

export const deleteTodoThunk = createAsyncThunk<
  void,
  number | string,
  { state: { todos: TodosState } }
>("todos/delete", async (id, { getState, dispatch }) => {
  await deleteTodo(id);

  const { page, limit, filter } = getState().todos;

  await dispatch(loadTodos({ page, limit, filter }));
});

export const toggleTodoThunk = createAsyncThunk<
  void,
  { id: number | string; completed: boolean },
  { state: { todos: TodosState } }
>("todos/toggle", async ({ id, completed }, { getState, dispatch }) => {
  const { items, page, limit, filter } = getState().todos;
  const todo = items.find((t) => String(t.id) === String(id));

  if (!todo) return;

  await putTodo(id, { ...todo, completed: !completed });
  await dispatch(loadTodos({ page, limit, filter }));
});

export const updateTodoThunk = createAsyncThunk<
  void,
  { id: number | string; text: string },
  { state: { todos: TodosState } }
>("todos/update", async ({ id, text }, { getState, dispatch }) => {
  const { items, page, limit, filter } = getState().todos;
  const todo = items.find((t) => String(t.id) === String(id));

  if (!todo) return;

  await putTodo(id, { ...todo, text });
  await dispatch(loadTodos({ page, limit, filter }));
});

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTodos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(loadTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Request failed";
      });
  },
});
console.log("TEST", todosSlice);
export const { setPage, setLimit, setFilter } = todosSlice.actions;
export default todosSlice.reducer;
