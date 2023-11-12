"use client";

import React, { useState } from "react";
import { File as FileModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AddEditNoteDialog from "./AddEditNoteDialog";

interface FileProps {
  file: FileModel;
}

export default function FileUpload({ file }: FileProps) {
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{file.filename}</CardTitle>
          <CardDescription>
            Uploaded PDF
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
