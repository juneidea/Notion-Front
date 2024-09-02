"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { handleModalClick } from "./util";

interface forwardProps {
  handleAuth: (
    e: React.FormEvent<HTMLFormElement>,
    modal: HTMLDialogElement | null
  ) => void;
}

export const LoginModal = forwardRef(function LoginModal(
  props: forwardProps,
  ref: any
) {
  return (
    <dialog
      ref={ref}
      className="rounded-xl p-6"
      onClick={(e) => handleModalClick(e, ref.current)}
      data-testid="login modal"
    >
      <form
        className="flex flex-col p-6 gap-4"
        onSubmit={(e) => props.handleAuth(e, ref.current)}
      >
        <div>
          <h1 className="text-xl font-bold">Sign in</h1>
          <p className="text-sm font-light">to continue to notion</p>
        </div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          className={cn("bg-stone-200 dark:bg-stone-700")}
          autoComplete="username"
          data-testid="input"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className={cn("bg-stone-200 dark:bg-stone-700")}
          autoComplete="current-password webauthn"
          data-testid="input"
        />
        <Button type="submit">Log in</Button>
      </form>
    </dialog>
  );
});
