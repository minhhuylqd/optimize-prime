"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import AiChatButton from "../AiChatButton";

export default function Navbar() {
  return (
    <>
      <div className="p-4 shadow">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/notes" className="flex items-center gap-1">
            <Image src={logo} width={40} height={40} alt="OP logo" />
            <span className="font-bold">Optimize Prime</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: { width: "2.5rem", height: "2.5rem" },
                },
              }}
            />
            <AiChatButton />
          </div>
        </div>
      </div>
    </>
  );
}
