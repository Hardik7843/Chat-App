import {create} from 'zustand'
import { AXIOS } from '../lib/axios.js';
import toast from 'react-hot-toast';
import io from 'socket.io-client'

// const BASE_URL = import.meta.env.VITE_BASE_URL
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/api" 

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket : null,

    checkAuth: async () => {
      try {
        const res = await AXIOS.get("/auth/check");

        set({ authUser: res.data });
        get().connectSocket();
      } catch (error) {
        console.log("Error in checkAuth:", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await AXIOS.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
        get().connectSocket();
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

    signup: async (data) => {
      
      set({ isSigningUp: true });
      try {
        const res = await AXIOS.post("/auth/signup", data);
        set({ authUser: res.data });

        toast.success("Account created successfully");
        get().connectSocket();
      } catch (error) {
        console.log("Error in signup", error)
        toast.error(error.response.data.message);
      } finally {
        set({ isSigningUp: false });
      }
    },

    logout: async () => {
      try {
        await AXIOS.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
        get().disconnectSocket();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

    updateProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await AXIOS.put("/auth/updateProfile", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } catch (error) {
        console.log("error in update profile:", error);
        toast.error(error.response.data.message);
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    connectSocket: () => {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) return;
  
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
      });
      socket.connect();
  
      set({ socket: socket });
  
      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    },

    disconnectSocket : () => {
      try {
        if (get().socket?.connected) get().socket.disconnect();
      }
      catch(error) {
        console.log("Error in disconnecting Socket on client-side", error)
      }
    }

  }
))