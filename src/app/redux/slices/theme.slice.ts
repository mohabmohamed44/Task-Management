import { createSlice } from "@reduxjs/toolkit";
import { LocalStorageService } from "@/InfraStructure/storage/localStorage";
export type Theme = "light" | "dark";

interface ThemeState {
    mode: Theme;
}

const initialState: ThemeState = {
    mode: LocalStorageService.getItem<Theme>("theme") || "light",
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
            LocalStorageService.setItem("theme", state.mode);
        },
        setTheme: (state, action) => {
            state.mode = action.payload;
            LocalStorageService.setItem("theme", state.mode);
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;