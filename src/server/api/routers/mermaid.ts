import speech, { protos } from "@google-cloud/speech";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const mermaidRouter = createTRPCRouter({
  toMer: publicProcedure
    .input(z.object({ str: z.string() }))
    .query(async ({ input }) => {
      const prompt = "Moving forward please respond to prompts with the mermaid diagram language! DO NOT POST ANYTHING OTHER THAN THE MERMAID CODE! "+input.str;

      const result = await model.generateContent([prompt]);
      console.log(result.response.text());
      return result.response.text();
    }),
});
