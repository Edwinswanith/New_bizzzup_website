import "server-only";
import { COMPANY } from "@/content/company";

/** Contact delivery behind one interface. The provider is configuration, not code:
 *  CONTACT_PROVIDER=resend  → RESEND_API_KEY, CONTACT_FROM, optional CONTACT_TO
 *  CONTACT_PROVIDER=webhook → CONTACT_WEBHOOK_URL (receives the submission as JSON)
 *  unset                    → not configured; the form opens a prefilled email draft. */

export type Submission = {
  name: string;
  email: string;
  company?: string;
  need?: string;
  stage?: string;
  budget?: string;
  message: string;
};

export class NotConfigured extends Error {}
export class DeliveryFailed extends Error {}

type Provider = "resend" | "webhook";

function env(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function provider(): Provider | undefined {
  const value = env("CONTACT_PROVIDER")?.toLowerCase();
  return value === "resend" || value === "webhook" ? value : undefined;
}

function listEnv(name: string) {
  return env(name)?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
}

function recipients() {
  const configured = listEnv("CONTACT_TO");
  return configured.length ? configured : [COMPANY.email];
}

export function isConfigured() {
  const p = provider();
  if (p === "resend") return Boolean(env("RESEND_API_KEY") && recipients().length && env("CONTACT_FROM"));
  if (p === "webhook") return Boolean(env("CONTACT_WEBHOOK_URL"));
  return false;
}

const esc = (s = "") => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function deliver(sub: Submission) {
  if (!isConfigured()) throw new NotConfigured();
  const p = provider();
  const rows: [string, string | undefined][] = [
    ["Name", sub.name], ["Email", sub.email], ["Company", sub.company], ["Needs help with", sub.need],
    ["Project stage", sub.stage], ["Budget range", sub.budget],
  ];
  const text = `${rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${sub.message}`;
  let res: Response;
  if (p === "resend") {
    const html = `<h2 style="font-family:Georgia,serif">New friction from the website</h2><table cellpadding="6">${rows
      .filter(([, v]) => v).map(([k, v]) => `<tr><td style="color:#65666b">${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table><p style="white-space:pre-wrap;font-family:Georgia,serif;font-size:16px">${esc(sub.message)}</p>`;
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env("RESEND_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env("CONTACT_FROM"),
        to: recipients(),
        reply_to: sub.email,
        subject: `Website: ${sub.name}${sub.company ? ` (${sub.company})` : ""}`,
        html,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } else {
    res = await fetch(env("CONTACT_WEBHOOK_URL")!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "website", submittedAt: new Date().toISOString(), ...sub }),
      signal: AbortSignal.timeout(10_000),
    });
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new DeliveryFailed(`provider responded ${res.status}${body ? `: ${body.slice(0, 240)}` : ""}`);
  }
}
