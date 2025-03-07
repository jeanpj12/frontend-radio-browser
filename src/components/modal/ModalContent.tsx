import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  return <div className={twMerge(className)}>{children}</div>;
}
