// Meta (Facebook) Conversions API — server-side event forwarding.
//
// Sends a server-to-server "Lead" event to Meta's Graph API to complement the
// browser Meta Pixel. Sharing an event_id between the pixel and this call lets
// Meta deduplicate the two, so a single lead is not double-counted while still
// benefiting from server-side reliability (ad-blocker resistant, better match
// quality via hashed PII + IP/user-agent).
//
// Mirrors the env-gated pattern used by googleSheetsService: it reads its
// config from process.env and no-ops when the access token is absent, so the
// site works unchanged until the token is configured. A failure here must
// never break the form submission it is attached to.

import { createHash } from "crypto";

// Graph API version. Bump as older versions are deprecated by Meta.
const GRAPH_API_VERSION = "v21.0";

// Public Meta Pixel ID (also hardcoded in client/index.html). Overridable via
// env for flexibility, but defaults to the known value.
const DEFAULT_PIXEL_ID = "1727254495132850";

export interface LeadEventInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  eventId?: string;
  eventSourceUrl?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  contentName?: string;
}

class MetaConversionsApi {
  private pixelId: string;
  private accessToken?: string;
  private testEventCode?: string;

  constructor() {
    this.pixelId = process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID;
    this.accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    this.testEventCode = process.env.META_CAPI_TEST_EVENT_CODE;
  }

  // True only when an access token is present. When false, sendLeadEvent no-ops.
  isConfigured(): boolean {
    return typeof this.accessToken === "string" && this.accessToken.length > 0;
  }

  // SHA-256 hash of a normalized (trimmed, lowercased) PII string, per Meta spec.
  private hashField(value?: string): string | undefined {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    if (!normalized) return undefined;
    return createHash("sha256").update(normalized).digest("hex");
  }

  // Phone must be digits only (with country code if available) before hashing.
  private hashPhone(value?: string): string | undefined {
    if (!value) return undefined;
    const digits = value.replace(/[^0-9]/g, "");
    if (!digits) return undefined;
    return createHash("sha256").update(digits).digest("hex");
  }

  async sendLeadEvent(input: LeadEventInput): Promise<void> {
    if (!this.isConfigured()) return;

    try {
      // Hashed PII identifiers.
      const userData: Record<string, unknown> = {};
      const em = this.hashField(input.email);
      if (em) userData.em = [em];
      const fn = this.hashField(input.firstName);
      if (fn) userData.fn = [fn];
      const ln = this.hashField(input.lastName);
      if (ln) userData.ln = [ln];
      const ph = this.hashPhone(input.phone);
      if (ph) userData.ph = [ph];

      // Non-hashed identifiers (sent as-is, per Meta spec).
      if (input.clientIp) userData.client_ip_address = input.clientIp;
      if (input.userAgent) userData.client_user_agent = input.userAgent;
      if (input.fbp) userData.fbp = input.fbp;
      if (input.fbc) userData.fbc = input.fbc;

      const event: Record<string, unknown> = {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: userData,
      };
      if (input.eventId) event.event_id = input.eventId;
      if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl;
      if (input.contentName) event.custom_data = { content_name: input.contentName };

      const payload: Record<string, unknown> = {
        data: [event],
        access_token: this.accessToken,
      };
      if (this.testEventCode) payload.test_event_code = this.testEventCode;

      const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${this.pixelId}/events`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`Meta CAPI request failed (${response.status}): ${text}`);
      }
    } catch (error) {
      // Swallow — a Conversions API failure must never break the caller.
      console.error("Meta CAPI sendLeadEvent error:", error);
    }
  }
}

export const metaCapi = new MetaConversionsApi();
