import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    isLoggedIn: boolean;
    name: string;
    isManager: boolean;
}

interface LoginPayload {
    name: string;
    isManager: boolean;
}

const initialState: UserState = {
    isLoggedIn: false,
    name: '',
    isManager: false,
};


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action: PayloadAction<LoginPayload>) {
            const {name, isManager} = action.payload;
            state.name = name;
            state.isManager = isManager;
            state.isLoggedIn = true;
        },
        logout(state) {
            state.name = "";
            state.isManager = false;
            state.isLoggedIn = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;