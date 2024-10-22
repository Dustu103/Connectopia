import { configureStore } from '@reduxjs/toolkit'
// const userReducer = require('../User/userSlice')
// const messageReducer = require('../User/messageSlice')
import userReducer from '../User/userSlice'
import messageReducer from '../User/messageSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer
  },
})