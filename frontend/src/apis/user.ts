import { apiCaller } from "@/api-config/axiosInstance";
import i18n from "../utils/i18next";
import {
  ChangeUserBasicInfo,
  DeleteBookVersionParams,
  MoveBookVersionToTrashParams,
  RecoverTrashedBookVersionParams,
} from "@/types/user";

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

const moveBookVersionToTrash = async (values: MoveBookVersionToTrashParams) => {
  const path = `users/move-book-version-to-trash?bookVersionId=${values.bookVersionId}&profileId=${values.profileId}`;
  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);
  return response;
};

const updateUserBasicInfo = async (values: ChangeUserBasicInfo) => {
  const path = "users/update-user-basic-info";
  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PUT"), path, values);
  return response;
};

const recoverTrashedBookVersion = async (
  values: RecoverTrashedBookVersionParams
) => {
  const path = `users/recover-trashed-book-version?bookVersionId=${values.bookVersionId}`;
  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);
  return response;
};

const deleteBookVersion = async (values: DeleteBookVersionParams) => {
  const path = `users/delete-book-version/${values.bookVersionId}`;
  const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_DELETE"), path);
  return response;
};

export {
  updateUserProfileImg,
  moveBookVersionToTrash,
  updateUserBasicInfo,
  recoverTrashedBookVersion,
  deleteBookVersion,
};
