import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import LoadingButton from "./ui/loading-button";
import { Button } from "./ui/button";

interface AddPdfDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddPdfDialog({ open, setOpen }: AddPdfDialogProps) {

  const [file, setFile] = useState<File>()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch('/api/pdf', {
        method: 'POST',
        body: data
      })
      if (!res.ok) throw new Error(await res.text())
      setOpen(false)
    } catch (e: any) {
      console.error(e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Upload PDF"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="file"
            name="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
