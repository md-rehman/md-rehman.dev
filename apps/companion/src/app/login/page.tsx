"use client";

import { useState } from "react";
import { signIn, signUp } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((ps) => {
      return {
        ...ps,
        [name]: value,
      };
    });
  };

  const handleSignIn = async () => {
    const { data, error } = await signIn(formData);
    if (error) setErrorMessage(error?.message || "");
  };

  const handleSignUp = async () => {
    const { data, error } = await signUp(formData);
    if (error) setErrorMessage(error?.message || "");
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center">
      <div className="flex w-1/2 flex-col">
        <input
          className="dark:shadow-bulge-dark dark:border-background-dark mb-4 rounded-md border-2 p-2"
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
          className="dark:shadow-bulge-dark dark:border-background-dark mb-4 rounded-md border-2 p-2"
          id="password"
          name="password"
          // type="password"
          value={formData.password}
          onChange={handleFormDataChange}
          required
        />
        <p className="text-error-500 m-2 h-10">{errorMessage}</p>
        <div className="flex w-full justify-between">
          <button
            className="dark:shadow-bulge-dark dark:border-background-dark mb-4 rounded-md border-2 px-8 py-2"
            onClick={handleSignUp}
          >
            Sign up
          </button>
          <button
            className="dark:shadow-bulge-dark dark:border-background-dark mb-4 rounded-md border-2 px-8 py-2"
            onClick={handleSignIn}
          >
            Log in
          </button>
        </div>
      </div>
    </section>
  );
}
