import Game from "@/types/Game";
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

const GAMES_COLLECTION = "games";

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
      return convertToGame(curr);
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
    await setDoc(newGameRef, newGame.toObject());
    game = newGame;
  }
  return game;
};

export const getGame = async (gameId: string): Promise<Game> => {
  const gameRef = doc(db, GAMES_COLLECTION, gameId);
  const gameSnap = await getDoc(gameRef);
  if (!gameSnap.exists()) {
    throw new Error("Game does not exist");
  }
  return gameSnap.data() as Game;
};

export const saveGame = async (gameId: string, data: Game) => {
  const gameRef = doc(db, GAMES_COLLECTION, gameId);
  await setDoc(gameRef, data);
};

export const listenToGame = (gameId: string, callback: (data: any) => void) => {
  const gameRef = doc(db, GAMES_COLLECTION, gameId);
  return onSnapshot(gameRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

// const listenToGame = (gameId: string, callback: (data: any) => void) => {
//   const gameRef = doc(db, "games", gameId);

//   const unsub = onSnapshot(gameRef, (docSnapshot) => {
//     if (docSnapshot.exists()) {
//       const gameData = docSnapshot.data();
//       callback(gameData);
//     } else {
//       console.log("No such document!");
//     }
//   });

//   return unsub; // You can call this to stop listening
// };
