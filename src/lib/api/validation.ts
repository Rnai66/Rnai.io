import { NextRequest, NextResponse } from "next/server";

type StringRule = {
  required?: boolean;
  min?: number;
  max?: number;
  defaultValue?: string;
  pattern?: RegExp;
  patternMessage?: string;
};

export type JsonSchema = Record<string, StringRule>;

type ValidationSuccess<T> = { data: T; response?: never };
type ValidationFailure = { data?: never; response: NextResponse };

export function requiredString(options: Omit<StringRule, "required"> = {}): StringRule {
  return { ...options, required: true };
}

export function optionalString(options: Omit<StringRule, "required"> = {}): StringRule {
  return { ...options, required: false };
}

export async function validateJson<T extends Record<string, string>>(
  req: NextRequest,
  schema: JsonSchema
): Promise<ValidationSuccess<T> | ValidationFailure> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return {
      response: NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 }),
    };
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      response: NextResponse.json({ error: "Request body must be a JSON object" }, { status: 400 }),
    };
  }

  const source = body as Record<string, unknown>;
  const data: Record<string, string> = {};

  for (const [field, rule] of Object.entries(schema)) {
    const value = source[field];

    if (value === undefined || value === null || value === "") {
      if (rule.required) {
        return {
          response: NextResponse.json({ error: `${field} is required` }, { status: 400 }),
        };
      }
      if (rule.defaultValue !== undefined) data[field] = rule.defaultValue;
      continue;
    }

    if (typeof value !== "string") {
      return {
        response: NextResponse.json({ error: `${field} must be a string` }, { status: 400 }),
      };
    }

    const trimmed = value.trim();
    const normalized = trimmed.length > 0 ? trimmed : value;

    if (rule.min !== undefined && normalized.length < rule.min) {
      return {
        response: NextResponse.json({ error: `${field} must be at least ${rule.min} characters` }, { status: 400 }),
      };
    }

    if (rule.max !== undefined && normalized.length > rule.max) {
      return {
        response: NextResponse.json({ error: `${field} must be ${rule.max} characters or fewer` }, { status: 400 }),
      };
    }

    if (rule.pattern && !rule.pattern.test(normalized)) {
      return {
        response: NextResponse.json(
          { error: rule.patternMessage || `${field} has an invalid format` },
          { status: 400 }
        ),
      };
    }

    data[field] = normalized;
  }

  return { data: data as T };
}

export const base64ImageRule = requiredString({
  min: 32,
  max: 12_000_000,
  pattern: /^(data:image\/(png|jpeg|jpg|webp);base64,)?[A-Za-z0-9+/=\s]+$/,
  patternMessage: "image must be a base64 image string",
});

export const base64AudioRule = requiredString({
  min: 32,
  max: 20_000_000,
  pattern: /^(data:audio\/(wav|mpeg|mp3|webm|ogg);base64,)?[A-Za-z0-9+/=\s]+$/,
  patternMessage: "audio must be a base64 audio string",
});
