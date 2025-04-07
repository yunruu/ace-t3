"use client";

import { useState } from "react";
import Button from "./ui/button";
import { User } from "@/types";
import { loginUser, registerUser } from "@/firebase/userService";
import Toast, { IToastProps, toast } from "./ui/toast";
import { login as lsLogin } from "@/utils/login";

export interface ILoginProps {
  onLogin: (user: User) => void;
}

export enum LoginEnum {
  LOGIN = "Login",
  REGISTER = "Register",
}

export default function Login({ onLogin }: ILoginProps) {
  const [type, setType] = useState<LoginEnum>(LoginEnum.LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toastController, setToastController] = useState<IToastProps>({
    message: "",
    isOpen: false,
    toastType: "success",
  });

  const handleSubmit = () => {
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    if (type === LoginEnum.LOGIN) {
      login();
    } else {
      register();
    }
  };

  const handleChangeType = () => {
    setError("");
    if (type === LoginEnum.LOGIN) {
      setType(LoginEnum.REGISTER);
    } else {
      setType(LoginEnum.LOGIN);
    }
  };

  const register = async () => {
    try {
      await registerUser(username, password);
      toast("Account created successfully", "success", setToastController);
      setType(LoginEnum.LOGIN);
    } catch (e) {
      toast((e as Error).message, "danger", setToastController);
    }
  };

  const login = async () => {
    try {
      const user = await loginUser(username, password);
      lsLogin(user);
      onLogin(user);
    } catch (e) {
      toast((e as Error).message, "danger", setToastController);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <form className="sm:w-[80vw] md:w-[70vw] lg:w-[55vw] m-auto space-y-4 p-6 border rounded-xl shadow-md">
        <h2 className="text-xl font-semibold">{type}</h2>
        <div className="space-x-4">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-required="true"
            aria-describedby="username-help"
            className="border rounded-lg p-2 w-full mt-2"
          />
          <p
            id="username-help"
            className="text-sm text-muted-foreground sr-only"
          >
            Enter your username.
          </p>
        </div>
        <div className="space-x-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
            aria-describedby="password-help"
            className="border rounded-lg p-2 w-full mt-2"
          />
          <p
            id="password-help"
            className="text-sm text-muted-foreground sr-only"
          >
            Enter your password.
          </p>
        </div>
        {error && (
          <div
            role="alert"
            className="bg-red-100 text-red-700 p-2 rounded mt-7"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        <Button
          type="submit"
          label={type === LoginEnum.LOGIN ? "Login & start" : type}
          className="mt-3"
          onClick={handleSubmit}
        />
        <Button
          className="float-end"
          variant="link"
          label={
            type === LoginEnum.LOGIN
              ? "Register for an account"
              : "Login to your account"
          }
          onClick={handleChangeType}
        />
      </form>
      <Toast
        message={toastController.message}
        isOpen={toastController.isOpen}
        toastType={toastController.toastType}
      />
    </div>
  );
}
