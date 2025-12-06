import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type { Todo } from "./todosApi";
import { fetchTodos, createTodo, updateTodo, deleteTodo, toggleTodo } from "./todosApi";

export interface TodosState {
  items: Todo[];
  page: number;
  limit: number;
  filter: "all" | "active" | "completed";
  total: number;
  totalPages: number;
  sortOrder: "new" | "old";
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  page: 1,
  limit: 10,
  filter: "all",
  total: 0,
  totalPages: 0,
  sortOrder: "new",
  status: "idle",
  error: null,
};

export const loadTodos = createAsyncThunk<
  import("./todosApi").PaginatedResponse,
  void,
  { state: { todos: TodosState } }
>("todos/load", async (_, { getState }) => {
  const state = getState().todos;
  const response = await fetchTodos(state.page, state.limit, state.filter);
  return response;
});

export const createTodoThunk = createAsyncThunk<
  void,
  string,
  { state: { todos: TodosState } }
>("todos/create", async (text, { dispatch }) => {
  await createTodo(text);
  await dispatch(loadTodos());
});

export const updateTodoThunk = createAsyncThunk<
  void,
  { id: string; text: string; completed: boolean },
  { state: { todos: TodosState } }
>("todos/update", async ({ id, text, completed }, { dispatch }) => {
  await updateTodo(id, text, completed);
  await dispatch(loadTodos());
});

export const deleteTodoThunk = createAsyncThunk<
  void,
  string,
  { state: { todos: TodosState } }
>("todos/delete", async (id, { dispatch }) => {
  await deleteTodo(id);
  await dispatch(loadTodos());
});

export const toggleTodoThunk = createAsyncThunk<
  void,
  string,
  { state: { todos: TodosState } }
>("todos/toggle", async (id, { dispatch }) => {
  await toggleTodo(id);
  await dispatch(loadTodos());
});


const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    pushTodo(state, action: PayloadAction<Todo>) {
      state.items.unshift(action.payload);
    },
    resetTodos(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },
    setFilter(state, action: PayloadAction<"all" | "active" | "completed">) {
      state.filter = action.payload;
      state.page = 1;
    },
    setSortOrder(state, action: PayloadAction<"new" | "old">) {
      state.sortOrder = action.payload;
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
        state.total = action.payload.pagination.total;
        state.page = action.payload.pagination.page;
        state.limit = action.payload.pagination.limit;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(loadTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Request failed";
      })
      .addCase(createTodoThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTodoThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createTodoThunk.rejected, (state, action) => {
        state.error = action.error.message || "Create failed";
      })
      .addCase(updateTodoThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTodoThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateTodoThunk.rejected, (state, action) => {
        state.error = action.error.message || "Update failed";
      })
      .addCase(deleteTodoThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTodoThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteTodoThunk.rejected, (state, action) => {
        state.error = action.error.message || "Delete failed";
      })
      .addCase(toggleTodoThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(toggleTodoThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(toggleTodoThunk.rejected, (state, action) => {
        state.error = action.error.message || "Toggle failed";
      });
  },
});

export const { pushTodo, resetTodos, setPage, setLimit, setFilter, setSortOrder } = todosSlice.actions;
export default todosSlice.reducer;

