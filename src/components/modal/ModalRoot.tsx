import { ReactNode } from "react";

interface ModalRootProps {
  children: ReactNode;
}

export function ModalRoot({ children }: ModalRootProps) {
  return (
    <div className="fixed inset-0 bg-gray-900/35 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in">
      <div className="flex min-h-full items-center justify-center p-4 text-center md:items-center mds:p-0">
        <div className="border border-gray-300 rounded-md bg-white shadow-md px-4 py-2 flex flex-col gap-4 fixed z-10 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
