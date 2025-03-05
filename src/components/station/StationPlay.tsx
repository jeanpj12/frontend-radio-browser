import { ButtonHTMLAttributes } from "react";
import { FaPlay } from "react-icons/fa";

export function StationPlay({
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="cursor-pointer" {...rest}>
      <FaPlay size={20} />
    </button>
  );
}
