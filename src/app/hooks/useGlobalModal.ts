import { useContext } from "react";
import { ModalContext } from "@/app/contexts/ModalContext";
import type { ModalContextType } from "@/app/contexts/ModalContext";

export const useGlobalModal = (): ModalContextType =>{ 
    const context = useContext(ModalContext);
    if(!context) {
        throw new Error("useGlobalModal must be used within a ModalProvider");
    }
    return context;
};
