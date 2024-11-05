const express=require('express')
// const app= express();
const port=2003;
const cors = require('cors')
const cookieParser = require('cookie-parser');
// const chats=require('./Seeds/data (1).js')
const connectDB = require('./Seeds/index.js')
const userroutes = require('./routes/user/userroutes.js')
const chatroutes = require('./routes/chat/chatroutes.js')
const dotenv = require('dotenv')
dotenv.config()
const {app,server} = require('./Socket/index.js')

connectDB()  //conecting mongodb

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user',userroutes)
app.use('/chat',chatroutes)
app.use("/" , (req,res)=>{
    res.send("Server is running")
}
)
app.use(cors({
    // origin: process.env.FRONTEND_URL,
    origin:'*',
    credentials: true
}))

server.listen(port,()=>{
    console.log("app is listening on port 2003")
})