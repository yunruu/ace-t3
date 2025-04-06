import { PlayerEnum } from "@/types";

export class Player {
  id: string;
  player: PlayerEnum;

  constructor(id: string, player: PlayerEnum) {
    this.id = id;
    this.player = player;
  }
}
