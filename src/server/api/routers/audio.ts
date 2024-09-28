import speech, { protos } from "@google-cloud/speech";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const request = {
  config: {
    //encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
    encoding:
      protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
    sampleRateHertz: 16000,
    languageCode: "en-US",
  },
  audio: {
    uri: "gs://cloud-samples-data/speech/brooklyn_bridge.raw",
  },
  interimResults: true,
};

const client = new speech.SpeechClient();

export const audioRouter = createTRPCRouter({
  toText: publicProcedure
    .input(z.object({ audio_file: z.instanceof(Blob) }))
    .query(async ({ input }) => {
      request.audio.uri = URL.createObjectURL(input.audio_file);
      const [response] = await client.recognize(request);
      const transcription = response.results
        ? response.results
            .map((result) =>
              result.alternatives?.[0] ? result.alternatives[0].transcript : "",
            )
            .join("\n")
        : "No transcription available";
      console.log(`Transcription: ${transcription}`);

      return transcription;
    }),
});
