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

const newMovePos = (oldBoard: number[], newBoard: number[]) => {
  for (let i = 0; i < oldBoard.length; i++) {
    const oldVal = oldBoard[i];
    const newVal = newBoard[i];
    if (oldVal !== newVal) return i + 1;
  }
  return 0;
};

export default function GameBoard({ gameId, onGameOver }: IGameBoardProps) {
  const [game, setGame] = useState<Game>();
  const [player, setPlayer] = useState<Player>();
  const [loading, setLoading] = useState(false);
  const [accessibleAnnouncement, setAccessibleAnnouncement] =
    useState<string>("");

  useEffect(() => {
    if (!gameId) return;

    const gameDocRef = doc(db, "games", gameId);
    const unsub = onSnapshot(gameDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const updatedGame = snapshot.data() as Game;
        setGame(updatedGame);
        const userPosition = player?.position;
        const currentTurn = updatedGame.currentTurn;
        let announcement: string;

        if (updatedGame.completed) {
          if (updatedGame.winner === PositionEnum.NONE) {
            announcement = "Game over. It's a draw.";
          } else {
            const winner = updatedGame.winner === PositionEnum.ONE ? "O" : "X";
            announcement = `Game over. Player ${winner} wins.`;
          }
        } else {
          announcement =
            currentTurn === userPosition
              ? "It is your turn."
              : "Waiting for opponent to make a move.";
        }
        setAccessibleAnnouncement(announcement);

        if (updatedGame.completed && userPosition) {
          let status: GameStatusEnum;
          if (updatedGame.winner === PositionEnum.NONE) {
            status = GameStatusEnum.DRAW;
          } else if (updatedGame.winner === userPosition) {
            status = GameStatusEnum.WIN;
          } else {
            status = GameStatusEnum.LOSE;
          }
          onGameOver(status);
        }

        setLoading(!updatedGame.playerTwo);
        if (!player) {
          setup(updatedGame);
        }
      }
    });

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
    setAccessibleAnnouncement(`You selected cell ${idx + 1}.`)
    setTimeout(() => makeMove(player, game, idx), 500);
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
    if (!isPlayerTurn()) return "bg-gray-700 !cursor-not-allowed";
    return cell === PositionEnum.NONE
      ? "hover:bg-gray-800 focus:outline-indigo-500"
      : "!cursor-not-allowed focus:outline-red-500";
  };

  const isGameOver = () => game?.completed;

  return loading ? (
    <section
      aria-live="polite"
      aria-busy="true"
      className="m-auto h-[70vh] flex flex-col gap-7 items-center justify-center"
      tabIndex={0}
    >
      <span className="text-2xl text-gray-300">
        Waiting for a player to join...
      </span>
      <Spinner />
    </section>
  ) : (
    <div>
      <div
        className="text-2xl font-black text-center mb-3"
        aria-description="Player symbol"
        tabIndex={0}
      >
        Your player symbol is{" "}
        {player?.position === PositionEnum.ONE ? "O" : "X"}
      </div>
      <div aria-live="polite" className="sr-only">
        {accessibleAnnouncement}
      </div>
      <section
        role="grid"
        aria-label="Game board"
        className="grid grid-cols-3 gap-1 md:px-[15vw] lg:px-[20vw]"
      >
        {game?.board.map((cell, idx) => {
          const isEmpty = cell === PositionEnum.NONE;
          const cellLabel = `Cell ${idx + 1}, ${
            cell === PositionEnum.ONE
              ? "O"
              : cell === PositionEnum.TWO
                ? "X"
                : "empty"
          }`;
          const isDisabled = !isEmpty || !isPlayerTurn();

          return (
            <button
              key={idx}
              aria-label={cellLabel}
              aria-disabled={isDisabled}
              aria-pressed={!isEmpty}
              className={`col-span-1 h-[30vw] md:h-[17vw] md:max-h-[30vh] lg:max-h-[25vh] border border-white text-9xl rounded flex items-center justify-center transition-colors duration-200 ease-in-out cursor-pointer ${disabledCellStyles(cell)} focus:outline-8`}
              onClick={() => {
                if (!isDisabled) handleClickCell(cell, idx);
              }}
            >
              <span className="sr-only">{cellLabel}</span>
              <span aria-hidden="true">{displayCell(cell)}</span>
            </button>
          );
        })}
      </section>
    </div>
  );
}
