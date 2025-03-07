import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleLoginButton from '../../components/ui/GoogleLoginButton';


export function LoginForm() {
  const [errors, setErrors] = useState({});
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    return errors;
  };

  const validatePassword = (password) => {
    const errors = {};
    if (!password) errors.password = "Password is required";
    return errors;
  };

  const validateOTP = (otp) => {
    const errors = {};
    if (!otp) errors.otp = "OTP is required";
    else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      errors.otp = "OTP must be 6 digits";
    }
    return errors;
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    
    const emailErrors = validateEmail(email);
    const passwordErrors = validatePassword(password);
    const newErrors = { ...emailErrors, ...passwordErrors };
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // First, request an OTP
      const response = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('OTP sent to your email. Please check and enter below.');
        setShowOTPForm(true);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    const otpErrors = validateOTP(otp);
    if (Object.keys(otpErrors).length > 0) {
      setErrors(otpErrors);
      return;
    }

    setLoading(true);
    try {
      // First verify the OTP
      const otpResponse = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const otpData = await otpResponse.json();
      
      if (!otpResponse.ok) {
        throw new Error(otpData.message || 'OTP verification failed');
      }
      
      // If OTP is verified, proceed with login
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        if (!loginData.isActive) {
          toast.error('Your account is not active. Please contact support.');
          return;
        }
        
        localStorage.setItem('token', loginData.token);
        toast.success('Login successful!');
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        
      } else {
        toast.error(loginData.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors(prev => ({ ...prev, email: null }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors(prev => ({ ...prev, password: null }));
  };

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
    setErrors(prev => ({ ...prev, otp: null }));
  };

  const handleBackToLogin = () => {
    setShowOTPForm(false);
    setOtp("");
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
          Welcome Back to UBheat
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login to access real-time heatmap updates.
        </p>

        {!showOTPForm ? (
          // First Form - Email and Password
          <form className="my-8" onSubmit={handleInitialSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                placeholder="abc@gmail.com" 
                type="email" 
                value={email}
                onChange={handleEmailChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </LabelInputContainer>
            <LabelInputContainer className="mb-8">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </LabelInputContainer>

            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Continue →'}
              <BottomGradient />
            </button>

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

            <div className="flex flex-col space-y-4">
              <GoogleLoginButton />
            </div>
          </form>
        ) : (
          // Second Form - OTP Verification
          <form className="my-8" onSubmit={handleOTPSubmit}>
            <div className="mb-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                We've sent a verification code to <strong>{email}</strong>
              </p>
              <LabelInputContainer>
                <Label htmlFor="otp">Enter 6-digit OTP</Label>
                <Input 
                  id="otp" 
                  placeholder="123456" 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={handleOTPChange}
                />
                {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
              </LabelInputContainer>
            </div>

            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
              <BottomGradient />
            </button>
            
            <button
              type="button"
              onClick={handleBackToLogin}
              className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline w-full text-center"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
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