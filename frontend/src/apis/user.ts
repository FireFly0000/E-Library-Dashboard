import { apiCaller } from "@/api-config/axiosInstance";
import i18n from "../utils/i18next";

const updateUserProfileImg = async (
  values: FormData,
  onProgress: (percent: number) => void
) => {
  const path = "users/update-profile-img";
  const response = await apiCaller(
    i18n.t("HTTP_CALL.HTTP_POST"),
    path,
    values,
    onProgress
  );
  return response;
};

export { updateUserProfileImg };
