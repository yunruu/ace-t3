"use client";

import GameBoard from "@/app/components/gameboard";
import Login from "./components/login";
import { useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      <h1 className="font-bold text-4xl">Tic tac toe</h1>
      {isLoggedIn && <GameBoard />}
      <Login onLogin={handleLogin} />
    </div>
  );
}
