const HF_API = "https://api-inference.huggingface.co/models";
const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

function headers(contentType = "application/json") {
  return {
    Authorization: `Bearer ${HF_TOKEN}`,
    "Content-Type": contentType,
  };
}

export async function generateImage(prompt: string): Promise<Buffer> {
  const res = await fetch(`${HF_API}/black-forest-labs/FLUX.1-schnell`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ inputs: prompt }),
  });
  if (!res.ok) throw new Error(`HF error: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

export async function removeBackground(imageBase64: string): Promise<Buffer> {
  const imgData = Buffer.from(
    imageBase64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const res = await fetch(`${HF_API}/briaai/RMBG-1.4`, {
    method: "POST",
    headers: headers("application/octet-stream"),
    body: imgData,
  });
  if (!res.ok) throw new Error(`HF error: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

export async function editImage(
  imageBase64: string,
  maskBase64: string,
  prompt: string
): Promise<Buffer> {
  const toBlob = (b64: string) =>
    new Blob(
      [Buffer.from(b64.replace(/^data:image\/\w+;base64,/, ""), "base64")],
      { type: "image/png" }
    );

  const form = new FormData();
  form.append("image", toBlob(imageBase64));
  form.append("mask", toBlob(maskBase64));
  form.append("prompt", prompt);

  const res = await fetch(
    `${HF_API}/diffusers/stable-diffusion-xl-1.0-inpainting-0.1`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      body: form,
    }
  );
  if (!res.ok) throw new Error(`HF error: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}
