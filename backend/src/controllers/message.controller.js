import User from "../models/user.model.js";
import Message from '../models/message.model.js'
import cloudinary from 'cloudinary'
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
  
      res.status(200).json(filteredUsers);
    } catch (error) {
      console.error("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
  try {
    const {id:UserToChatId} = req.params
    const loggedInUserId = req.user._id

    const messages = await Message.find({
      $or:[
        {senderId:loggedInUserId, receiverId:UserToChatId},
        {senderId:UserToChatId, receiverId:loggedInUserId}
      ]
    })

    res.status(200).json(messages)
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const sendMessage = async (req, res) => {
  const UserToChatId = req.params.id
  const loggedInUserId = req.user._id
  const {message, image} = req.body

  try {
    if(!message && !image) {
      return res.status(400).json({message: "Bad Request : The message is Empty"})
    }

    let imageUrl = "";
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId:loggedInUserId,
      receiverId:UserToChatId,
      text:message,
      image: imageUrl
    })
    
    await newMessage.save()

    // console.log("newMessage: ", newMessage)
    //TODO : real time functionality with socketIo
    const receiverSocketId = getReceiverSocketId(UserToChatId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    const UserToChat = await User.findById(UserToChatId)
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage: ", error.message)
    return res.status(500).json({error: "Internal Server Error"})
  }
}