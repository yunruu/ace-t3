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
    newGame.docId = newGameRef.id
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

export const saveGame = async (gameId: string, data: Game) => {
  const gameRef = doc(db, GAMES_COLLECTION, gameId);
  await setDoc(gameRef, data);
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

export const makeMove = async (player: Player, game: Game, move: number) => {
  if (!game.docId || !player.position) return;
  if (move < 0 || move > 8 || game.board[move] !== PositionEnum.NONE) {
    throw new Error("Invalid move");
  }
  const newGame = convertToGame(await getGame(game.docId));
  newGame.board[move] = player.position;
  newGame.currentTurn = newGame.currentTurn === PositionEnum.ONE ? PositionEnum.TWO : PositionEnum.ONE
  updateGame(game.docId, newGame);
};
