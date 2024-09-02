"use client";

import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { handleModalClick, handleSignInGithub } from "./util";

interface forwardProps {}

export const SigninModal = forwardRef(function SigninModal(
  props: forwardProps,
  ref: any
) {
  return (
    <dialog
      ref={ref}
      className="rounded-xl p-6"
      onClick={(e) => handleModalClick(e, ref.current)}
      data-testid="signin dialog"
    >
      <div className="flex flex-col p-6 gap-4" data-testid="signin modal">
        <div>
          <h1 className="text-xl font-bold text-center">Free Sign in</h1>
          <p className="text-sm font-light text-center">with Github</p>
        </div>
        <Image
          className="rounded-full border-white border-2 bg-white"
          src="/github.svg"
          height="150"
          width="150"
          alt="Github"
          data-testid="github image"
        />
        <Button type="button" onClick={handleSignInGithub}>
          Log in
        </Button>
      </div>
    </dialog>
  );
});
