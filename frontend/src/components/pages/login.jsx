import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { toast } from "react-toastify";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import FloatingDockUBheat from "../common/floatingdock.jsx";

// Firebase imports from your previous project
import { auth, googleProvider } from "../../utils/firebaseConfig.js";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

export function LoginForm({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          values,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const user = response.data.user;
          onLogin(user);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("isAdmin", user.isAdmin.toString());

          if (user.isAdmin) {
            navigate("/dashboard");
          } else {
            navigate("/v2");
            toast.success("Login successfully!");
          }
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setFieldError("email", err.response.data.message);
        } else {
          toast.error("Login failed. Please try again.");
        }
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await axios.post(
        "http://localhost:5000/api/auth/google-login",
        { idToken },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const user = response.data.user;
        if (onLogin) {
          onLogin(user);
        }
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isAdmin", user.isAdmin.toString());
        if (user.isAdmin) {
          navigate("/dashboard");
          toast.success("Login Success!");
        } else {
          navigate("/v2");
          toast.success("Login Success!");
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again.");
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
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome Back to UBheat
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login to access real-time heatmap updates.
        </p>

        {/* Login form with email and password */}
        <form className="my-8" onSubmit={formik.handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="abc@gmail.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </LabelInputContainer>

          <button
            className={cn(
              "bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
            )}
            type="submit"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? "Logging in..." : "Log in →"}
            <BottomGradient />
          </button>
        </form>

        <button
          className="mt-16 justify-center relative group/btn flex space-x-2 items-center px-4 w-full text-white rounded-md h-10 font-medium shadow-input bg-red-700 hover:bg-red-500 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="submit"
          onClick={handleLoginWithGoogle}
        >
          <IconBrandGoogle className="h-4 w-4 text-white dark:text-neutral-300" />
          <span className="text-white dark:text-neutral-300 text-sm">
            Sign in with Google
          </span>
        </button>

        {/* Divider */}
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        
        {/* Don't have an account? Signup button */}
        <div className="text-center mt-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="underline font-semibold text-blue-600 dark:text-blue-400"
            >
              Signup here
            </button>
          </p>
        </div>
      </div>
      <FloatingDockUBheat />
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default LoginForm;
