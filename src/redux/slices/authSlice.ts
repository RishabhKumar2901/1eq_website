import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../../Firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthState {
  user: {
    uid: string | null;
    email: string | null;
    displayName: string | null;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return { uid: user.uid, email: user.email, displayName: user.displayName };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'auth/createUser',
  async (
    { email, password, pincode }: { email: string; password: string; pincode: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), { pincode });
      return { uid: user.uid, email: user.email, displayName: user.displayName };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state: any, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(signIn.rejected, (state: any, { payload }) => {
        state.loading = false;
        state.error = payload as string;
        state.user = null;
      })
      .addCase(createUser.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state: any, { payload }) => {
        state.loading = false;
        // state.user = payload;
      })
      .addCase(createUser.rejected, (state: any, { payload }) => {
        state.loading = false;
        state.error = payload as string;
        // state.user = null;
      })
      .addCase(signOut.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state: any) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(signOut.rejected, (state: any, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export default authSlice.reducer;