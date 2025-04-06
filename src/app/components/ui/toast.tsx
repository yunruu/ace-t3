import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

export interface IToastProps {
  message: string;
  isOpen: boolean;
  toastType?: "success" | "warning" | "danger";
}

export default function Toast({ message, isOpen, toastType }: IToastProps) {
  return (
    isOpen && (
      <div
        role="alert"
        aria-live="polite"
        className="bg-gray-700 text-white fixed top-6 right-6 z-[1000] min-w-[400px] min-h-[56px] rounded-sm shadow-lg transition-opacity duration-500 flex items-center px-4 gap-4"
      >
        {toastType === "success" ? (
          <CheckCircledIcon
            color="green"
            height={24}
            width={24}
            aria-description="Check icon"
          />
        ) : (
          <ExclamationTriangleIcon
            color="orange"
            height={24}
            width={24}
            aria-description="Exclamation icon"
          />
        )}
        {message}
      </div>
    )
  );
}
