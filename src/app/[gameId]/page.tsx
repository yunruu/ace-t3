"use client";

import { useEffect, useState, useRef } from "react";
import GameBoard from "@/app/components/gameBoard";
import { usePathname, useRouter } from "next/navigation";
import { GameStatusEnum } from "@/types";
import Button from "../components/ui/button";
import { getUser, logout } from "@/utils/login";
import { joinGame } from "@/firebase/gameService";

export default function GameSession() {
  const router = useRouter();
  const pathname = usePathname();
  const [gameId, setGameId] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatusEnum>();
  const playAgainButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const gameId = pathname.substring(1);
    if (!gameId) return;
    setGameId(gameId);
  }, [pathname]);

  const handleGameOver = (status: GameStatusEnum) => {
    setGameOver(true);
    setGameStatus(status);
    // when game over focus on play again button
    setTimeout(() => {
      if (playAgainButtonRef.current) {
        playAgainButtonRef.current.focus();
      }
    }, 0);
  };

  const displayHeader = () => {
    return `Result: ${gameStatus === GameStatusEnum.DRAW ? gameStatus : `You ${gameStatus}`}`;
  };

  const handlePlayAgain = async () => {
    const user = getUser();
    if (!user) return;
    try {
      const game = await joinGame(user);
      if (!game.docId) return;
      router.push(game.docId);
      setGameOver(false); // Close dialog
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    const user = getUser();
    if (user) {
      logout();
    }
    router.push("/");
  };

  return (
    <>
      <h1 className="font-bold text-4xl mb-6">Tic tac toe</h1>
      {gameOver && (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-gray-600/70 flex items-center justify-center"
        >
          <section
            role="alert"
            className="rounded-lg px-4 py-10 flex flex-col items-center justify-center gap-7 w-[90%] md:w-[500px] min-h-[40vh] mb-6 bg-gray-800"
          >
            <h1 className="uppercase font-bold text-4xl text-center">
              {displayHeader()}
            </h1>
            <Button
              ref={playAgainButtonRef}
              label="Play again"
              className="!w-fit px-10 text-xl"
              onClick={handlePlayAgain}
            />
            <Button
              label="Logout"
              variant="ghost"
              className="!w-fit px-10 text-xl"
              onClick={handleLogout}
            />
          </section>
        </div>
      )}
      <GameBoard gameId={gameId} onGameOver={handleGameOver} />
    </>
  );
}
