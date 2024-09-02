"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/app/store";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SigninModal } from "./signinModal";

export const Heading = () => {
  const signinRef = useRef<HTMLDialogElement | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <>
      <div className="max-w-3xl space-y-4" data-testid="heading">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
          Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
          <span className="underline">Notion</span>
        </h1>
        <h3 className="text-base sm:text-xl md:text-2xl font-medium">
          Notion is the connected workspace where <br />
          better, faster work happens.
        </h3>
        {isLoading ? (
          <div className="w-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : isAuthenticated ? (
          <Button asChild data-testid="enter notion">
            <Link href="/documents">
              Enter Notion <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        ) : (
          <Button
            data-testid="signin trigger"
            onClick={() => {
              signinRef.current?.showModal();
            }}
          >
            Get Notion Free <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
      <SigninModal ref={signinRef} />
    </>
  );
};
