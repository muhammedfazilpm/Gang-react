const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const guideController = require("./controles/guideController");
const cors = require('cors');

const app = express();
const server = http.createServer(app); 

const dbConfig = require("./config/dbConfig");
require('dotenv').config();

const guideRoutes = require("./routes/guideRoutes");
const guestRoutes = require('./routes/guestRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(cors({
    credentials:true,
    origin:['http://localhost:3000']
}

        
    ));
app.use(express.json());

app.use("/api/guide/", guideRoutes);
app.use("/api/guest/", guestRoutes);
app.use('/api/admin/', adminRoutes);

const io = new Server(server, {
    cors: {
        
        origin: "*",
        methods: ["GET", "POST"]
    },
});


const port = process.env.PORT || 5000;

io.on("connect", (socket) => {
    // console.log("User connected:");
    socket.on("join-room",(data)=>{
        
        socket.join(data)
        console.log(`user with id :${socket.id} joined room:${data}`)
    })
    socket.on("send_message",async(data)=>{
        
        io.to(data.room).emit("receive_message", data);
        const {room,author,message}=data
        console.log("here for chat ",data)
             await   guideController.chatHistory(room,message,author)
    })

    
});

server.listen(port, () => console.log(`Server started at ${port}`));
