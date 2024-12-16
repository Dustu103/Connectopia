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

app.use(cors({origin:'*'}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/" , (req,res)=>{
    res.send("Server is running")
}
)
app.use('/user',userroutes)
app.use('/chat',chatroutes)



server.listen(port,()=>{
    console.log("app is listening on port 2003")
})