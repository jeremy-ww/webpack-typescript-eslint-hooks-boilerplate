import { createSlice, Dispatch, createAsyncThunk } from "@reduxjs/toolkit";

import store from "src/store";

export const getUser = createAsyncThunk<
  void,
  {},
  {
    state: ReturnType<typeof store.getState>;
  }
>("getUser", async (template, { dispatch }) => {
  await dispatch(getUserAction());
});

export const getUserAction = () => async (
  dispatch: Dispatch,
  getState: typeof store.getState
) => {
  // @ts-ignore
  await { then: (r) => setTimeout(r, 1000) };
  dispatch(setState({ user: "React Hooks" }));
};

const slice = createSlice({
  name: "Home",
  initialState: {
    user: "",
    loading: true,
  },
  reducers: {
    setState: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setState } = slice.actions;
export default slice.reducer;
