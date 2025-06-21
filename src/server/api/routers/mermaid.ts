import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const mermaidRouter = createTRPCRouter({
  toMer: publicProcedure
    .input(
      z.object({
        str: z.string(),
        current: z.string(),
        error: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        console.log("INPUT: ", input.str);
        console.log("CURRENT: ", input.current);
        console.log("ERROR: ", input.error);
        let prompt =
          "Your job is to create detailed diagrams using the Mermaid syntax for various use cases described by the current user.\n" +
          "If there is already Mermaid syntax in the prompt, you must attempt to modify the diagram as described by the user rather than starting from scratch.\n" +
          "YOU MUST RESPOND IN MERMAID SYNTAX. RESPONSES THAT ARE NOT A MERMAID CODEBLOCK WILL BE INVALID.\n" +
          "Notes: You can draw circles by using 2 parenthesis.\n";

        if (input.error) {
          prompt +=
            "\nIMPORTANT: The current diagram that was generated had a parsing error on the frontend: " +
            input.error +
            "\n" +
            "Please fix the syntax issues and ensure the Mermaid diagram is valid and properly formatted.\n" +
            "Focus on correcting any syntax errors, invalid node names, or malformed connections. Do not \n";
        }

        prompt += "The current prompt is: " + input.str;

        if (input.current) {
          prompt += "\nThe current diagram is: " + input.current;
        }

        const result = await model.generateContent([prompt]);
        console.log("RESULT: ", result.response.text());
        return result.response.text();
      } catch (error) {
        console.error("Error generating Mermaid diagram:", error);
        throw new Error("Failed to generate Mermaid diagram.");
      }
    }),
});
