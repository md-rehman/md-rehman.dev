"use client";

import { useState } from "react";
import { signIn, signUp } from "@/actions/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((ps) => {
      return {
        ...ps,
        [name]: value,
      };
    });
  };

  const handleSignIn = () => {
    signIn(formData);
  };

  const handleSignUp = () => {
    signUp(formData);
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center">
      <div className="flex w-1/2 flex-col">
        <input
          className="mb-4 rounded-md border-2 p-2"
          placeholder="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleFormDataChange}
          required
        />
        <input
          placeholder="Password"
          className="mb-4 rounded-md border-2 p-2"
          id="password"
          name="password"
          // type="password"
          value={formData.password}
          onChange={handleFormDataChange}
          required
        />
        <button className="mb-4 rounded-md border-2 p-2" onClick={handleSignIn}>
          Log in
        </button>
        <button className="mb-4 rounded-md border-2 p-2" onClick={handleSignUp}>
          Sign up
        </button>
      </div>
    </section>
  );
}
