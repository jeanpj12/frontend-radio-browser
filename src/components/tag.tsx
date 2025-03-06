interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  return (
    <div className="text-xs bg-gray-900 rounded-full text-white px-3 py-1 whitespace-nowrap text-ellipsis">{label}</div>
  );
}
