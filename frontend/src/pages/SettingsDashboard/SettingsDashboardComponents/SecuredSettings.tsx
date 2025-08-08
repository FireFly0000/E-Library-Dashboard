import { useAppSelector } from "@/hooks/hooks";
import { Button } from "@/components/ui/button";
import { ChangePasswordParams, EmailUpdateParams } from "@/types/user";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  changePasswordValidationSchema,
  emailUpdateValidationSchema,
} from "@/validations/user";
import React from "react";
import { formatKeyToLabel } from "@/utils/helper";

const SecuredSettings: React.FC = () => {
  const user = useAppSelector((state) => state.authSlice.user);

  //for changing email
  const emailUpdateInitialValues: EmailUpdateParams = {
    email: user.email,
    password: "",
  };
  const emailUpdateKeys = ["email", "password"];

  //for changing password
  const changePasswordInitialValues: ChangePasswordParams = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  const changePasswordKeys = [
    "currentPassword",
    "newPassword",
    "confirmNewPassword",
  ];

  const handleEmailUpdateSubmit = (
    values: EmailUpdateParams,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    console.log(values);
    setSubmitting(false);
  };

  const handleChangePasswordSubmit = (
    values: ChangePasswordParams,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full items-center justify-center lg:justify-start lg:items-start gap-4 lg:gap-10">
      <h1 className="text-3xl text-foreground">
        These features are currently not working, coming soon...
      </h1>
      {/*Change password form */}
      <Formik<ChangePasswordParams>
        initialValues={changePasswordInitialValues}
        validationSchema={changePasswordValidationSchema}
        onSubmit={(values, { setSubmitting }) =>
          handleChangePasswordSubmit(values, setSubmitting)
        }
      >
        {({ isSubmitting }) => (
          <Form className="default-card-container w-[80vw] max-w-[400px] gap-5 px-4 md:px-10 py-8">
            <span className="text-2xl">Change Password</span>
            {changePasswordKeys.map((key) => (
              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <label className="text-foreground text-lg font-semibold">
                  {formatKeyToLabel(key)}
                </label>
                <Field
                  type="password"
                  name={key}
                  className="form-input w-full"
                />
                <ErrorMessage
                  name={key}
                  component="div"
                  className="text-destructive -my-2"
                />
              </div>
            ))}
            <Button size="lg" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>

      {/*Email update form */}
      <Formik<EmailUpdateParams>
        initialValues={emailUpdateInitialValues}
        validationSchema={emailUpdateValidationSchema}
        onSubmit={(values, { setSubmitting }) =>
          handleEmailUpdateSubmit(values, setSubmitting)
        }
      >
        {({ isSubmitting }) => (
          <Form className="default-card-container w-[80vw] max-w-[400px] gap-5 px-4 md:px-10 py-8">
            <span className="text-2xl">Change Email</span>
            {emailUpdateKeys.map((key) => (
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
              </div>
            ))}
            <Button size="lg" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SecuredSettings;
