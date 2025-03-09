import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Loading from "./loading";
import FloatingDockUBheat from "../common/floatingdock";
import { useNavigate } from "react-router-dom";
import { checkAuthStatus, handleLogout } from "../../utils/userauth";

const UserProfile = () => {
  const [user, setUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    image: { public_id: "", url: "" },
    isVerified: false,
    isActive: false,
    isAdmin: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated; if not, redirect to login.
  useEffect(() => {
    if (!checkAuthStatus()) {
      navigate("/login");
    } else {
      getProfile();
    }
  }, [navigate]);

  const getProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/auth/current-user", { withCredentials: true });
      setUser(data.user);
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUser((prevUser) => ({
          ...prevUser,
          image: { ...prevUser.image, url: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("firstName", values.firstName || "");
      formData.append("lastName", values.lastName || "");

      if (imageFile) {
        formData.append("upload_profile", imageFile);
      }

      const { data } = await axios.put("http://localhost:5000/api/auth/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!");
      setUser(data.user);
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // New logout handler using handleLogout from userauth.
  const logout = async () => {
    try {
      await handleLogout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(`Error logging out: ${error.message}`);
    }
  };

  // Formik initial values reflect the current user data.
  const initialValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
  };

  // Validation Schema using Yup.
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "transparent" }}>
      <Loading loading={loading} />

      <Box
        sx={{
          width: { lg: "80%", md: "90%", xs: "96%" },
          mx: "auto",
          display: "flex",
          gap: 4,
          py: { lg: 8, md: 6, sm: 8, xs: 6 },
          flexGrow: 1,
          mt: 5,
        }}
      >
        <Box
          sx={{
            width: { lg: "88%", md: "80%", sm: "88%", xs: "100%" },
            mx: "auto",
            boxShadow: 3,
            p: 4,
            borderRadius: 2,
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "white"),
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { lg: "2rem", md: "1.75rem", sm: "1.5rem", xs: "1.5rem" },
              fontWeight: "bold",
              fontFamily: "serif",
              mb: 2,
              color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
            }}
          >
            Profile
          </Typography>

          {/* Display account verification status */}
          {user.isVerified ? (
            <Typography variant="body1" sx={{ mb: 2, color: "green" }}>
              Account Verified
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ mb: 2, color: "red" }}>
              Account Not Verified
            </Typography>
          )}

          <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize onSubmit={handleSubmit}>
            {({ errors, touched, handleChange }) => (
              <Form>
                {/* Profile Image */}
                <Box
                  sx={{
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    backgroundImage: `url(${user.image?.url || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: "relative",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <input type="file" id="upload_profile" hidden onChange={handleImageChange} />
                  <label htmlFor="upload_profile">
                    <Box
                      sx={{
                        backgroundColor: "white",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="20" height="20" fill="none" strokeWidth="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                    </Box>
                  </label>
                </Box>
                <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 1, fontWeight: "bold" }}>
                  Upload Profile Image
                </Typography>

                {/* Form Fields */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 4 }}>
                  <Field as={TextField} fullWidth label="Email" name="email" disabled value={user.email} />
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="First Name"
                    name="firstName"
                    error={touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                    onChange={handleChange}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    error={touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                    onChange={handleChange}
                  />
                </Box>
                {/* Two buttons side by side */}
                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                  <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: "black", color: "white" }}>
                    Save Changes
                  </Button>
                  <Button variant="contained" type="button" onClick={logout} fullWidth sx={{ backgroundColor: "red", color: "white" }}>
                    Log Out
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
      <FloatingDockUBheat />
    </Box>
  );
};

export default UserProfile;
