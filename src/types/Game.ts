import { Player, PositionEnum } from "@/types";

export default class Game {
  id: string;
  playerOne?: Player;
  playerTwo?: Player;
  completed: boolean;
  board: PositionEnum[];
  currentTurn: PositionEnum;

  constructor(
    id: string,
    playerOne?: Player,
    playerTwo?: Player,
    completed?: boolean,
    board?: PositionEnum[],
    currentTurn?: PositionEnum,
  ) {
    this.id = id;
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.completed = completed || false;
    this.board = board || Array.from({ length: 9 }, () => PositionEnum.NONE);
    this.currentTurn = currentTurn || PositionEnum.ONE;
  }

  toObject() {
    return {
      id: this.id,
      playerOne: this.playerOne? this.playerOne.toObject() : null,
      playerTwo: this.playerTwo ? this.playerTwo.toObject() : null,
      completed: this.completed,
      board: this.board,
      currentTurn: this.currentTurn,
    };
  }
}
