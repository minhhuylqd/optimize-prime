"use client";

import React, { useState } from "react";

import AddNoteDialog from "./AddEditNoteDialog";
import { Button } from "./ui/button";
import { Pen, Link, FileText } from "lucide-react";
import AddWebsiteDialog from "./AddWebsiteDialog";
import AddPdfDialog from "./AddPdfDialog";

export default function AddDataBox() {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [showAddWebsiteDialog, setShowAddWebsiteDialog] = useState(false);
  const [showUploadPdf, setShowUploadPdf] = useState(false);

  return (
    <div className="mb-4 flex items-center gap-2">
      <Button onClick={() => setShowUploadPdf(true)}>
        <FileText size={20} className="mr-2" />
        Add PDF
      </Button>
      {/* <Button onClick={() => setShowAddEditNoteDialog(true)}>
        <Pen size={20} className="mr-2" />
        Add Note
      </Button> */}
      <AddPdfDialog open={showUploadPdf} setOpen={setShowUploadPdf} />
      {/* <AddNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      /> */}
      {/* <Button onClick={() => setShowAddWebsiteDialog(true)}>
        <Link size={20} className="mr-2" />
        Add Website
      </Button> */}
      {/*  <AddWebsiteDialog
        open={showAddWebsiteDialog}
        setOpen={setShowAddWebsiteDialog}
      /> */}
    </div>
  );
}
