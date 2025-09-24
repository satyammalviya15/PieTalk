import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
  Avatar,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LogoutIcon from "@mui/icons-material/Logout";
import Navbar from "../navbar";

// ✅ Validation Schema
const settingsSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .nullable(),
  picture: yup.mixed(),
  linkedIn: yup.string().url("Must be a valid URL").nullable(),
  twitter: yup.string().url("Must be a valid URL").nullable(),
  github: yup.string().url("Must be a valid URL").nullable(),
});

const SettingsPage = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [tabIndex, setTabIndex] = useState(0);
  const [notifications, setNotifications] = useState({
    chat: true,
    email: true,
    app: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const initialValues = {
    username: "John Doe",
    email: "johndoe@example.com",
    password: "",
    picture: null,
    linkedIn: "",
    twitter: "",
    github: "",
  };

  const passwordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 5) strength += 30;
    if (/[A-Z]/.test(password)) strength += 30;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength > 100 ? 100 : strength;
  };

  const handleSaveSettings = async (values, onSubmitProps) => {
    console.log(
      "Saved settings:",
      values,
      notifications,
      darkMode,
      twoFactorAuth
    );
    setSnackbarOpen(true);
    onSubmitProps.setSubmitting(false);
    setSaveEnabled(false);
  };

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          mx: { xs: 3, sm: 3, md: 5, lg: 10 }, 
          my: { xs: 2, sm: 3, md: 3 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          variant={isNonMobile ? "standard" : "scrollable"}
          scrollButtons={isNonMobile ? false : "auto"}
          sx={{ mb: 4 }}
        >
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Preferences" />
          <Tab label="Social Links" />
          <Tab label="Account Actions" />
        </Tabs>

        <Formik
          onSubmit={handleSaveSettings}
          initialValues={initialValues}
          validationSchema={settingsSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              {/* ---------------------- PROFILE TAB ---------------------- */}
              {tabIndex === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Username"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        setSaveEnabled(true);
                      }}
                      value={values.username}
                      name="username"
                      error={
                        Boolean(touched.username) && Boolean(errors.username)
                      }
                      helperText={touched.username && errors.username}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        setSaveEnabled(true);
                      }}
                      value={values.email}
                      name="email"
                      error={Boolean(touched.email) && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        setFieldValue("picture", acceptedFiles[0]);
                        setProfilePreview(
                          URL.createObjectURL(acceptedFiles[0])
                        );
                        setSaveEnabled(true);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${theme.palette.primary.main}`}
                          p={2}
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <Typography>Add Profile Picture</Typography>
                          ) : (
                            <FlexBetween>
                              <Avatar
                                src={profilePreview}
                                alt="profile preview"
                                sx={{ width: 60, height: 60 }}
                              />
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Grid>
                </Grid>
              )}

              {/* ---------------------- SECURITY TAB ---------------------- */}
              {tabIndex === 1 && (
                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="New Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setSaveEnabled(true);
                    }}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
                  />
                  {values.password && (
                    <Box>
                      <Typography variant="caption">
                        Password Strength
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength(values.password)}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                  )}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={twoFactorAuth}
                        onChange={() => {
                          setTwoFactorAuth(!twoFactorAuth);
                          setSaveEnabled(true);
                        }}
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                </Box>
              )}

              {/* ---------------------- PREFERENCES TAB ---------------------- */}
              {tabIndex === 2 && (
                <Box display="flex" flexDirection="column" gap={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.chat}
                        onChange={() => {
                          setNotifications({
                            ...notifications,
                            chat: !notifications.chat,
                          });
                          setSaveEnabled(true);
                        }}
                      />
                    }
                    label="Chat Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.email}
                        onChange={() => {
                          setNotifications({
                            ...notifications,
                            email: !notifications.email,
                          });
                          setSaveEnabled(true);
                        }}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.app}
                        onChange={() => {
                          setNotifications({
                            ...notifications,
                            app: !notifications.app,
                          });
                          setSaveEnabled(true);
                        }}
                      />
                    }
                    label="App Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={darkMode}
                        onChange={() => {
                          setDarkMode(!darkMode);
                          setSaveEnabled(true);
                        }}
                      />
                    }
                    label="Dark Mode"
                  />
                </Box>
              )}

              {/* ---------------------- SOCIAL LINKS TAB ---------------------- */}
              {tabIndex === 3 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="LinkedIn URL"
                      value={values.linkedIn}
                      onChange={(e) => {
                        handleChange(e);
                        setSaveEnabled(true);
                      }}
                      name="linkedIn"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Twitter URL"
                      value={values.twitter}
                      onChange={(e) => {
                        handleChange(e);
                        setSaveEnabled(true);
                      }}
                      name="twitter"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="GitHub URL"
                      value={values.github}
                      onChange={(e) => {
                        handleChange(e);
                        setSaveEnabled(true);
                      }}
                      name="github"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              )}

              {/* ---------------------- ACCOUNT ACTIONS TAB ---------------------- */}
              {tabIndex === 4 && (
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => alert("Delete account clicked")}
                  >
                    Delete Account
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<LogoutIcon />}
                    onClick={() => alert("Logout clicked")}
                  >
                    Logout
                  </Button>
                </Box>
              )}

              {/* ---------------------- SAVE BUTTON ---------------------- */}
              <Button
                type="submit"
                disabled={!saveEnabled || isSubmitting}
                sx={{
                  mt: 4,
                  p: "1rem",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                Save Changes
              </Button>

              {/* ---------------------- HELPER TEXT ---------------------- */}
              <Typography
                variant="body2"
                color="textSecondary"
                mt={2}
                sx={{ fontStyle: "italic" }}
              >
                Tip: Make sure to save your settings after making changes.
              </Typography>

              {/* ---------------------- DIVIDERS ---------------------- */}
              <Divider sx={{ my: 4 }} />

              {/* ---------------------- FAQ / HELP LINKS ---------------------- */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Need Help?
                </Typography>
                <Typography variant="body2">
                  Visit our <a href="/help">Help Center</a> for guidance on
                  using the platform and managing your account.
                </Typography>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* ---------------------- NOTIFICATIONS INFO ---------------------- */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  About Notifications
                </Typography>
                <Typography variant="body2" gutterBottom>
                  You can customize which notifications you want to receive.
                  Turn off any notifications you don't want to get.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Chat Notifications: Receive messages from your contacts.{" "}
                  <br />
                  Email Notifications: Updates, newsletters, and alerts via
                  email. <br />
                  App Notifications: In-app notifications for updates and
                  reminders.
                </Typography>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* ---------------------- PROFILE PREVIEW ---------------------- */}
              <Box mt={4} display="flex" alignItems="center" gap={3}>
                <Avatar
                  src={profilePreview}
                  alt="Profile Preview"
                  sx={{ width: 80, height: 80 }}
                />
                <Box>
                  <Typography variant="subtitle1">{values.username}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {values.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {twoFactorAuth ? "2FA Enabled" : "2FA Disabled"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* ---------------------- FOOTER / INFO ---------------------- */}
              <Box mt={6} textAlign="center">
                <Typography variant="caption" color="textSecondary">
                  &copy; 2025 PieTalk. All rights reserved.
                </Typography>
              </Box>
            </form>
          )}
        </Formik>

        {/* ---------------------- SNACKBAR / TOAST ---------------------- */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Settings saved successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SettingsPage;
