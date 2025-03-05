import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={twMerge(
        "w-full bg-gray-100 border border-gray-400 rounded-md h-10 placeholder:text-gray-500 text-gray-900 p-2 text-sm box-border leading-none",
        className
      )}
    />
  );
}
