import { Provider } from "../types";

const HF_API = "https://api-inference.huggingface.co/models";
const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

function headers(contentType = "application/json") {
  return {
    Authorization: `Bearer ${HF_TOKEN}`,
    "Content-Type": contentType,
  };
}

export const HuggingFaceProvider: Provider = {
  name: "huggingface",

  async generateImage(prompt: string) {
    const res = await fetch(`${HF_API}/black-forest-labs/FLUX.1-schnell`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ inputs: prompt }),
    });
    if (!res.ok) throw new Error(`HF error: ${await res.text()}`);
    return Buffer.from(await res.arrayBuffer());
  },
  
  async removeBackground(imageBase64: string) {
    const imgData = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const res = await fetch(`${HF_API}/briaai/RMBG-1.4`, {
      method: "POST",
      headers: headers("application/octet-stream"),
      body: imgData,
    });
    if (!res.ok) throw new Error(`HF error: ${await res.text()}`);
    return Buffer.from(await res.arrayBuffer());
  },

  async editImage(imageBase64: string, maskBase64: string, prompt: string) {
    const toBlob = (b64: string) => new Blob([Buffer.from(b64.replace(/^data:image\/\w+;base64,/, ""), "base64")], { type: "image/png" });
    const form = new FormData();
    form.append("image", toBlob(imageBase64));
    form.append("mask", toBlob(maskBase64));
    form.append("prompt", prompt);

    const res = await fetch(`${HF_API}/diffusers/stable-diffusion-xl-1.0-inpainting-0.1`, {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      body: form,
    });
    if (!res.ok) throw new Error(`HF error: ${await res.text()}`);
    return Buffer.from(await res.arrayBuffer());
  },

  async upscaleImage(imageBase64: string) {
    const imgData = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    
    // Note: HF Free API might have restrictions on x4-upscaler size, but this is the standard endpoint.
    const res = await fetch(`${HF_API}/stabilityai/stable-diffusion-x4-upscaler`, {
      method: "POST",
      headers: headers("application/octet-stream"),
      body: imgData,
    });
    if (!res.ok) throw new Error(`HF error: ${await res.text()}`);
    return Buffer.from(await res.arrayBuffer());
  },

  async stylizeImage(imageBase64: string, prompt: string) {
    const imgData = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
    // Some models like instruct-pix2pix can take image as input and prompt in headers or json, but we'll use base64 JSON payload
    const res = await fetch(`${HF_API}/timbrooks/instruct-pix2pix`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ 
        inputs: prompt,
        image: imageBase64 
      }),
    });
    if (!res.ok) throw new Error(`HF error: ${await res.text()}`);
    return Buffer.from(await res.arrayBuffer());
  },

  async generateAudio(text: string) {
    // Using facebook/mms-tts-eng for high quality free TTS
    const res = await fetch(`${HF_API}/facebook/mms-tts-eng`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ inputs: text }),
    });

    if (!res.ok) throw new Error(`HF TTS error: ${await res.text()}`);
    return Buffer.from(await res.arrayBuffer());
  }
};
