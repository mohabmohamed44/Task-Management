import { useState } from "react";

export const useExportHandlers = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const openExportModal = () => {
    setIsExportModalOpen(true);
  };

  const closeExportModal = () => {
    setIsExportModalOpen(false);
  };

  return {
    isExportModalOpen,
    openExportModal,
    closeExportModal,
  };
};