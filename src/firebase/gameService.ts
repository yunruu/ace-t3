import Game from "@/types/Game";
import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { Player, PositionEnum } from "@/types";
import { getRandUuid } from "./service";

const GAMES_COLLECTION = "games";

export const joinGame = async (player: Player): Promise<Game> => {
  const gamesRef = collection(db, GAMES_COLLECTION);
  const gamesSnapshot = await getDocs(gamesRef);
  let game: Game | null = null;

  for (const gameDoc of gamesSnapshot.docs) {
    const gameData = gameDoc.data();
    if (!gameData) continue;
    game = gameData as Game;
    break;
  }

  if (game) {
    player.position = PositionEnum.TWO;
    game.playerTwo = player;
  } else {
    player.position = PositionEnum.ONE;
    const newGame = new Game(getRandUuid(), player);
    const newGameRef = doc(gamesRef);
    await setDoc(newGameRef, newGame);
    game = newGame;
  }
  return game;
};

export const getGame = async (gameId: string): Promise<Game> => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  if (!gameSnap.exists()) {
    throw new Error("Game does not exist");
  }
  return gameSnap.data() as Game;
};

export const saveGame = async (gameId: string, data: Game) => {
  const gameRef = doc(db, "games", gameId);
  await setDoc(gameRef, data);
};

export const listenToGame = (gameId: string, callback: (data: any) => void) => {
  const gameRef = doc(db, "games", gameId);
  return onSnapshot(gameRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};
