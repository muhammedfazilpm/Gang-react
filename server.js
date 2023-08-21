const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app); 

const dbConfig = require("./config/dbConfig");
require('dotenv').config();

const guideRoutes = require("./routes/guideRoutes");
const guestRoutes = require('./routes/guestRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(cors());
app.use(express.json());

app.use("/api/guide/", guideRoutes);
app.use("/api/guest/", guestRoutes);
app.use('/api/admin/', adminRoutes);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});

const port = process.env.PORT || 5000;

io.on("connect", (socket) => {
    // console.log("User connected:", socket.id);
    socket.on("join-room",(data)=>{
        
        socket.join(data)
        // console.log(`user with id :${socket.id} joined room:${data}`)
    })
    socket.on("send_message",(data)=>{
        
        socket.to(data.room).emit("recive_message",data)
        // console.log(data)
    })

    socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
    });
});

server.listen(port, () => console.log(`Server started at ${port}`));
