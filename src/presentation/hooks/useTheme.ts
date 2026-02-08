import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/redux/store";
import { toggleTheme, setTheme } from "@/app/redux/slices/theme.slice";

export const useTheme = () => {
    const dispatch = useDispatch<AppDispatch>();
    const mode = useSelector((state: RootState) => state.theme.mode);

    return {
        mode,
        isDark: mode == "dark",
        toggle: () => dispatch(toggleTheme()),
        setLight: () => dispatch(setTheme("light")),
        setDark: () => dispatch(setTheme("dark")),
    }
}