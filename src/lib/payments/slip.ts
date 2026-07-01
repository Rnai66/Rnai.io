// Slip verification for TrueMoney / bank transfer slips.
//
// Default provider: SlipOK (https://slipok.com) — reads the QR embedded in a
// Thai transfer slip image and returns the verified transaction (amount,
// receiver, transRef). SlipOK also blocks re-using the same slip.
//
// Env:
//   SLIP_PROVIDER=slipok            (default)
//   SLIPOK_API_KEY=...              SlipOK API key (x-authorization)
//   SLIPOK_BRANCH_ID=...            SlipOK branch id (in the endpoint path)
//   TRUEMONEY_SLIP_RECEIVER=...     optional substring that must appear in the
//                                   receiver name/number (guards against slips
//                                   paid to a different account)

export class SlipError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "SlipError";
    this.code = code;
  }
}

export interface SlipResult {
  amountBaht: number;
  transRef: string;
  receiver: string;
  sender?: string;
}

const friendly: Record<string, string> = {
  ALREADY_USED: "สลิปนี้ถูกใช้ไปแล้ว",
  NOT_FOUND: "ตรวจสอบสลิปไม่สำเร็จ ลองถ่ายใหม่ให้ชัด",
  RECEIVER_MISMATCH: "บัญชีผู้รับในสลิปไม่ตรงกับบัญชีร้าน",
  NETWORK: "เชื่อมต่อระบบตรวจสลิปไม่ได้",
  TIMEOUT: "ตรวจสลิปใช้เวลานานเกินไป",
};

export function slipMessage(code: string, fallback?: string): string {
  return friendly[code] ?? fallback ?? "ตรวจสลิปไม่สำเร็จ";
}

/** Verify a slip image via the configured provider. Throws SlipError on failure. */
export async function verifySlipImage(file: Blob, timeoutMs = 20000): Promise<SlipResult> {
  const provider = (process.env.SLIP_PROVIDER || "slipok").toLowerCase();
  if (provider === "slipok") return verifySlipOk(file, timeoutMs);
  throw new SlipError("PROVIDER", `Unsupported slip provider: ${provider}`);
}

async function verifySlipOk(file: Blob, timeoutMs: number): Promise<SlipResult> {
  const branch = process.env.SLIPOK_BRANCH_ID;
  const key = process.env.SLIPOK_API_KEY;
  if (!branch || !key) throw new SlipError("NOT_CONFIGURED", "Slip verification not configured");

  const form = new FormData();
  form.append("files", file, "slip.jpg");
  form.append("log", "true");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let json: any;
  try {
    const res = await fetch(`https://api.slipok.com/api/line/apikey/${branch}`, {
      method: "POST",
      headers: { "x-authorization": key },
      body: form,
      signal: controller.signal,
    });
    json = await res.json().catch(() => ({}));
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error)?.name === "AbortError") throw new SlipError("TIMEOUT", friendly.TIMEOUT);
    throw new SlipError("NETWORK", friendly.NETWORK);
  } finally {
    clearTimeout(timer);
  }

  if (!json?.success) {
    // SlipOK duplicate codes: 1012 (already saved), 1014 (already used)
    const raw = String(json?.code ?? "");
    if (raw === "1012" || raw === "1014") throw new SlipError("ALREADY_USED", friendly.ALREADY_USED);
    throw new SlipError(raw || "FAIL", json?.message || friendly.NOT_FOUND);
  }

  const d = json.data ?? {};
  const amountBaht = Number(d.amount);
  const transRef: string = d.transRef || d.transReff || d.ref || "";
  const receiver: string =
    d.receiver?.displayName ||
    d.receiver?.name ||
    d.receiver?.account?.value ||
    d.receivingBank ||
    "";

  if (!(amountBaht > 0) || !transRef) {
    throw new SlipError("NOT_FOUND", friendly.NOT_FOUND);
  }

  const expected = process.env.TRUEMONEY_SLIP_RECEIVER;
  if (expected) {
    const norm = (s: string) => s.replace(/[\s-]/g, "").toLowerCase();
    if (!norm(receiver).includes(norm(expected))) {
      throw new SlipError("RECEIVER_MISMATCH", friendly.RECEIVER_MISMATCH);
    }
  }

  return { amountBaht, transRef, receiver, sender: d.sender?.displayName };
}
