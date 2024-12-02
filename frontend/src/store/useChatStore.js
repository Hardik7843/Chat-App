import { AXIOS } from "../lib/axios.js";
import { create } from "zustand";
import toast from "react-hot-toast";    
import { all } from "axios";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true})
        try {
            const res = await AXIOS.get('/message/users')
            // set({users : [...res.data]})
            set({users : res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({isUsersLoading: false})
        }
    },
    
    getMessages: async (UserToChatId) => {
        set({isMessagesLoading : true})
        try {
            const allMessages = await AXIOS.get(`/message/${UserToChatId}`)
            // const allMessages = await AXIOS.get('/message', {
            //     params : {
            //         id : UserToChatId
            //     }
            // })
            // console.log("allMessages", allMessages)
            set({messages : allMessages.data})

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isMessagesLoading: false})
        }

    },

    sendMessage : async (meesageData) => {
        const {selectedUser, messages} = get()
        
        try {
            const response = await AXIOS.post(`/message/send/${selectedUser._id}`, meesageData)
            set({messages : [...messages, response.data]})
            toast.success(`message sent to ${selectedUser.fullName}`)
        }
        catch(error) {
            toast.error(error.response.data.message);
        }
        
    },
    
    subscribeToMessages : () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            
            console.log("newMessage hehe: ", newMessage);

            set({ messages: [...get().messages, newMessage] });
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },


    setSelectedUser : (selectedUser) => set({selectedUser}),
}))