const express = require("express");
const socketIo = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const app = express();
const chatSchema=require('./Models/Chatshema')
app.use(express.json({ limit: "50mb" }));
const corsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
const { mongooseConnection } = require("./config/mongoose");
mongooseConnection();
const UserRouter = require("./Routers/User");
const AdminRouter = require("./Routers/Admin");
app.use("/admin", AdminRouter);
app.use("/", UserRouter);


const server = app.listen(process.env.PORT, () => {
  console.log("server start");
});

const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
io.of("/chat").on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    console.log(roomId);
    // Join the specific room based on the clubId
    socket.join(roomId);
    console.log(`Socket joined room: ${roomId}`);
  });

  socket.on("chatMessage", (roomId, message) => {
    console.log(`Received message: ${message} in room: ${roomId}`);
    console.log(message.timestamp);
    // Emit the message to the specific room based on the clubId
    io.of("/chat").to(roomId).emit("message", message, roomId);
     addMessage(roomId,message)
  });
});
async function addMessage(roomid,obj){
   await chatSchema.updateOne({_id:roomid},{$push:{messages:{ID:obj.ID,text:obj.text}}}) 
}
