import { ButtonHTMLAttributes } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

interface StationFavoriteProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isFavorite: boolean;
}

export function StationFavorite({ isFavorite, ...rest }: StationFavoriteProps) {
  return (
    <button className="cursor-pointer" {...rest}>
      {isFavorite ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
    </button>
  );
}
