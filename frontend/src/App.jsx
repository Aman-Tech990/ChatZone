import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";

function App() {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  console.log(authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-14 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element=
          {
            authUser ? <HomePage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/signup"
          element=
          {
            !authUser ? <SignupPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/login"
          element=
          {
            !authUser ? <LoginPage /> : <Navigate to="/" />

          }
        />
        <Route
          path="/settings"
          element={<SettingsPage />}
        />
        <Route
          path="/profile"
          element=
          {
            authUser ? <ProfilePage /> : <Navigate to="/login" />
          }
        />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;
