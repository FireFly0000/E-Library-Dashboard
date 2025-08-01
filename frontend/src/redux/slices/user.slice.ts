import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Response } from "@/types/response";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { UserApis } from "@/apis";

type UserSlice = {
  profileImgUploaded: boolean;
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

const initialState: UserSlice = {
  profileImgUploaded: false,
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
  },
});

export const { setProfileImgUploaded } = userSlice.actions;

export default userSlice.reducer;
