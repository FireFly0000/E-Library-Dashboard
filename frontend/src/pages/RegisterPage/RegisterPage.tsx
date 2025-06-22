import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Register as RegisterType } from "@/types/auth";
import { registerValidationSchema } from "@/validations/auth";
import ELibLogo from "/book-svgrepo-com.svg";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { authActions } from "@/redux/slices";

const initialValues: RegisterType = {
  email: "",
  password: "",
  confirm_password: "",
  username: "",
};

const keys = ["email", "username", "password"];

const RegisterPage = () => {
  const dispatch = useAppDispatch();

  const errorMessage = useAppSelector((state) => state.authSlice.error) ?? "";
  const successMessage =
    useAppSelector((state) => state.authSlice.success) ?? "";
  const isLoading = useAppSelector((state) => state.authSlice.isLoading);

  const handleSubmit = (
    values: RegisterType,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    dispatch(authActions.register(values));
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-start mt-10 gap- text-center w-full text-[var(--foreground)] px-5">
      <img src={ELibLogo} alt="App's logo" className="w-[10%] min-w-[200px]" />
      <Formik<RegisterType>
        initialValues={initialValues}
        validationSchema={registerValidationSchema}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
      >
        {({ isSubmitting }) => (
          <Form className="default-card-container w-[80vw] max-w-[400px] gap-5 px-12 py-10">
            <span className="text-2xl">Register New Account</span>
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
            <Field
              type="password"
              name="confirm_password"
              className="form-input"
              placeholder="confirm password"
            />
            <ErrorMessage
              name="confirm_password"
              component="div"
              className="text-destructive -my-2"
            />
            <Button size="lg" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
            <span className="-my-2">{isLoading ? "Loading..." : ""}</span>
            <span className="text-destructive -my-2">
              {errorMessage !== "" ? errorMessage : ""}
            </span>
            <span className="-my-2 text-primary">
              {successMessage !== "" ? successMessage : ""}
            </span>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterPage;
