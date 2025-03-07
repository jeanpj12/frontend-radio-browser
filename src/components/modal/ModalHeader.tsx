import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalHeaderProps {
  title: ReactNode;
  onAction: () => void;
}

export function ModalHeader({ title, onAction }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between font-bold text-sm">
      {title}
      <button onClick={onAction} className="cursor-pointer">
        <IoMdClose />
      </button>
    </div>
  );
}
