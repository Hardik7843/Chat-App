// import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import NavBar from './components/Navbar'
import { useEffect, useRef } from "react"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from "./pages/LoginPage"
import { useAuthStore } from "./store/useAuthStore.js"
import {Loader} from 'lucide-react'
import { Toaster } from "react-hot-toast"



function App() {

  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore()

  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // console.log("User Data: ", authUser)
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster/>
    </>
  )
}

export default App
