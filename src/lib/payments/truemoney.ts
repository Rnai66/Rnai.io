// TrueMoney Gift Voucher (อังเปา/e-Voucher) redemption.
//
// Redeems a TrueMoney gift voucher INTO the business wallet phone number
// configured via TRUEMONEY_PHONE, then returns the redeemed amount so the
// caller can credit the user's Rnai balance.
//
// Note: TrueMoney has no official public API for this; this uses the same
// endpoint the gift.truemoney.com web page calls. TrueMoney itself prevents
// double-redemption to the same phone (TARGET_USER_REDEEMED).

export class TrueMoneyError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "TrueMoneyError";
    this.code = code;
  }
}

export interface RedeemResult {
  amountBaht: number;
  voucherId: string;
}

/** Extract the 18-char-ish voucher hash from a full gift URL or raw hash. */
export function extractVoucherHash(input: string): string {
  const trimmed = input.trim();
  const fromUrl = trimmed.match(/[?&]v=([A-Za-z0-9]+)/);
  if (fromUrl) return fromUrl[1];
  const raw = trimmed.match(/^([A-Za-z0-9]{16,})$/);
  if (raw) return raw[1];
  throw new TrueMoneyError("BAD_INPUT", "Invalid voucher code or link");
}

const friendly: Record<string, string> = {
  VOUCHER_OUT_OF_STOCK: "บัตรนี้ถูกใช้ไปแล้ว",
  VOUCHER_EXPIRED: "บัตรนี้หมดอายุแล้ว",
  VOUCHER_NOT_FOUND: "ไม่พบบัตรนี้",
  TARGET_USER_REDEEMED: "บัตรนี้ถูกใช้กับบัญชีนี้แล้ว",
  CANNOT_GET_OWN_VOUCHER: "ไม่สามารถใช้บัตรของตัวเองได้",
  MOBILE_NUMBER_INVALID: "เบอร์ผู้รับไม่ถูกต้อง",
  INTERNAL_ERROR: "ระบบ TrueMoney ขัดข้อง ลองใหม่อีกครั้ง",
};

/**
 * Redeem a voucher into `mobile`. Throws TrueMoneyError on any non-success.
 */
export async function redeemVoucher(
  voucherHash: string,
  mobile: string,
  timeoutMs = 15000
): Promise<RedeemResult> {
  const url = `https://gift.truemoney.com/campaign/vouchers/${encodeURIComponent(
    voucherHash
  )}/redeem`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let json: any;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; RnaiPay/1.0)",
      },
      body: JSON.stringify({ mobile, voucher_hash: voucherHash }),
      signal: controller.signal,
    });
    json = await res.json().catch(() => ({}));
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error)?.name === "AbortError") {
      throw new TrueMoneyError("TIMEOUT", "TrueMoney request timed out");
    }
    throw new TrueMoneyError("NETWORK", "Could not reach TrueMoney");
  } finally {
    clearTimeout(timer);
  }

  const code: string = json?.status?.code ?? "INTERNAL_ERROR";
  if (code === "SUCCESS") {
    const data = json?.data ?? {};
    const amount = parseFloat(
      data?.my_ticket?.amount_baht ??
        data?.voucher?.redeemed_amount_baht ??
        data?.voucher?.amount_baht ??
        "0"
    );
    const voucherId: string =
      data?.voucher?.voucher_id || data?.voucher?.link || voucherHash;
    if (!(amount > 0)) {
      throw new TrueMoneyError("ZERO_AMOUNT", "Voucher returned no amount");
    }
    return { amountBaht: amount, voucherId };
  }

  throw new TrueMoneyError(code, friendly[code] ?? json?.status?.message ?? "Redeem failed");
}
