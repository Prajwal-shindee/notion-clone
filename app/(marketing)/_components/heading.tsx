"use client";
import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/spinnner";
import Link from "next/link";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className="max-w-4xl space-y-5">
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold">
        Your 📔<span className="underline">wiki</span>, 📄
        <span className="underline">docs</span>, <br />& 🎯
        <span className="underline">projects</span>. Together.
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Motion is the connected workspace where <br />
        better, faster work happens.
      </h3>
      {isLoading && (
        <div className=" flex items-center justify-center w-full">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button className="font-semibold text-lg" asChild>
          <Link href="/documents">
            Get Motion free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button className="font-semibold text-lg">
            Get Motion free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
