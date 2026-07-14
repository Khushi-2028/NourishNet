import { createSlice } from "@reduxjs/toolkit";
import { getStoredTheme, setStoredTheme } from "../../utils/storage";

const prefersDark =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const initialTheme = getStoredTheme() || (prefersDark ? "dark" : "light");

const initialState = {
  theme: initialTheme,
  sidebarCollapsed: false,
  mobileSidebarOpen: false
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      setStoredTheme(state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      setStoredTheme(action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarOpen = false;
    }
  }
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  toggleMobileSidebar,
  closeMobileSidebar
} = uiSlice.actions;

export const selectTheme = (state) => state.ui.theme;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectMobileSidebarOpen = (state) => state.ui.mobileSidebarOpen;

export default uiSlice.reducer;
