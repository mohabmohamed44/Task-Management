import React, { useState } from "react";
import type { ModalState } from "@/types/Modal.types";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/presentation/components/ui/dialog";

import { ModalContext } from "@/app/contexts/ModalContext";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        content: null,
    });

    const openModal = (content: React.ReactNode) => {
        setModal({ isOpen: true, content });
    };

    const closeModal = () => {
        setModal({ isOpen: false, content: null });
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Dialog open={modal.isOpen} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogTitle className="sr-only">Modal</DialogTitle>
                    <DialogDescription className="sr-only">
                        Modal content
                    </DialogDescription>
                    {modal.content}
                </DialogContent>
            </Dialog>
        </ModalContext.Provider>
    );
};
