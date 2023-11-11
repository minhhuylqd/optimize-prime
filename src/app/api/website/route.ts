import {
  createWebsiteSchema,
  deleteWebsiteSchema,
  updateWebsiteSchema,
} from "@/lib/validation/website";
import { auth } from "@clerk/nextjs";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"

import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createWebsiteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, url } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const webLoader = new PuppeteerWebBaseLoader(url);
    const webScrape = await webLoader.load();

    if (!webScrape) {
      return Response.json(
        { error: "Failed to scrape website" },
        { status: 400 },
      );
    }

    const text_splitter = new RecursiveCharacterTextSplitter();

    const chunks = await text_splitter.splitDocuments(webScrape);

    let embeddings: number[][] = []

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk.pageContent);
      embeddings.push(embedding);
    }

    const page = await prisma.$transaction(async (tx) => {
      const page = await tx.web.create({
        data: {
          title,
          url,
          userId,
        },
      });

      for (const embedding of embeddings) {
        await notesIndex.upsert([
          {
            id: page.id,
            values: embedding,
            metadata: { userId },
          },
        ]);
      }

      return page;
    });
    return Response.json(page, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

