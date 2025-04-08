"use client";
import { db } from "@/firebase/config";
import { makeMove } from "@/firebase/gameService";
import { PositionEnum, Game, Player, GameStatusEnum } from "@/types";
import { getUser } from "@/utils/login";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Spinner from "./ui/spinner";

export interface IGameBoardProps {
  gameId: string;
  onGameOver: (gameStatus: GameStatusEnum) => void;
}

export default function GameBoard({ gameId, onGameOver }: IGameBoardProps) {
  const [game, setGame] = useState<Game>();
  const [player, setPlayer] = useState<Player>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gameId) {
      return;
    }

    const gameDocRef = doc(db, "games", gameId);
    const unsub = onSnapshot(gameDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const game = snapshot.data() as Game;
        setGame(game);
        if (game.completed && player?.position) {
          let status: GameStatusEnum;
          if (game.winner === PositionEnum.NONE) {
            status = GameStatusEnum.DRAW;
          } else if (game.winner === player.position) {
            status = GameStatusEnum.WIN;
          } else {
            status = GameStatusEnum.LOSE;
          }
          onGameOver(status);
        }

        if (!game.playerTwo) {
          setLoading(true);
        } else {
          setLoading(false);
        }

        if (!player) {
          setup(game);
        }
      }
    });

    // clean up the listener when the component unmounts.
    return () => unsub();
  }, [gameId, player, onGameOver]);

  const setup = (game: Game) => {
    const user = getUser();
    if (!user) return;
    setPlayer(
      user.id === game.playerOne?.user.id ? game.playerOne : game.playerTwo,
    );
  };

  const isPlayerTurn = () => {
    if (isGameOver()) return false;
    return game?.currentTurn === player?.position;
  };

  const handleClickCell = (cell: PositionEnum, idx: number) => {
    if (!player || !game || !isPlayerTurn() || cell !== PositionEnum.NONE)
      return;
    makeMove(player, game, idx);
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
    if (!isPlayerTurn()) return "disabled bg-gray-700 cursor-not-allowed";
    switch (cell) {
      case PositionEnum.NONE:
        return "";
      default:
        return "disabled cursor-not-allowed";
    }
  };

  const isGameOver = () => {
    return game?.completed;
  };

  return loading ? (
    <section
      aria-live="polite"
      aria-busy="true"
      className="m-auto h-[70vh] flex flex-col gap-7 items-center justify-center"
    >
      <h2 className="text-2xl text-gray-300">
        Waiting for a player to join...
      </h2>
      <Spinner />
    </section>
  ) : (
    <section
      role="grid"
      aria-label="Tic Tac Toe board"
      className="grid grid-cols-3 gap-1 md:px-[15vw] lg:px-[20vw]"
      tabIndex={0}
    >
      {game?.board.map((cell, idx) => (
        <button
          key={idx}
          role="gridcell"
          aria-label={`Cell ${idx + 1}, ${
            cell === PositionEnum.ONE
              ? "O"
              : cell === PositionEnum.TWO
                ? "X"
                : "empty"
          }`}
          className={`col-span-1 h-[30vw] md:h-[17vw] md:max-h-[30vh] lg:max-h-[25vh] border border-white text-8xl rounded flex items-center justify-center ${disabledCellStyles(
            cell,
          )}`}
          onClick={() => handleClickCell(cell, idx)}
          disabled={!isPlayerTurn() || cell !== PositionEnum.NONE}
        >
          {displayCell(cell)}
        </button>
      ))}
    </section>
  );
}
