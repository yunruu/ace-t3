import { PositionEnum, User } from "@/types";

export class Player {
  user: User;
  position?: PositionEnum;

  constructor(user: User, position?: PositionEnum) {
    this.user = user;
    this.position = position;
  }

  toObject() {
    return {
      user: this.user.toObject(),
      position: this.position,
    };
  }
}
