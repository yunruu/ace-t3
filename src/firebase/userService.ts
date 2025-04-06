import bcrypt from "bcryptjs";
import { db } from "./config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "@/types";
import { getRandUuid } from "./service";

const USERS_COLLECTION = "users";

export const registerUser = async (
  username: string,
  password: string,
): Promise<User> => {
  const userRef = doc(db, USERS_COLLECTION, username);
  const existingUser = await getDoc(userRef);

  if (existingUser.exists()) {
    throw new Error("Username already exists");
  }

  const uuid = getRandUuid();
  const hashedPassword = await bcrypt.hash(password, 8);
  await setDoc(userRef, {
    id: uuid,
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  });

  return new User(uuid, username);
};

export const loginUser = async (
  username: string,
  password: string,
): Promise<User> => {
  const userRef = doc(db, USERS_COLLECTION, username);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const userData = userSnap.data();
  const passwordMatch = await bcrypt.compare(password, userData.password);

  if (!passwordMatch) {
    throw new Error("Incorrect password");
  }

  return userData as User;
};
