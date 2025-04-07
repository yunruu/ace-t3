"use client";
import { db } from "@/firebase/config";
import { makeMove } from "@/firebase/gameService";
import { PositionEnum, Game, Player } from "@/types";
import { getUser } from "@/utils/login";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface IGameBoardProps {
  gameId: string;
}

export default function GameBoard({ gameId }: IGameBoardProps) {
  const [game, setGame] = useState<Game>();
  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    if (!gameId) {
      return;
    }
    const gameDocRef = doc(db, "games", gameId);
    const unsub = onSnapshot(gameDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const game = snapshot.data() as Game;
        setGame(game);
        if (!player) {
          setup(game);
        }
        console.log("data", snapshot.data());
      }
    });
    return () => unsub();
  }, [gameId, player]);

  const setup = (game: Game) => {
    const user = getUser();
    if (!user) return;
    setPlayer(
      user.id === game.playerOne?.user.id ? game.playerOne : game.playerTwo,
    );
  };

  const isPlayerTurn = () => {
    return game?.currentTurn === player?.position;
  };

  const handleClickCell = (cell: PositionEnum, idx: number) => {
    if (!player || !game || !isPlayerTurn() || cell !== PositionEnum.NONE) return;
    makeMove(player, game, idx)
  };

  const displayCell = (cell: PositionEnum) => {
    switch (cell) {
      case PositionEnum.ONE:
        return "O";
      case PositionEnum.TWO:
        return "X";
      default:
        return "";
    }
  };

  const disabledCellStyles = (cell: PositionEnum) => {
    if (!isPlayerTurn()) return "disabled bg-gray-700 !cursor-not-allowed";
    switch (cell) {
      case PositionEnum.NONE:
        return "";
      default:
        return "disabled !cursor-not-allowed";
    }
  };

  return (
    <div
      role="grid"
      aria-label="Tic Tac Toe board"
      tabIndex={0}
      className="grid grid-cols-3 gap-1 md:px-[15vw] lg:px-[20vw]"
    >
      {game?.board.map((cell, idx) => (
        <div
          key={idx}
          role="gridcell"
          aria-label={`Cell ${idx + 1}, ${cell ?? "empty"}`}
          className={`col-span-1 h-[30vw] md:h-[17vw] md:max-h-[30vh] lg:max-h-[25vh] border border-white cursor-pointer text-8xl rounded flex items-center justify-center ${disabledCellStyles(cell)}`}
          onClick={() => handleClickCell(cell, idx)}
          // aria-selected={idx === selectedCell}
        >
          {displayCell(cell)}
        </div>
      ))}
    </div>
  );
}
