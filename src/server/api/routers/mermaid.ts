import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const mermaidRouter = createTRPCRouter({
  toMer: publicProcedure
    .input(z.object({ str: z.string(), current: z.string() }))
    .query(async ({ input }) => {
      console.log("INPUT: ", input.str);
      console.log("CURRENT: ", input.current);
      let prompt =
        "Your job is to create detailed diagrams using the Mermaid syntax for various use cases described by the current user.\n" +
        "If there is already Mermaid syntax in the prompt, you must attempt to modify the diagram as described by the user rather than starting from scratch.\n" +
        "YOU MUST RESPOND IN MERMAID SYNTAX. RESPONSES THAT ARE NOT A MERMAID CODEBLOCK WILL BE INVALID.\n" +
        "The current prompt is: " +
        input.str;

      if (input.current) {
        prompt += "\nThe current diagram is: " + input.current;
      }

      const result = await model.generateContent([prompt]);
      return result.response.text();
    }),
});
