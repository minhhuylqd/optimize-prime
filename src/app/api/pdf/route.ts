import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitterParams } from "langchain/text_splitter";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { notesIndex } from "@/lib/db/pinecone";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return Response.json({ error: "Invalid file" }, { status: 400 });
    }

    const filename = file.name.split(".")[0];

    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes);

    const loader = new PDFLoader(file, {
      splitPages: false,
    });

    const docs = await loader.load();

    const docContent = docs[0].pageContent;

    const text_splitter_param: Partial<RecursiveCharacterTextSplitterParams> = {
      separators: ["\n\n", "\n", ".", ","],
      chunkSize: 1000,
    };

    const text_splitter = new RecursiveCharacterTextSplitter(
      text_splitter_param,
    );

    const splits = await text_splitter.splitText(docContent);

    const embeddings = await Promise.all(
      splits.map(async (split) => await getEmbedding(split)),
    );

    const upload = await prisma.$transaction(async (tx) => {
      const upload = await tx.file.create({
        data: {
          filename,
          userId,
        },
      });

      const refineEmbeddings = embeddings.map((embedding, index) => ({
        id: `${upload.id}___${index}`,
        values: embedding,
        metadata: { 
          userId: userId,
          filename: filename,
          content: splits[index],
        },
      }));

      await notesIndex.upsert(refineEmbeddings);

      return upload;
    });

    return Response.json(upload, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
