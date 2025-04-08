import { useRef } from "react";

export interface IButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "icon" | "link";
  onClick?: () => void;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
}

export default function Button({
  label,
  variant = "primary",
  onClick,
  className,
  type,
}: IButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter") {
      buttonRef.current?.click();
    }
  };

  const defaultStyles = "w-full rounded-lg px-4 py-2 cursor-pointer ";

  const buttonStyles = () => {
    switch (variant) {
      case "primary":
        return (
          defaultStyles +
          "bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-600/90"
        );
      case "ghost":
        return (
          defaultStyles +
          "bg-transparent border hover:bg-gray-900/30 active:bg-gray-700/50"
        );
      case "link":
        return (
          defaultStyles +
          "bg-transparent border-b-2 rounded-none !w-auto !py-0 !px-1"
        );
      default:
        return (
          defaultStyles +
          "w-full bg-indigo-700 rounded-lg px-4 py-1 cursor-pointer hover:bg-indigo-600 active:bg-indigo-600/90"
        );
    }
  };

  const handleButtonClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`${buttonStyles()} ${className}`}
      onKeyDown={handleKeyDown}
      onClick={handleButtonClick}
    >
      {label}
    </button>
  );
}
