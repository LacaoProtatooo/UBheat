import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerificationModal from "../common/verificationModal";
import { useNavigate } from "react-router-dom";
import { useModal } from "../ui/animated-modal";

export function Signup() {
  const navigate = useNavigate();
  const { setOpen } = useModal();

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[~!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]/, "Password must contain at least one special character.")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const loadingToastId = toast.loading("Signing up...");
      try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: values.firstname,
            lastName: values.lastname,
            email: values.email,
            password: values.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.update(loadingToastId, {
            render:
              "Signup successful! Please check your email to verify your account.",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          setOpen(true); // Open the verification modal
        } else {
          toast.update(loadingToastId, {
            render: data.msg || "Registration failed",
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
        }
      } catch (error) {
        toast.update(loadingToastId, {
          render: "An error occurred. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleVerifyEmail = async (code) => {
    try {
      const response = await fetch("http://localhost:5173/api/auth/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      console.log("Verification response:", data);
      if (data.success) {
        toast.success("Email verified successfully!");
        navigate("/login");
        setOpen(false);
      } else {
        console.error("Error verifying email:", data.message);
        toast.error("Wrong Verification Code Provided.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('src/assets/BG.gif')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <ToastContainer />
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to UBheat
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Sign up to UBheat to check our real time heatmap.
        </p>

        <form className="my-8" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                name="firstname"
                placeholder="John"
                type="text"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <p className="text-red-500 text-sm">{formik.errors.firstname}</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                name="lastname"
                placeholder="Doe"
                type="text"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastname && formik.errors.lastname && (
                <p className="text-red-500 text-sm">{formik.errors.lastname}</p>
              )}
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              placeholder="abc@gmail.com"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
            )}
          </LabelInputContainer>

          <button
            className={cn(
              "bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
            )}
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing up..." : "Sign up →"}
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
        <VerificationModal onVerify={handleVerifyEmail} />
      </div>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Signup;
