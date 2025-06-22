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

/*export const refreshToken = async () => {
  try {
    const response = await AuthApis.refreshToken();
    console.log("Response from refreshToken:", response);
    if (response) {
      if (response.status >= 200 && response.status <= 299) {
        Cookies.set("accessToken", response.data.data.accessToken);
        Cookies.set("refreshToken", response.data.data.refreshToken);
      } else {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
      }
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
};*/

export const getMe = () => async (dispatch: AppDispatch) => {
  try {
    const response = await AuthApis.getMe();

    if (response) {
      if (response.status >= 200 && response.status <= 299) {
        dispatch(setUser(response.data.data));
      } else {
        console.log("Get me error");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/";
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const logout = () => async (dispatch: AppDispatch) => {
  console.log("Logout action triggered");
  dispatch(
    setUser({
      username: "",
      email: "",
      id: undefined,
    })
  );
  dispatch(setLogout());
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

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
    setLogout: (state) => {
      state.isLogin = false;
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
      Cookies.set("refreshToken", action.payload.data?.refreshToken as string);
      state.isLogin = true;

      state.isLoading = false;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false;
    });

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

export const { setUser, setLogout, setUrlAvatar, setIsAuthChecked } =
  authSlice.actions;

export default authSlice.reducer;
