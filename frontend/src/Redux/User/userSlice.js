import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [
        {
            _id: "",
            name: "",
            profile_pic: "",
            token: "",
            onlineUser: []
        }
    ], 
    isAuthenticated: false
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.users = [action.payload];
            state.isAuthenticated = true;
        },
        updateUser: (state, action) => {
            state.users[0] = {
                ...state.users[0],
                ...action.payload
            };
        },
        logout: (state) => {
            state.users = [{ _id: "", name: "", profile_pic: "", token: "", onlineUser: [] }];
            state.isAuthenticated = false;
        },
        setOnlineUser: (state, action) => {
            state.users[0].onlineUser = action.payload;
        },
    }
});

export const { setUser, updateUser, setOnlineUser, logout } = userSlice.actions;

export default userSlice.reducer;
