import { Game } from "@/types";
import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  onSnapshot,
  updateDoc,
  DocumentReference,
} from "firebase/firestore";
import { Player, PositionEnum, User } from "@/types";
import { getRandUuid } from "./service";
import { convertToGame } from "@/utils/convertor";

export const GAMES_COLLECTION = "games";

export const joinGame = async (user: User): Promise<Game> => {
  const gamesRef = collection(db, GAMES_COLLECTION);
  const gamesSnapshot = await getDocs(gamesRef);
  let game: Game | null = null;
  let gameDocRef: DocumentReference | null = null;
  user = new User(user.id, user.username);
  const player = new Player(user, PositionEnum.NONE);

  // find match user is already in
  for (const gameDoc of gamesSnapshot.docs) {
    const data = gameDoc.data();
    const curr = data as Game;
    if (curr.completed) continue;
    if (
      user.id === curr.playerOne?.user.id ||
      user.id === curr.playerTwo?.user.id
    ) {
      const game = convertToGame(curr);
      game.docId = gameDoc.id;
      return game;
    }
  }

  // find match with only one player
  if (!game) {
    for (const gameDoc of gamesSnapshot.docs) {
      const data = gameDoc.data();
      const curr = data as Game;
      if (curr.completed) continue;
      if (!curr.playerTwo) {
        game = convertToGame(curr);
        game.docId = gameDoc.id;
        gameDocRef = gameDoc.ref;
        break;
      }
    }
  }

  if (game && gameDocRef) {
    player.position = PositionEnum.TWO;
    game.playerTwo = player;
    await updateDoc(gameDocRef, game.toObject());
  } else {
    player.position = PositionEnum.ONE;
    const newGame = new Game(getRandUuid(), player);
    const newGameRef = doc(gamesRef);
    newGame.docId = newGameRef.id;
    await setDoc(newGameRef, newGame.toObject());
    game = newGame;
  }
  return game;
};

export const getGame = async (docId: string): Promise<Game> => {
  const gameRef = doc(db, GAMES_COLLECTION, docId);
  const gameSnap = await getDoc(gameRef);
  if (!gameSnap.exists()) {
    throw new Error("Game does not exist");
  }
  return gameSnap.data() as Game;
};

export const updateGame = async (docId: string, game: Game): Promise<Game> => {
  const gameRef = doc(db, GAMES_COLLECTION, docId);
  const gameSnap = await getDoc(gameRef);
  if (!gameSnap.exists()) {
    throw new Error("Game does not exist");
  }
  updateDoc(gameRef, game.toObject());
  return game;
};

export const listenToGame = (
  gameId: string,
  callback: (data: Game) => void,
) => {
  const gameRef = doc(db, GAMES_COLLECTION, gameId);
  return onSnapshot(gameRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as Game);
    }
  });
};

const isGameOver = (game: Game): { isOver: boolean; winner: PositionEnum } => {
  const board = game.board;
  // Winning combinations
  const winCombos = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal \
    [2, 4, 6], // Diagonal /
  ];
  for (const [a, b, c] of winCombos) {
    if (board[a] !== 3 && board[a] === board[b] && board[b] === board[c]) {
      return { isOver: true, winner: board[a] };
    }
  }
  const isDraw = !board.includes(PositionEnum.NONE);
  return { isOver: isDraw, winner: PositionEnum.NONE };
};

export const makeMove = async (player: Player, game: Game, move: number) => {
  if (!game.docId || !player.position) return;
  if (move < 0 || move > 8 || game.board[move] !== PositionEnum.NONE) {
    throw new Error("Invalid move");
  }
  const newGame = convertToGame(await getGame(game.docId));
  newGame.board[move] = player.position;
  newGame.currentTurn =
    newGame.currentTurn === PositionEnum.ONE
      ? PositionEnum.TWO
      : PositionEnum.ONE;
  const { isOver, winner } = isGameOver(newGame);
  if (isOver) {
    newGame.completed = true;
    newGame.winner = winner;
  }
  updateGame(game.docId, newGame);
};
