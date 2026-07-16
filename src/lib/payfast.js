import { md5 } from "./md5";

// PayFast's published sandbox test credentials (support.payfast.help,
// "How do I make test payments in sandbox mode?") — used until real
// sole-trader credentials are configured via env vars, so checkout
// works in test mode from the moment this ships.
const SANDBOX_DEFAULTS = {
  merchantId: "10004002",
  merchantKey: "q1cd2rdny4a53",
  passphrase: "payfast",
};

const MODE = (import.meta.env.VITE_PAYFAST_MODE || "sandbox").toLowerCase();
const IS_LIVE = MODE === "live";

const MERCHANT_ID  = import.meta.env.VITE_PAYFAST_MERCHANT_ID  || SANDBOX_DEFAULTS.merchantId;
const MERCHANT_KEY = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || SANDBOX_DEFAULTS.merchantKey;
// "||" not "??": an unset GitHub Actions secret is substituted as an
// empty string (not undefined), and an empty string here should also
// fall back to the sandbox default while in sandbox mode.
const PASSPHRASE = import.meta.env.VITE_PAYFAST_PASSPHRASE || (IS_LIVE ? "" : SANDBOX_DEFAULTS.passphrase);

const PROCESS_URL = IS_LIVE
  ? "https://www.payfast.co.za/eng/process"
  : "https://sandbox.payfast.co.za/eng/process";

export const payfastMode = MODE;

// PayFast's signature follows PHP's urlencode() convention: space -> "+",
// and it also percent-encodes ! ' ( ) ~ , which encodeURIComponent leaves
// untouched. A mismatch here is a well-known cause of "signature does
// not match" errors for non-PHP integrations, so this shims the gap
// instead of calling encodeURIComponent directly.
function phpUrlEncode(value) {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/[!'()~]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

// Empty/undefined fields must be dropped entirely before signing, not
// sent as blanks — including them as blanks produces a signature PayFast
// won't recognise.
function buildQueryString(pairs) {
  return pairs
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}=${phpUrlEncode(String(value))}`)
    .join("&");
}

function signature(pairs) {
  const qs = buildQueryString(pairs);
  const toHash = PASSPHRASE ? `${qs}&passphrase=${phpUrlEncode(PASSPHRASE)}` : qs;
  return md5(toHash);
}

// Builds the ordered field list for a payment. Order matters: the
// signature must be computed over the same field order that gets
// posted.
export function buildPayfastFields({
  returnUrl, cancelUrl, notifyUrl,
  nameFirst, nameLast, email,
  paymentId, amount, itemName, itemDescription,
}) {
  const pairs = [
    ["merchant_id", MERCHANT_ID],
    ["merchant_key", MERCHANT_KEY],
    ["return_url", returnUrl],
    ["cancel_url", cancelUrl],
    ["notify_url", notifyUrl],
    ["name_first", nameFirst],
    ["name_last", nameLast],
    ["email_address", email],
    ["m_payment_id", paymentId],
    ["amount", Number(amount).toFixed(2)],
    ["item_name", itemName],
    ["item_description", itemDescription],
  ];
  const present = pairs.filter(([, value]) => value !== undefined && value !== null && value !== "");
  return { fields: present, signature: signature(present) };
}

// Builds a hidden auto-submitting form and posts it, redirecting the
// browser to PayFast's hosted payment page.
export function redirectToPayfast(paymentInput) {
  const { fields, signature: sig } = buildPayfastFields(paymentInput);
  const form = document.createElement("form");
  form.method = "POST";
  form.action = PROCESS_URL;
  form.style.display = "none";

  for (const [key, value] of fields) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }
  const sigInput = document.createElement("input");
  sigInput.type = "hidden";
  sigInput.name = "signature";
  sigInput.value = sig;
  form.appendChild(sigInput);

  document.body.appendChild(form);
  form.submit();
}
