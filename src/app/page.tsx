"use client";

import Login from "./components/login";
import { useEffect, useState } from "react";
import Toast, { IToastProps, toast } from "./components/ui/toast";
import Spinner from "./components/ui/spinner";
import { useRouter } from "next/navigation";
import { joinGame } from "@/firebase/gameService";
import { User } from "@/types";

export default function Home() {
  const router = useRouter();
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

  const startGame = async (user: User) => {
    if (!user) return;
    try {
      const game = await joinGame(user);
      if (!game.docId) return;
      router.push(game.docId);
    } catch (e) {
      console.error(e);
      toast((e as Error).message, "danger", setToastController);
    }
  };

  const handleLogin = (user: User) => {
    setIsLoggedIn(true);
    toast("Logged in successfully", "success", setToastController);
    startGame(user);
  };

  if (!isMounted) {
    return <Spinner className="m-auto h-full flex items-center" />;
  }

  return (
    <div>
      <h1 className="font-bold text-4xl mb-4">Tic tac toe</h1>
      {!isLoggedIn && <Login onLogin={handleLogin} />}
      <Toast
        message={toastController.message}
        isOpen={toastController.isOpen}
        toastType={toastController.toastType}
      />
    </div>
  );
}
