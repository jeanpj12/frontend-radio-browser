import { ReactNode } from "react";

interface ModalRootProps {
  children: ReactNode;
}

export function ModalRoot({ children }: ModalRootProps) {
  return (
    <div className="fixed max-w-full inset-0 bg-gray-900/35 transition-opacity">
      <div className="flex h-full items-center justify-center p-5 max-w-full">
        <div className="box-border border border-gray-300 max-w-full rounded-md bg-white shadow-md px-4 py-2 flex flex-col gap-4 fixed z-10 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
