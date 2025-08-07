import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Branch } from '../../@types/User';



interface UserState{
    users:Branch[],
    loading: boolean,
    error: string | null,
};

const initialState:UserState = {
    users: [
        {
            id:'hfdjshjgdj87584fhdjshy784y',
            branchName:'KALLIKUPPAM NKC',
            phone:'9876543210',
            routeName:'KALLIKUPPAM NKC',
            type:'NKC Local',
            address:"",
            contactPerson:'kumaran',
            location:'chennai'
        },

    ],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        // add user
        addUser: (state, action:PayloadAction<Branch>) => {
            state.users.push(action.payload);
        },
        // Update user
        editUser: (state, action:PayloadAction<Branch>) => {
            const userIndex = state.users.findIndex((user: Branch) => user.id === action.payload.id);
            if (userIndex !== -1) {
                state.users[userIndex] = action.payload;
            }else{
                state.users.push(action.payload);
            }
        },
        // Delete user
        removeUser: (state, action:PayloadAction<string>) => {
            state.users = state.users.filter((user: Branch) => user.id !== action.payload);
        },
    }
});



export default userSlice.reducer;
export const {addUser,editUser,removeUser} = userSlice.actions;