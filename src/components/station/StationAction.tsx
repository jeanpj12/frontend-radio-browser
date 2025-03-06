import { ButtonHTMLAttributes, ElementType } from "react";

interface StationActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon?: ElementType;
}

export function StationAction({ Icon, ...rest }: StationActionProps) {
  return (
    <button className="cursor-pointer" {...rest}>
      {Icon && <Icon size={20} />}
    </button>
  );
}
