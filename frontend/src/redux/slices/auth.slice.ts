import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import { Response } from "@/types/response";
import {
  Register as RegisterType,
  Login as LoginType,
  LoginResponse,
} from "@/types/auth";
import Cookies from "js-cookie";
import { AuthApis } from "@/apis";
import { AxiosResponse } from "axios";
import { AppDispatch } from "../store";
import toast from "react-hot-toast";

type AuthSlice = {
  user: User;
  isLogin: boolean;
  isLoading: boolean;
  error: string;
  success: string;
  isAuthChecked: boolean;
};

export const register = createAsyncThunk<
  Response<null>,
  RegisterType,
  { rejectValue: Response<null> }
>("auth/register", async (body, ThunkAPI) => {
  try {
    const response = await AuthApis.register(body);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const login = createAsyncThunk<
  Response<LoginResponse>,
  LoginType,
  { rejectValue: Response<null> }
>("auth/login", async (body, ThunkAPI) => {
  try {
    const response = await AuthApis.login(body);
    return response.data as Response<LoginResponse>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const verifyEmail = createAsyncThunk<
  Response<null>,
  string,
  { rejectValue: Response<null> }
>("auth/verify", async (body, ThunkAPI) => {
  try {
    const response = await AuthApis.verifyEmail(body);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const resendVerifyEmail = createAsyncThunk<
  Response<null>,
  string,
  { rejectValue: Response<null> }
>("auth/resendVerify", async (body, ThunkAPI) => {
  try {
    const response = await AuthApis.resendVerifyEmail(body);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const getMe = () => async (dispatch: AppDispatch) => {
  try {
    const response = await AuthApis.getMe();

    if (response) {
      if (response.status === 200) {
        dispatch(setUser(response.data.data));
      } else {
        Cookies.remove("accessToken");
      }
    }
  } catch (error) {
    const axiosError = error as AxiosResponse;
    const data = axiosError.data as Response<null>;
    toast.error(data.message as string);
  }
};

export const logout = createAsyncThunk<
  Response<null>,
  void,
  { rejectValue: Response<null> }
>("auth/logout", async (_, ThunkAPI) => {
  try {
    const response = await AuthApis.logout();
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

/*
  dispatch(
    setUser({
      username: "",
      email: "",
      id: undefined,
    })
  );
  dispatch(setLogout());
  Cookies.remove("accessToken");
  */

const initialState: AuthSlice = {
  user: {
    email: "",
    username: "",
    id: undefined,
  },
  isLogin: false,
  isLoading: false,
  error: "",
  success: "",
  isAuthChecked: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUrlAvatar: (state, payload: PayloadAction<string>) => {
      state.user.url_avatar = payload.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user.email = action.payload.email;
      state.user.username = action.payload.username;

      state.user.id = action.payload.id;
      state.user.url_avatar = action.payload.url_avatar;
      state.isLogin = true;
      state.isAuthChecked = true;
    },
    setIsAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    //Register
    builder.addCase(register.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.success = action.payload.message;
      state.isLoading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.payload?.message as string;
      state.isLoading = false;
    });

    //Login
    builder.addCase(login.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      Cookies.set("accessToken", action.payload.data?.accessToken as string);
      state.isLogin = true;

      state.isLoading = false;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false;
    });

    //logout
    builder.addCase(logout.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      Cookies.remove("accessToken");
      state.user.email = "";
      state.user.id = undefined;
      state.user.username = "";

      state.isLogin = false;
      state.isLoading = false;
      state.isAuthChecked = true;
    });
    builder.addCase(logout.rejected, (state) => {
      state.isLoading = false;
    });

    //verify email
    builder.addCase(verifyEmail.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      state.success = action.payload.message;
      state.isLoading = false;
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.error = action.payload?.message as string;
      state.isLoading = false;
    });

    //Resend email
    builder.addCase(resendVerifyEmail.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });
    builder.addCase(resendVerifyEmail.fulfilled, (state, action) => {
      state.success = action.payload.message;
      state.isLoading = false;
    });
    builder.addCase(resendVerifyEmail.rejected, (state, action) => {
      state.error = action.payload?.message as string;
      state.isLoading = false;
    });
  },
});

export const { setUser, setUrlAvatar, setIsAuthChecked } = authSlice.actions;

export default authSlice.reducer;
