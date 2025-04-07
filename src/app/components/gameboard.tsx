"use client";
import { PositionEnum } from "@/types";
import { useState } from "react";

export interface IGameCell {
  value?: PositionEnum;
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
    cells[idx].value = PositionEnum.ONE; // change to player
    setCells(newArr);
    setPlayerTurn(false);
  };

  const playerVal = (cell: IGameCell) => {
    switch (cell.value) {
      case PositionEnum.ONE:
        return "O";
      case PositionEnum.TWO:
        return "X";
      default:
        return "";
    }
  };

  const disabledCellStyles = (cell: IGameCell) => {
    return cell.value || !playerTurn
      ? "disabled bg-gray-700 !cursor-not-allowed"
      : "";
  };

  return (
    // <div className="grid grid-cols-3 md:max-w-[51vw]">
    //   {cells.map((cell, idx) => (
    //     <button
    //       disabled={!playerTurn}
    //       className={`col-span-1 h-[30vw] md:h-[17vw] md:max-h-[30vh] border border-white cursor-pointer text-8xl ${disabledCellStyles(cell)}`}
    //       key={idx}
    //       onClick={() => handleClickCell(idx)}
    //     >
    //       {playerVal(cell)}
    //     </button>
    //   ))}
    // </div>
    <div
      role="grid"
      aria-label="Tic Tac Toe board"
      tabIndex={0}
      className="grid grid-cols-3 gap-1 md:px-[15vw] lg:px-[20vw]"
    >
      {cells.map((cell, idx) => (
        <div
          key={idx}
          role="gridcell"
          aria-label={`Cell ${idx + 1}, ${cell ?? "empty"}`}
          className={`col-span-1 h-[30vw] md:h-[17vw] md:max-h-[30vh] border border-white cursor-pointer text-8xl rounded flex items-center justify-center ${disabledCellStyles(cell)}`}
          onClick={() => handleClickCell(idx)}
          // aria-selected={idx === selectedCell}
        >
          {playerVal(cell)}
        </div>
      ))}
    </div>
  );
}
