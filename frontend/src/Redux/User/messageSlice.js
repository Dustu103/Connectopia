import { createSlice } from '@reduxjs/toolkit'

const initialState={
    messages:[
        {
            id:1,
            text:""
        }
    ]
}

export const messageSlice = createSlice({
    name:"messsage",
    initialState,
    reducers:{
        addmessage: (state,action)=>{
            const message={
            id:0,
            text: action.payload
            }
            state.messages.push(message)
        }
    }
})

export const {addmessage} =messageSlice.actions

export default messageSlice.reducer