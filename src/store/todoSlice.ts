import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Filter, Todo, PaginatedResponse } from "../types/todo";
import { fetchTodos, createTodo } from "../api/todos";

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
console.log('TEST', todosSlice);
export const { setPage, setLimit, setFilter } = todosSlice.actions;
export default todosSlice.reducer;
