"use client";

import { useState } from "react";
import Button from "./ui/button";
import { Player } from "@/types";

export interface ILoginProps {
  onLogin: (p: Player) => void;
}

export default function Login({ onLogin }: ILoginProps) {
  const [type, setType] = useState("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    if (type === "Login") {
      loginUser();
    } else {
      registerUser();
    }
  };

  const handleChangeType = () => {
    if (type === "Login") {
      setType("Register");
    } else {
      setType("Login");
    }
  };

  const registerUser = () => {};

  const loginUser = () => {
    // onLogin()
  };

  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[80vw] md:w-[70vw] lg:w-[55vw] m-auto space-y-4 p-6 border rounded-xl shadow-md"
      >
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
        <Button label={type} className="mt-3" onClick={handleSubmit} />
        <Button
          className="float-end"
          variant="link"
          label={
            type === "Login"
              ? "Or register for an account"
              : "Or login to your account"
          }
          onClick={handleChangeType}
        />
      </form>
    </div>
  );
}
