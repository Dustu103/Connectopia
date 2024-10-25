import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    users: [
        {
        _id:"",
        name:"",
        profile_pic:"",
        token:"",
        onlineUser: [],
        socketConnection: null
        }   
    ],
    isAuthenticated: false
}

export const userSlice = createSlice({
    name :"user",
    initialState,
    reducers:{
        setUser : (state, action)=>{
            // const user = action.payload;
            state.users = [action.payload];
            state.isAuthenticated = true;
        },
        updateUser: (state,action)=>{
            const updateUser = action.payload
            state.users[0]={
                ...state.users[0],
                ...updateUser
            }
        },
        logout: (state, action) => {
            state._id = "";
            state.name = "";
            state.profile_pic = "";
            state.token = "";
            state.socketConnection = null;
            state.isAuthenticated = false;
        },
        setOnlineUser : (state,action)=>{
            state.onlineUser = action.payload
        },
        setSocketConnection : (state,action) => {
            state.socketConnection = action.payload
        }
    }
})

export const {setUser,updateUser,setOnlineUser,setSocketConnection,logout} = userSlice.actions

export default userSlice.reducer