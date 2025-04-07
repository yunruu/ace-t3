"use client";

import GameBoard from "@/app/components/gameboard";
import Login from "./components/login";
import { useEffect, useState } from "react";
import Toast, { IToastProps, toast } from "./components/ui/toast";
import Spinner from "./components/ui/spinner";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastController, setToastController] = useState<IToastProps>({
    message: "",
    isOpen: false,
    toastType: "success",
  });

  useEffect(() => {
    setIsMounted(true); // Set to true after the component mounts
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast("Logged in successfully", "success", setToastController);
  };

  if (!isMounted) {
    return (
        <Spinner className="m-auto h-full flex items-center"/>
    );
  }

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
