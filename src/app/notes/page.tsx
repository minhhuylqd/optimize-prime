import React from "react";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs";

import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";
import AddDataBox from "@/components/AddDataBox";
import FileUpload from "@/components/FileUpload";

export const metadata: Metadata = {
  title: "OP",
};

async function NotesPage() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("userId undefined");
  }

  const allNotes = await prisma.note.findMany({ where: { userId } });

  const allFiles = await prisma.file.findMany({ where: { userId } });

  return (
    <div className="block">
      <AddDataBox />
      <h2 className="italic text-lg mb-4 font-semibold">PDFs</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4">
        {allFiles.map((file) => (
          <FileUpload key={file.id} file={file} />
        ))}
      </div>
      {/* <h2 className="italic text-lg mb-4 font-semibold">Notes</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allNotes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
        {allNotes.length === 0 && (
          <div className="col-span-full text-center">
            {"You don't have any notes yet."}
          </div>
        )}
      </div> */}
    </div>
  );
}

export default NotesPage;
