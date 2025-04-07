"use client";

import { useEffect, useState } from "react";
import Spinner from "@/app/components/ui/spinner";
import GameBoard from "@/app/components/gameBoard";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useSearchParams } from "next/navigation";

export default function GameSession() {
  const searchParams = useSearchParams();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameId, setGameId] = useState("");

  useEffect(() => {
    setGameId(searchParams.get("gameId") || "");
  }, []);

  useEffect(() => {
    if (!gameId) return;
    const gameDoc = doc(db, "games", gameId);
    const unsub = onSnapshot(gameDoc, (snapshot) => {
      if (snapshot.exists()) {
        const gameData = snapshot.data();
        console.log(gameData);
      }
    });
    return () => unsub();
  }, [gameId]);

  if (!isGameStarted) {
    return (
      <section className="m-auto h-[70vh] flex flex-col gap-7 items-center justify-center">
        <h2 className="text-2xl text-gray-300">Finding a game...</h2>
        <Spinner />
      </section>
    );
  }

  return <GameBoard />;
}
