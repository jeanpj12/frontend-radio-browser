import { ButtonHTMLAttributes } from "react";
import { MdEdit } from "react-icons/md";

export function StationEdit({
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="cursor-pointer" {...rest}>
      <MdEdit size={20} />
    </button>
  );
}
