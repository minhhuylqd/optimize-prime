import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("PINECONE_API_KEY is not set");
}

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey,
});

export const notesIndex = pinecone.Index("optimize-prime");

export const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex: notesIndex }
);