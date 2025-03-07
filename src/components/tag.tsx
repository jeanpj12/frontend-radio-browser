import { ElementType } from "react";

interface TagProps {
  label: string;
  onAction?: () => void;
  Icon?: ElementType;
}

export function Tag({ label, Icon, onAction }: TagProps) {
  return (
    <div className="text-xs bg-gray-900 rounded-full text-white px-3 py-1 whitespace-nowrap text-ellipsis flex items-center gap-1">
      {label}

      {Icon && (
        <button onClick={onAction} className="cursor-pointer">
          <Icon />
        </button>
      )}
    </div>
  );
}
