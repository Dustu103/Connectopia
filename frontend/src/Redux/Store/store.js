import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../User/userSlice'
import messageReducer from '../User/messageSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer
  },
})