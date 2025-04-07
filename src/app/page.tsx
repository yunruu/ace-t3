"use client";

import GameBoard from "@/app/components/gameboard";
import Login from "./components/login";
import { useState } from "react";
import Toast, { IToastProps, toast } from "./components/ui/toast";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastController, setToastController] = useState<IToastProps>({
    message: "",
    isOpen: false,
    toastType: "success",
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast("Logged in successfully", "success", setToastController);
  };

  return (
    <div>
      <h1 className="font-bold text-4xl mb-4">Tic tac toe</h1>
      {isLoggedIn ? <GameBoard /> : <Login onLogin={handleLogin} />}
      <Toast
        message={toastController.message}
        isOpen={toastController.isOpen}
        toastType={toastController.toastType}
      />
    </div>
  );
}
