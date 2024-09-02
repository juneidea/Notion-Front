"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useDjangoAuth } from "@/hooks/use-django-auth";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/spinner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/app/store";
import { Logo } from "./logo";
import { LoginModal } from "./loginModal";
import { SigninModal } from "./signinModal";

const defaultAvatar =
  "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png";

export const Navbar = () => {
  const router = useRouter();
  const scrolled = useScrollTop();
  const params = useSearchParams();
  const { user } = useAuthStore();
  const { auth, oauth } = useDjangoAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  const modalRef = useRef<HTMLDialogElement | null>(null);
  const signinRef = useRef<HTMLDialogElement | null>(null);

  let isMounted = false;
  useEffect(() => {
    const code = params.get("code");
    if (code && isMounted) {
      oauth(code);
    }
    isMounted = true;
  }, []);

  const handleAuth = async (
    e: React.FormEvent<HTMLFormElement>,
    modal: HTMLDialogElement | null
  ) => {
    e.preventDefault();
    await auth(e, modal);
    router.push("/");
  };

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
      data-testid="navbar"
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                modalRef.current?.showModal();
              }}
            >
              Log in
            </Button>
            <Button
              size="sm"
              onClick={() => {
                signinRef.current?.showModal();
              }}
            >
              Get Notion Free
            </Button>
          </>
        )}
        {isAuthenticated && (
          <div className="flex">
            <Button
              size="sm"
              onClick={() => {
                router.push("/documents");
              }}
            >
              Enter Notion
            </Button>
            <Avatar className="h-8 w-8 ml-2">
              <AvatarImage src={user.avatar || defaultAvatar} />
            </Avatar>
          </div>
        )}
        <ModeToggle />
      </div>
      <LoginModal ref={modalRef} handleAuth={handleAuth} />
      <SigninModal ref={signinRef} />
    </div>
  );
};
