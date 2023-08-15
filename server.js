const express=require("express")
const app=express()
const dbConfig=require("./config/dbConfig")
require('dotenv').config()
app.use(express.json())
const guideRoutes=require("./routes/guideRoutes")
const guestRoutes=require('./routes/guestRoutes')
const adminRoutes=require('./routes/adminRoutes')

app.use("/api/guide/",guideRoutes)  

app.use("/api/guest/",guestRoutes)

app.use('/api/admin/',adminRoutes)

const port=process.env.PORT||5000;


app.listen(port,()=>console.log(`server started at ${port}`))