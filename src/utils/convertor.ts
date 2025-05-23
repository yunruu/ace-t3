import { Player, User } from "@/types";
import { Game } from "@/types";

export const convertToGame = (g: Game) => {
  return new Game(
    g.id,
    convertToPlayer(g.playerOne),
    convertToPlayer(g.playerTwo),
    g.completed,
    g.board,
    g.currentTurn,
    g.docId,
    g.winner,
  );
};

export const convertToPlayer = (p?: Player) => {
  return p ? new Player(convertToUser(p.user), p.position) : undefined;
};

export const convertToUser = (u: User) => {
  return new User(u.id, u.username);
};
