export interface Provider {
  name: string;
  generateImage?: (prompt: string) => Promise<Buffer>;
  editImage?: (image: string, mask: string, prompt: string) => Promise<Buffer>;
  removeBackground?: (image: string) => Promise<Buffer>;
  upscaleImage?: (image: string) => Promise<Buffer>;
  stylizeImage?: (image: string, prompt: string) => Promise<Buffer>;
  
  // Text Skills
  generateText?: (prompt: string, systemPrompt?: string) => Promise<string>;

  // Audio Skills
  generateAudio?: (text: string) => Promise<Buffer>;
  transcribeAudio?: (audioBase64: string) => Promise<string>;

  // Future skills (video) will be added here
}
