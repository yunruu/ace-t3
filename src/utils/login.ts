import { User } from "@/types";

const KEY = "ace_t3_";
const USER_KEY = KEY + "user";

export const login = (user: User) => {
  localStorage.removeItem(USER_KEY);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem(USER_KEY);
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  return JSON.parse(userData);
};
