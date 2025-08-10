import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import BlankProfilePic from "@/assets/blank-profile-picture.png";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ChangeUserBasicInfo } from "@/types/user";
import { formatKeyToLabel } from "@/utils/helper";
import { changeUserBasicInfoValidationSchema } from "@/validations/user";
import { userActions } from "@/redux/slices";
import { userApi } from "@/services/userApis";
import { useEffect } from "react";

const BasicSettings: React.FC = () => {
  const user = useAppSelector((state) => state.authSlice.user);
  const dispatch = useAppDispatch();
  const basicUserInfoUpdated = useAppSelector(
    (state) => state.userSlice.basicInfoUpdated
  );

  const changeUserBasicInfoInitialValues: ChangeUserBasicInfo = {
    username: user.username,
  };
  const changeUserBasicInfoKeys = ["username"];

  const handleChangeUserBasicInfoSubmit = async (
    values: ChangeUserBasicInfo,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    await dispatch(userActions.updateUserBasicInfo(values));
    setSubmitting(false);
  };

  //Invalidate tag and reset update success state for refetch
  useEffect(() => {
    if (basicUserInfoUpdated) {
      dispatch(userApi.util.invalidateTags(["profile"]));
      dispatch(userActions.setBasicInfoUpdated(false));
    }
  }, [basicUserInfoUpdated, dispatch]);

  return (
    <main className="flex flex-col w-full items-center justify-center">
      <img
        src={user?.url_avatar ? user.url_avatar : BlankProfilePic}
        className="w-[150px] rounded-full"
      />

      {/*Change user basic info form */}
      <Formik<ChangeUserBasicInfo>
        initialValues={changeUserBasicInfoInitialValues}
        validationSchema={changeUserBasicInfoValidationSchema}
        onSubmit={(values, { setSubmitting }) =>
          handleChangeUserBasicInfoSubmit(values, setSubmitting)
        }
      >
        {({ isSubmitting }) => (
          <Form className="default-card-container w-[80vw] max-w-[400px] gap-5 px-4 md:px-10 py-6 items-center justify-center mt-[20px]">
            {changeUserBasicInfoKeys.map((key) => (
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <label className="text-foreground text-lg font-semibold">
                  {formatKeyToLabel(key)}
                </label>
                <Field
                  type={key}
                  name={key}
                  className="form-input w-full"
                  placeholder={key}
                />
                <ErrorMessage
                  name={key}
                  component="div"
                  className="text-destructive -my-2"
                />
              </div>
            ))}
            <Button
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-[50%]"
            >
              update
            </Button>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default BasicSettings;
