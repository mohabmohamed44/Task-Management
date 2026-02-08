import { createContext } from "react";

export interface ModalContextType {
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);
