import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";
import ProfilePage from "./scenes/profilePage";
import MessagePage from "./scenes/messagePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Navbar from "./scenes/navbar";
import PostPage from "./scenes/postPage";
import {io} from "socket.io-client";
import { useEffect } from "react";
import { ToastContainer} from 'react-toastify';
import HelpPage from "./scenes/helpPage";
import SettingsPage from "./scenes/settingPage";

function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const socket  = io(backendUrl);
  const mode = useSelector((state) => state.mode);
  const isAuth = Boolean(useSelector((state) => state.token));
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  useEffect(()=>{
    socket.on("connect",()=>{})
  },[])

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <CssBaseline />
      <Routes>
        {/* Public route */}
        <Route path="/" element={
          <LoginPage />
          } />

        {/* Protected routes */}
        <Route
          path="/home"
          element={isAuth ? <HomePage />:<Navigate to="/"/>}
        />
        <Route
          path="/profile/:userId"
          element={ isAuth ?
            <ProfilePage /> :<Navigate to="/"/>
          }
        />
        <Route
          path="/posts/:postId"
          element={<PostPage/>
          }
        />
        <Route
          path="/message"
          element={isAuth ? <MessagePage />:<Navigate to="/"/>}
        />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Wildcard for unknown URLs */}
        {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
