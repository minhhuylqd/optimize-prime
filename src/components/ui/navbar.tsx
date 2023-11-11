'use client'

import Image from "next/image";
import Link from "next/link";
import React, {useState} from "react";

import logo from "@/assets/logo.png"
import { UserButton } from "@clerk/nextjs";
import { Button } from "./button";
import { Plus } from "lucide-react";
import AddNoteDialog from "../AddEditNoteDialog";
import AiChatButton from "../AiChatButton";

export default function Navbar() {

  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false)

  return (
    <>
      <div className="p-4 shadow">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/notes" className="flex items-center gap-1">
            <Image src={logo} width={40} height={40} alt="FlowBrain logo" />
            <span className="font-bold">FlowBrain</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: {width: "2.5rem", height: "2.5rem"},
                }
              }}
            />
            <Button onClick={() => setShowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Note
            </Button>
            <AiChatButton />
          </div>
        </div>
      </div>
      <AddNoteDialog open={showAddEditNoteDialog} setOpen={setShowAddEditNoteDialog} />
    </>
  );
}
