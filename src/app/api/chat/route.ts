import { notesIndex, vectorStore } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const chainResponse = await chain._call({"question": body.messages})

    // console.log(chainResponse)

    const question = body.messages[body.messages.length - 1].content;
    // console.log("question from body.messages: " + question);

    const vectorStoreRetriever = vectorStore.asRetriever(10);

    const relatedDocs =
      await vectorStoreRetriever.getRelevantDocuments(question);
    // console.log(relatedDocs);

    const relatedDocsRefined = relatedDocs
      .filter((doc) => doc.metadata.userId === userId)
      .map((doc) => ({
        filename: doc.metadata.filename,
        content: doc.metadata.content,
      }));

    // const llm = new OpenAI({
    //   temperature: 0.9,
    //   maxTokens: 500,
    // });

    // const chain = RetrievalQAChain.fromLLM(llm, vectorStoreRetriever, {returnSourceDocuments: true})

    // const query = new PromptTemplate({
    //   template: `Question: ${question}`,
    //   inputVariables: ["question"],
    // })

    // const chainRes = await chain.call({ query });

    // const result = await chain.call({
    //   chainRes,
    // });

    // console.log(result)

    // const vectorQueryResponse = await notesIndex.query({
    //   vector: embedding,
    //   topK: 4,
    //   filter: { userId },
    // });

    // const relevantFiles = await prisma.file.findMany({
    //   where: {
    //     id: {
    //       in: vectorQueryResponse.matches.map((match) => match.id.slice(0, 24)),
    //     },
    //   },
    // });

    // console.log("Relevant files found: ", relevantFiles);

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are an intelligent business analyst. You answer the user's question based on their uploaded files." +
        "The relevant files for this query are: " +
        relatedDocsRefined.map((doc) => `Filename: ${doc.filename}\nContent: ${doc.content}`).join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
