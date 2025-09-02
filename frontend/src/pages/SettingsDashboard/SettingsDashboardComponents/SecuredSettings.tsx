import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { Button } from "@/components/ui/button";
import { ChangePasswordParams, EmailUpdateParams } from "@/types/user";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  changePasswordValidationSchema,
  emailUpdateValidationSchema,
} from "@/validations/user";
import React, { useEffect } from "react";
import { formatKeyToLabel } from "@/utils/helper";
import { authActions } from "@/redux/slices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SecuredSettings: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authSlice.user);
  const sessions = useAppSelector((state) => state.authSlice.sessions);
  const isSessionLoggedOut = useAppSelector(
    (state) => state.authSlice.isSessionLoggedOut
  );
  const dispatch = useAppDispatch();

  //Fetch user sessions from backend
  useEffect(() => {
    dispatch(authActions.getUserSessions());
  }, [dispatch, isSessionLoggedOut]);

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
    const payload = {
      newEmail: values.email,
      password: values.password,
    };
    dispatch(authActions.updateEmail(payload)).then((response) => {
      if (response.payload?.status_code === 200) {
        navigate("/");
      }
    });
    setSubmitting(false);
  };

  const handleChangePasswordSubmit = (
    values: ChangePasswordParams,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    console.log(values);
    const payload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
    };
    dispatch(authActions.updatePassword(payload)).then((response) => {
      if (response.payload?.status_code === 200) {
        navigate("/");
      }
    });
    setSubmitting(false);
  };

  const handleLogoutSession = (sessionId: string, userAgent: string) => {
    if (navigator.userAgent === userAgent) {
      dispatch(authActions.logout()).then((response) => {
        if (response.payload?.status_code === 200) {
          toast.success(response.payload.message);
          navigate("/");
        } else {
          toast.error(response.payload?.message as string);
        }
      });
    } else {
      dispatch(authActions.logoutSession(sessionId));
    }
  };

  return (
    <section className="flex flex-col w-full items-center justify-center gap-16">
      <div className="flex flex-col lg:flex-row w-full items-center justify-center lg:items-start gap-6 lg:gap-10">
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

      <div className="flex flex-col w-full items-center justify-center gap-10 mb-24">
        <h1 className="text-3xl text-foreground">Login Sessions</h1>
        {sessions.length === 0 ? (
          <span className="text-foreground text-xl">No active sessions</span>
        ) : (
          <div className="flex flex-col gap-4 w-[80vw] max-w-[600px]">
            {sessions.map((session, index) => (
              <div
                key={index}
                className="w-full p-4 border border-border rounded-lg flex items-center gap-4"
              >
                <span className="text-foreground text-lg">
                  {session.userAgent}
                </span>
                <div className="ml-auto flex flex-col items-center gap-4">
                  {" "}
                  <Button
                    variant="destructive"
                    size="default"
                    onClick={() =>
                      handleLogoutSession(session.sessionId, session.userAgent)
                    }
                  >
                    Logout
                  </Button>
                  {session.userAgent === navigator.userAgent && (
                    <span className="text-primary text-lg">(Current)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SecuredSettings;
