import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Dispatch, SetStateAction } from "react";

export interface IToastProps {
  message: string;
  isOpen: boolean;
  toastType?: "success" | "warning" | "danger";
}

export const toast = (
  message: string,
  toastType: "success" | "warning" | "danger",
  setToastController: Dispatch<SetStateAction<IToastProps>>,
) => {
  setToastController({
    message,
    isOpen: true,
    toastType,
  });
  setTimeout(() => {
    setToastController((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, 5000);
};

export default function Toast({ message, isOpen, toastType }: IToastProps) {
  const toastStyles =
    "bg-gray-700 text-white fixed top-6 right-6 z-[1000] sm:min-w-[400px] min-h-[56px] rounded-sm shadow-lg transition-opacity duration-500 flex items-center px-4 gap-4";

  return (
    isOpen && (
      <div role="alert" aria-live="polite" className={toastStyles}>
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
