import React from "react";

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import AuthLayout from "./Layout/AuthLayout";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import NotFound from "./Pages/NotFound";
import Login from "./AuthComponents/Login";
import Register from "./AuthComponents/Register";
import PostDetails from "./Pages/PostDetails";
import UserProfile from "./Pages/UserProfile";
import ChangePassword from "./Pages/ChangePassword";
import MainProtectedRoute from "./Components/Guard/MainProtectedRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainProtectedRoute><MainLayout /></MainProtectedRoute>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/:userId",
        element: <UserProfile />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/postdetails/:id",
        element: <PostDetails />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/signup",
        element: <Register />,
      },
    ],
  },
]);
