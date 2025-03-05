import { ButtonHTMLAttributes } from "react";
import { MdDelete  } from "react-icons/md";

export function StationDelete({
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="cursor-pointer" {...rest}>
      <MdDelete size={20} />
    </button>
  );
}
