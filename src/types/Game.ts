import { Player, PositionEnum } from "@/types";

export default class Game {
  id: string;
  playerOne: Player;
  playerTwo?: Player;
  completed: boolean;
  board: PositionEnum[];

  constructor(id: string, playerOne: Player, playerTwo?: Player) {
    this.id = id;
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.completed = false;
    this.board = Array.from({ length: 9 }, () => PositionEnum.NONE);
  }
}
