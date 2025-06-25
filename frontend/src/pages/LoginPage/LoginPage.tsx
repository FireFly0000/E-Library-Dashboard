import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Login as LoginType } from "@/types/auth";
import { loginValidationSchema } from "@/validations/auth";
import ELibLogo from "/book-svgrepo-com.svg";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { authActions } from "@/redux/slices";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const initialValues: LoginType = {
  email: "",
  password: "",
};

const keys = ["email", "password"];

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state) => state.authSlice.isLoading);
  const isLogin: boolean = useAppSelector((state) => state.authSlice.isLogin);

  if (isLogin) return <Navigate to={"/"} />;

  const handleSubmit = (
    values: LoginType,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    dispatch(authActions.login(values)).then((response) => {
      if (response.payload?.status_code === 200) {
        toast.success(response.payload.message);
        dispatch(authActions.getMe());
      } else {
        toast.error(response.payload?.message as string);
      }
    });
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-start mt-10 gap- text-center w-full text-[var(--foreground)] px-5">
      <img src={ELibLogo} alt="App's logo" className="w-[10%] min-w-[200px]" />
      <Formik<LoginType>
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
      >
        {({ isSubmitting }) => (
          <Form className="default-card-container w-[80vw] max-w-[400px] gap-5 px-12 py-10">
            <span className="text-2xl">Login</span>
            {keys.map((key) => (
              <>
                <Field
                  type={key}
                  name={key}
                  className="form-input"
                  placeholder={key}
                />
                <ErrorMessage
                  name={key}
                  component="div"
                  className="text-destructive -my-2"
                />
              </>
            ))}
            {/* Confirm password field */}
            <Button size="lg" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
            <span className="-my-2">{isLoading ? "Loading..." : ""}</span>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
