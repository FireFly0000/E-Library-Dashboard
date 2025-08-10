import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Response } from "@/types/response";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { UserApis } from "@/apis";
import {
  ChangeUserBasicInfo,
  DeleteBookVersionParams,
  MoveBookVersionToTrashParams,
  RecoverTrashedBookVersionParams,
} from "@/types/user";

type UserSlice = {
  profileImgUploaded: boolean;
  bookVersionTrashed: boolean;
  trashedBookVersionRecovered: boolean;
  bookVersionDeleted: boolean;
  basicInfoUpdated: boolean;
  isLoading: boolean;
  success: string;
  error: string;
};

export const updateUserProfileImg = createAsyncThunk<
  Response<null>,
  {
    formData: FormData;
    onProgress: (percent: number) => void;
  },
  { rejectValue: Response<null> }
>("users/update-profile-img", async ({ formData, onProgress }, ThunkAPI) => {
  try {
    const response = await UserApis.updateUserProfileImg(formData, onProgress);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const updateUserBasicInfo = createAsyncThunk<
  Response<null>,
  ChangeUserBasicInfo,
  { rejectValue: Response<null> }
>("users/update-user-basic-info", async (body, ThunkAPI) => {
  try {
    const response = await UserApis.updateUserBasicInfo(body);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const moveBookVersionToTrash = createAsyncThunk<
  Response<null>,
  MoveBookVersionToTrashParams,
  { rejectValue: Response<null> }
>("users/move-book-version-to-trash", async (body, ThunkAPI) => {
  try {
    const response = await UserApis.moveBookVersionToTrash(body);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const recoverTrashedBookVersion = createAsyncThunk<
  Response<null>,
  RecoverTrashedBookVersionParams,
  { rejectValue: Response<null> }
>("users/recover-trashed-book-version", async (body, ThunkAPI) => {
  try {
    const response = await UserApis.recoverTrashedBookVersion(body);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const deleteBookVersion = createAsyncThunk<
  Response<null>,
  DeleteBookVersionParams,
  { rejectValue: Response<null> }
>("users/delete-book-version", async (body, ThunkAPI) => {
  try {
    const response = await UserApis.deleteBookVersion(body);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

const initialState: UserSlice = {
  profileImgUploaded: false,
  bookVersionTrashed: false,
  trashedBookVersionRecovered: false,
  bookVersionDeleted: false,
  basicInfoUpdated: false,
  isLoading: false,
  error: "",
  success: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setProfileImgUploaded: (state, action: PayloadAction<boolean>) => {
      state.profileImgUploaded = action.payload;
    },
    setBookVersionTrashed: (state, action: PayloadAction<boolean>) => {
      state.bookVersionTrashed = action.payload;
    },
    setBasicInfoUpdated: (state, action: PayloadAction<boolean>) => {
      state.basicInfoUpdated = action.payload;
    },
    setTrashedBookVersionRecovered: (state, action: PayloadAction<boolean>) => {
      state.trashedBookVersionRecovered = action.payload;
    },
    setBookVersionDeleted: (state, action: PayloadAction<boolean>) => {
      state.bookVersionDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    //updateUserProfileImg
    builder.addCase(updateUserProfileImg.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });

    builder.addCase(updateUserProfileImg.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profileImgUploaded = true;
      toast.success(action.payload.message);
    });

    builder.addCase(updateUserProfileImg.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload?.message ?? "Unknown error";
    });

    //moveBookVersionToTrash
    builder.addCase(moveBookVersionToTrash.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });

    builder.addCase(moveBookVersionToTrash.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bookVersionTrashed = true;
      toast.success(action.payload.message);
    });

    builder.addCase(moveBookVersionToTrash.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload?.message ?? "Unknown error";
      toast.error(state.error);
    });

    //updateUserBasicInfo
    builder.addCase(updateUserBasicInfo.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });

    builder.addCase(updateUserBasicInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.basicInfoUpdated = true;
      toast.success(action.payload.message);
    });

    builder.addCase(updateUserBasicInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload?.message ?? "Unknown error";
      toast.error(state.error);
    });

    //recoverTrashedBookVersion
    builder.addCase(recoverTrashedBookVersion.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });

    builder.addCase(recoverTrashedBookVersion.fulfilled, (state, action) => {
      state.isLoading = false;
      state.trashedBookVersionRecovered = true;
      toast.success(action.payload.message);
    });

    builder.addCase(recoverTrashedBookVersion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload?.message ?? "Unknown error";
      toast.error(state.error);
    });

    //deleteBookVersion
    builder.addCase(deleteBookVersion.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });

    builder.addCase(deleteBookVersion.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bookVersionDeleted = true;
      toast.success(action.payload.message);
    });

    builder.addCase(deleteBookVersion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload?.message ?? "Unknown error";
      toast.error(state.error);
    });
  },
});

export const {
  setProfileImgUploaded,
  setBookVersionTrashed,
  setBasicInfoUpdated,
  setTrashedBookVersionRecovered,
  setBookVersionDeleted,
} = userSlice.actions;

export default userSlice.reducer;
