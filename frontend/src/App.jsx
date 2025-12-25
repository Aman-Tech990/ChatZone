import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import SettingsPage from "./pages/SettingsPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import { userAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"

function App() {

  const { authUser, checkAuth } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App
