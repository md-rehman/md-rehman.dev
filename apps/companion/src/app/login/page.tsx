import Image from "next/image";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-black/5 bg-white p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mb-8 flex justify-center">
          <Image
            className="opacity-90 dark:invert"
            src="/companion/next.svg"
            alt="Next.js logo"
            width={120}
            height={25}
            priority
          />
        </div>
        
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Welcome Back
        </h2>
        
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-300 dark:focus:bg-white/10 dark:focus:ring-zinc-300/20"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5 dark:border-white/10 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-300 dark:focus:bg-white/10 dark:focus:ring-zinc-300/20"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="pt-4 flex flex-col gap-3">
            <button
              className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              formAction={login}
            >
              Log in
            </button>
            <button
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-black/5 active:scale-[0.98] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              formAction={signup}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
