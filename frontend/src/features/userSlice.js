import { createSlice }  from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    loginError : false, 
    loginLoading : false
};

const userSlice = createSlice({
     name : "user", 
     initialState,
     reducers:{
        signInStart : (state)=>{
             state.loginLoading = true;
             state.loginError = null;
        },
        signInSuccess : (state,action)=>{
            state.currentUser = action.payload;
            state.loginLoading = false;
            state.loginError = null;
        },
        signInFailure : (state,action)=>{
            state.loginLoading = false;
            state.loginError = action.payload;
        },
        signOutSuccess : (state)=>{
            state.currentUser = null;
            state.loginLoading = false;
            state.loginError = null;
        },
        registerStart : (state)=>{
            state.loginLoading = true;
            state.loginError = null;
        },
        registerSuccess : (state,action)=>{
             state.currentUser = action.payload;
             state.loginLoading = false;
             state.loginError = null;
        },
        registerFailure : (state,action)=>{
            state.loginLoading = false;
            state.loginError = action.payload;
        }


     }
});

export const { signInStart,signInSuccess,signInFailure,signOutSuccess , registerStart, registerSuccess, registerFailure} = userSlice.actions;
export default userSlice.reducer