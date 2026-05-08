import { NextResponse } from "next/server";
import { PRICING } from "@/lib/billing/pricing";

const jsonRequest = (properties: Record<string, any>, required: string[]) => ({
  required,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required,
        properties,
      },
    },
  },
});

const textResponse = {
  description: "Successful text response",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          text: { type: "string" },
        },
      },
    },
  },
};

const fileResponse = (format: string) => ({
  description: "Successful file response",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          url: { type: "string", format: "uri" },
          format: { type: "string", example: format },
        },
      },
    },
  },
});

const authResponses = {
  "400": { description: "Invalid request body" },
  "401": { description: "Missing or invalid API key" },
  "402": { description: "Insufficient credits" },
  "429": { description: "Rate limit exceeded" },
  "500": { description: "Internal server error" },
};

const securePost = (summary: string, requestBody: any, response: any, credits: number) => ({
  post: {
    summary,
    security: [{ bearerAuth: [] }],
    "x-rnai-credits": credits,
    requestBody,
    responses: {
      "200": response,
      ...authResponses,
    },
  },
});

export async function GET() {
  return NextResponse.json({
    openapi: "3.1.0",
    info: {
      title: "Rnai Platform API",
      version: "0.1.0",
      description: "AI image, text, and audio API backed by API keys, credits, and usage logs.",
    },
    servers: [{ url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "rnai_sk_*",
        },
      },
    },
    paths: {
      "/api/v1/generate": securePost(
        "Generate an image from a text prompt",
        jsonRequest({ prompt: { type: "string", maxLength: 2000 } }, ["prompt"]),
        fileResponse("png"),
        PRICING["image/generate"]
      ),
      "/api/v1/edit": securePost(
        "Edit an image with a mask and prompt",
        jsonRequest({
          image: { type: "string", description: "Base64 image string" },
          mask: { type: "string", description: "Base64 image mask string" },
          prompt: { type: "string", maxLength: 2000 },
        }, ["image", "mask", "prompt"]),
        fileResponse("png"),
        PRICING["image/edit"]
      ),
      "/api/v1/remove-background": securePost(
        "Remove an image background",
        jsonRequest({ image: { type: "string", description: "Base64 image string" } }, ["image"]),
        fileResponse("png"),
        PRICING["image/remove-background"]
      ),
      "/api/v1/upscale": securePost(
        "Upscale an image",
        jsonRequest({ image: { type: "string", description: "Base64 image string" } }, ["image"]),
        fileResponse("png"),
        PRICING["image/upscale"]
      ),
      "/api/v1/stylize": securePost(
        "Stylize an image with a prompt",
        jsonRequest({
          image: { type: "string", description: "Base64 image string" },
          prompt: { type: "string", maxLength: 2000 },
        }, ["image", "prompt"]),
        fileResponse("png"),
        PRICING["image/stylize"]
      ),
      "/api/v1/text/generate": securePost(
        "Generate text",
        jsonRequest({ prompt: { type: "string", maxLength: 12000 } }, ["prompt"]),
        textResponse,
        PRICING["text/generate"]
      ),
      "/api/v1/text/summarize": securePost(
        "Summarize text",
        jsonRequest({ text: { type: "string", maxLength: 50000 } }, ["text"]),
        textResponse,
        PRICING["text/summarize"]
      ),
      "/api/v1/text/translate": securePost(
        "Translate text",
        jsonRequest({
          text: { type: "string", maxLength: 50000 },
          targetLanguage: { type: "string", maxLength: 80 },
        }, ["text", "targetLanguage"]),
        textResponse,
        PRICING["text/translate"]
      ),
      "/api/v1/text/rewrite": securePost(
        "Rewrite text in a target tone",
        jsonRequest({
          text: { type: "string", maxLength: 50000 },
          tone: { type: "string", maxLength: 80, default: "professional" },
        }, ["text"]),
        textResponse,
        PRICING["text/rewrite"]
      ),
      "/api/v1/text/extract": securePost(
        "Extract structured data from text",
        jsonRequest({
          text: { type: "string", maxLength: 50000 },
          schema: { type: "string", maxLength: 4000 },
        }, ["text", "schema"]),
        textResponse,
        PRICING["text/extract"]
      ),
      "/api/v1/audio/tts": securePost(
        "Generate speech from text",
        jsonRequest({ text: { type: "string", maxLength: 5000 } }, ["text"]),
        fileResponse("mp3"),
        PRICING["audio/tts"]
      ),
      "/api/v1/audio/stt": securePost(
        "Transcribe audio",
        jsonRequest({ audio: { type: "string", description: "Base64 audio string" } }, ["audio"]),
        textResponse,
        PRICING["audio/stt"]
      ),
    },
  });
}
