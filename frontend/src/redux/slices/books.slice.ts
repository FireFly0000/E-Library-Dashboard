import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Response } from "@/types/response";
import { AxiosResponse } from "axios";
import { BookApis } from "@/apis";
import toast from "react-hot-toast";
import { UpdateViewsParams } from "@/types/books";
import { BookAIServicesParams } from "@/types/books";

type BookSlice = {
  bookUploaded: boolean;
  viewCountUpdated: boolean;
  isLoading: boolean;
  success: string;
  error: string;
};

export const createBook = createAsyncThunk<
  Response<null>,
  {
    formData: FormData;
    onProgress: (percent: number) => void;
  },
  { rejectValue: Response<null> }
>("books/paging", async ({ formData, onProgress }, ThunkAPI) => {
  try {
    const response = await BookApis.createBook(formData, onProgress);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const updateViewCount = createAsyncThunk<
  Response<null>,
  UpdateViewsParams,
  { rejectValue: Response<null> }
>("books/update-views", async (body, ThunkAPI) => {
  try {
    const response = await BookApis.updateViews(body);
    return response.data as Response<null>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

export const bookAIServices = createAsyncThunk<
  Response<string>,
  BookAIServicesParams,
  { rejectValue: Response<null> }
>("books/ai-services", async (body, ThunkAPI) => {
  try {
    const response = await BookApis.bookAiServices(body);
    return response.data as Response<string>;
  } catch (error) {
    const axiosError = error as AxiosResponse<Response<null>>;
    return ThunkAPI.rejectWithValue(axiosError.data as Response<null>);
  }
});

const initialState: BookSlice = {
  bookUploaded: false,
  viewCountUpdated: false,
  isLoading: false,
  error: "",
  success: "",
};

export const bookSlice = createSlice({
  name: "book",
  initialState: initialState,
  reducers: {
    setBookUploaded: (state, action: PayloadAction<boolean>) => {
      state.bookUploaded = action.payload;
    },
    setViewCountUpdated: (state, action: PayloadAction<boolean>) => {
      state.viewCountUpdated = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getBookSearchByTitleAndAuthor
    builder.addCase(createBook.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });

    builder.addCase(createBook.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bookUploaded = true;
      toast.success(action.payload.message);
    });

    builder.addCase(createBook.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action?.payload?.message ?? "Unknown error");
    });

    //updateBooksViews
    builder.addCase(updateViewCount.pending, (state) => {
      state.error = "";
      state.success = "";
      state.isLoading = true;
    });

    builder.addCase(updateViewCount.fulfilled, (state) => {
      state.isLoading = false;
      state.viewCountUpdated = true;
    });

    builder.addCase(updateViewCount.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload?.message ?? "Unknown error";
    });

    //bookAIServices
    builder.addCase(bookAIServices.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(bookAIServices.fulfilled, (state) => {
      state.isLoading = false;
    });

    builder.addCase(bookAIServices.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action?.payload?.message ?? "Unknown error";
    });
  },
});

export const { setBookUploaded, setViewCountUpdated } = bookSlice.actions;

export default bookSlice.reducer;
