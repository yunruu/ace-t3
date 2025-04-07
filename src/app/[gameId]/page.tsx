"use client";

import { useEffect, useState } from "react";
import GameBoard from "@/app/components/gameBoard";
import { usePathname } from "next/navigation";

export default function GameSession() {
  const pathname = usePathname();
  const [gameId, setGameId] = useState("");

  useEffect(() => {
    const gameId = pathname.substring(1);
    if (!gameId) return;
    setGameId(gameId);
  }, [pathname]);

  return (
    <>
      <h1 className="font-bold text-4xl mb-6">Tic tac toe</h1>
      <GameBoard gameId={gameId} />
    </>
  );
}
