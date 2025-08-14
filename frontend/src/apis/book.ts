import { apiCaller } from "@/api-config/axiosInstance";
import i18n from "../utils/i18next";
import { BookAIServicesParams, UpdateViewsParams } from "@/types/books";

const createBook = async (
  values: FormData,
  onProgress: (percent: number) => void
) => {
  const path = "books/";
  const response = await apiCaller(
    i18n.t("HTTP_CALL.HTTP_POST"),
    path,
    values,
    onProgress
  );
  return response;
};

const updateViews = async (values: UpdateViewsParams) => {
  const path = "books/update-view-count";
  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);
  return response;
};

const bookAiServices = async (values: BookAIServicesParams) => {
  const { content, language, title, service } = values;
  const path = `books/ai-services?content=${content}&language=${language}&title=${title}&service=${service}`;
  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);
  return response;
};

export { createBook, updateViews, bookAiServices };
