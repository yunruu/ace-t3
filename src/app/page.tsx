"use client";

import GameBoard from "@/app/components/gameboard";
import Login from "./components/login";
import { useState } from "react";
import Toast, { IToastProps } from "./components/ui/toast";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastController, setToastController] = useState<IToastProps>({
    message: "",
    isOpen: false,
    toastType: "success",
  });

  const toast = (message: string, toastType:  "success" | "warning" | "danger") => {
    setToastController({
      message,
      isOpen: true,
      toastType,
    });
    setTimeout(() => {
      setToastController({
        ...toastController,
        isOpen: false,
      });
    }, 5000);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast("Logged in successfully", "success");
  };

  return (
    <div>
      <h1 className="font-bold text-4xl">Tic tac toe</h1>
      {isLoggedIn ? <GameBoard /> : <Login onLogin={handleLogin} />}
      <Toast
        message={toastController.message}
        isOpen={toastController.isOpen}
        toastType={toastController.toastType}
      />
    </div>
  );
}
