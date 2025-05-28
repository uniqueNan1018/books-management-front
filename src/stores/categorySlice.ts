import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryBase } from "../components/CategoryManage/CategoryType";

const initialState: CategoryBase[] = [];

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        update(state, action: PayloadAction<CategoryBase[]>) {
            return action.payload;
        }
    }
});

export const { update } = categorySlice.actions;
export default categorySlice.reducer;