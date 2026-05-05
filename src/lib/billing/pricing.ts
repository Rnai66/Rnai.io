export type SkillName = 
  | "image/generate"
  | "image/edit"
  | "image/remove-background"
  | "image/upscale"
  | "image/stylize"
  | "text/generate"
  | "text/summarize"
  | "text/translate"
  | "text/rewrite"
  | "text/extract";

export const PRICING: Record<SkillName, number> = {
  "image/generate": 5,
  "image/edit": 8,
  "image/remove-background": 2,
  "image/upscale": 3,
  "image/stylize": 6,
  "text/generate": 1,
  "text/summarize": 1,
  "text/translate": 1,
  "text/rewrite": 1,
  "text/extract": 1,
};

export function getCost(skill: SkillName): number {
  return PRICING[skill] || 0;
}
