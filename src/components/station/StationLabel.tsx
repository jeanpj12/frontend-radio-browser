import { twMerge } from "tailwind-merge";

interface StationLabelProps {
  label: string;
  className?: string;
}

export function StationLabel({ label, className }: StationLabelProps) {
  return (
    <span
      className={twMerge(
        "overflow-hidden whitespace-nowrap text-ellipsis",
        className
      )}
    >
      {label}
    </span>
  );
}
