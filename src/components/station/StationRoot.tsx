import { ReactNode } from "react";

interface StationRootProps {
  children: ReactNode;
}

export function StationRoot({ children }: StationRootProps) {
  return (
    <div className="w-full rounded-md p-2 flex gap-2 justify-between items-center hover:bg-gray-200">
      {children}
    </div>
  );
}
