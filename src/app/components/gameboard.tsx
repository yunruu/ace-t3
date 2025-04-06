"use client";
import { PlayerEnum } from "@/types";
import { useState } from "react";

export interface IGameCell {
  value?: PlayerEnum;
}

export default function GameBoard() {
  const [cells, setCells] = useState<IGameCell[]>(
    Array.from({ length: 9 }, () => ({})),
  );
  const [playerTurn, setPlayerTurn] = useState(true);

  const handleClickCell = (idx: number) => {
    console.log(idx);
    if (!playerTurn) return;
    // logic to call api
    const newArr = cells;
    cells[idx].value = PlayerEnum.ONE; // change to player
    setCells(newArr);
    setPlayerTurn(false);
  };

  const playerVal = (cell: IGameCell) => {
    switch (cell.value) {
      case PlayerEnum.ONE:
        return "O";
      case PlayerEnum.TWO:
        return "X";
      default:
        return "";
    }
  };

  const disabledCellStyles = (cell: IGameCell) => {
    return cell.value || !playerTurn
      ? "disabled bg-gray-500 !cursor-not-allowed"
      : "";
  };

  return (
    <div className="grid grid-cols-3 md:max-w-[51vw]">
      {cells.map((cell, idx) => (
        <button
          disabled={!playerTurn}
          className={`col-span-1 h-[30vw] md:h-[17vw] md:max-h-[30vh] border border-white cursor-pointer text-8xl ${disabledCellStyles(cell)}`}
          key={idx}
          onClick={() => handleClickCell(idx)}
        >
          {playerVal(cell)}
        </button>
      ))}
    </div>
  );
}
