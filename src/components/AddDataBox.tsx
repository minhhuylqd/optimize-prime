"use client";

import React, { useState } from "react";

import AddNoteDialog from "./AddEditNoteDialog";
import { Button } from "./ui/button"
import { Pen, Link } from "lucide-react";
import AddWebsiteDialog from "./AddWebsiteDialog";

export default function AddDataBox() {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [showAddWebsiteDialog, setShowAddWebsiteDialog] = useState(false);

  return (
    <div className="mb-4 flex gap-2 items-center">
      <Button onClick={() => setShowAddEditNoteDialog(true)}>
        <Pen size={20} className="mr-2" />
        Add Note
      </Button>
      <Button onClick={() => setShowAddWebsiteDialog(true)}>
        <Link size={20} className="mr-2" />
        Add Website
      </Button>
      <AddNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
      <AddWebsiteDialog
        open={showAddWebsiteDialog}
        setOpen={setShowAddWebsiteDialog}
      />
    </div>
  );
}
