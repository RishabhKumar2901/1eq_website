import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storeData, fetchAllData } from '../utils/firestoreUtils';

interface DataState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  items: [],
  loading: false,
  error: null,
};

export const addData = createAsyncThunk(
  'data/addData',
  async ({ collectionName, data }: { collectionName: string; data: any }, { rejectWithValue }) => {
    try {
      await storeData(collectionName, null, data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (collectionName: string, { rejectWithValue }) => {
    try {
      const data = await fetchAllData(collectionName);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addData.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default dataSlice.reducer;