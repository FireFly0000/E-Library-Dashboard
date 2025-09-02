import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import { Response } from "@/types/response";
import {
  Register as RegisterType,
  Login as LoginType,
  LoginResponse,
  SessionInfo,
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
  sessions: SessionInfo[];
  isSessionLoggedOut: boolean;
  isEmailUpdated: boolean;
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

export const getUserSessions = createAsyncThunk<
  Response<SessionInfo[]>,
  void,
  { rejectValue: Response<null> }
>("auth/getUserSessions", async (_, ThunkAPI) => {
  try {
    const response = await AuthApis.getUserSessions();
    return response.data as Response<SessionInfo[]>;
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
        //Cookies.remove("accessToken");
        //Cookies.remove("refreshToken", { path: "/" });
        //Cookies.remove("sessionId", { path: "/" });
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

export const logoutSession = createAsyncThunk<
  Response<null>,
  string,
  { rejectValue: Response<null> }
>("auth/logoutSession", async (sessionId, ThunkAPI) => {
  try {
    const response = await AuthApis.logoutSession(sessionId);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const updateEmail = createAsyncThunk<
  Response<null>,
  { newEmail: string; password: string },
  { rejectValue: Response<null> }
>("auth/updateEmail", async (body, ThunkAPI) => {
  try {
    const response = await AuthApis.updateEmail(body.newEmail, body.password);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const updatePassword = createAsyncThunk<
  Response<null>,
  { currentPassword: string; newPassword: string; confirmNewPassword: string },
  { rejectValue: Response<null> }
>("auth/updatePassword", async (body, ThunkAPI) => {
  try {
    const response = await AuthApis.updatePassword(
      body.currentPassword,
      body.newPassword,
      body.confirmNewPassword
    );
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

const initialState: AuthSlice = {
  user: {
    email: "",
    username: "",
    password: "",
    url_avatar: "",
    id: undefined,
    viewCount: -1,
  },
  isLogin: false,
  isLoading: false,
  error: "",
  success: "",
  isAuthChecked: false,
  sessions: [],
  isSessionLoggedOut: false,
  isEmailUpdated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUrlAvatar: (state, action: PayloadAction<string>) => {
      state.user.url_avatar = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user.email = action.payload.email;
      state.user.username = action.payload.username;

      state.user.id = action.payload.id;
      state.user.url_avatar = action.payload.url_avatar;
      state.user.viewCount = action.payload.viewCount;
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
      Cookies.set("accessToken", action.payload.data?.accessToken as string, {
        secure: true,
        sameSite: "None",
        expires: 15,
      });
      //set refreshToken in frontend only if device is mobile (BE sent back none empty)
      const refreshToken = action.payload.data?.refreshToken || "";
      if (typeof refreshToken === "string" && refreshToken.trim().length > 0) {
        Cookies.set("refreshToken", refreshToken, {
          secure: true,
          sameSite: "None",
          expires: 15,
          path: "/",
        });
      }
      const sessionId = action.payload.data?.sessionId || "";
      if (typeof sessionId === "string" && sessionId.trim().length > 0) {
        Cookies.set("sessionId", sessionId, {
          secure: true,
          sameSite: "None",
          expires: 15,
        });
      }
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
      Cookies.remove("refreshToken", {
        path: "/",
      });
      Cookies.remove("sessionId", {
        path: "/",
      });
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

    //getUserSessions
    builder.addCase(getUserSessions.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });
    builder.addCase(getUserSessions.fulfilled, (state, action) => {
      state.sessions = action.payload.data || [];

      state.error = "";
      state.success = "";
      state.isLoading = false;
    });
    builder.addCase(getUserSessions.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload?.message as string);
    });

    //logout session
    builder.addCase(logoutSession.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
      state.isSessionLoggedOut = false;
    });
    builder.addCase(logoutSession.fulfilled, (state, action) => {
      state.isLoading = false;
      toast.success(action.payload.message as string);
      state.isSessionLoggedOut = true;
    });
    builder.addCase(logoutSession.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload?.message as string);
      state.isSessionLoggedOut = false;
    });

    //update email
    builder.addCase(updateEmail.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
      state.isEmailUpdated = false;
    });
    builder.addCase(updateEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      toast.success(action.payload.message as string);
      state.isEmailUpdated = true;

      state.user.email = "";
      state.user.id = undefined;
      state.user.username = "";

      state.isLogin = false;
      state.isLoading = false;
      state.isAuthChecked = true;
    });
    builder.addCase(updateEmail.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload?.message as string);
      state.isEmailUpdated = false;
    });

    //update password
    builder.addCase(updatePassword.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.isLoading = false;
      toast.success(action.payload.message as string);

      state.user.email = "";
      state.user.id = undefined;
      state.user.username = "";

      state.isLogin = false;
      state.isLoading = false;
      state.isAuthChecked = true;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload?.message as string);
    });
  },
});

export const { setUser, setUrlAvatar, setIsAuthChecked } = authSlice.actions;

export default authSlice.reducer;
