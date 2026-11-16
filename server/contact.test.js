import assert from "node:assert/strict";
import test from "node:test";
import { createContactHandler, verifySmtpConnection } from "./contact.js";

const smtpEnv = {
  SMTP_HOST: "smtp.example.com",
  SMTP_PORT: "587",
  SMTP_SECURE: "false",
  SMTP_USER: "sender@example.com",
  SMTP_PASS: "test-password",
  ADMIN_EMAIL: "admin@example.com",
};

const validSubmission = {
  name: "A Visitor",
  email: "visitor@example.com",
  subject: "Project question",
  message: "I'd like to discuss a project.",
  website: "",
};

function createRequest(body, overrides = {}) {
  return {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "portfolio.example",
    },
    ip: "192.0.2.1",
    body,
    ...overrides,
  };
}

function createResponse() {
  return {
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body) {
      this.body = JSON.parse(body);
    },
  };
}

async function submit(handler, body, overrides) {
  const response = createResponse();
  await handler(createRequest(body, overrides), response);
  return response;
}

test("validates visitor email addresses before sending", async () => {
  let deliveries = 0;
  const handler = createContactHandler({
    env: smtpEnv,
    deliver: async () => { deliveries += 1; },
  });

  const response = await submit(handler, { ...validSubmission, email: "not-an-email" });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
  assert.equal(deliveries, 0);
});

test("sends all submitted details with the server timestamp", async () => {
  let delivered;
  const handler = createContactHandler({
    env: smtpEnv,
    now: () => new Date("2026-11-16T12:34:56.000Z"),
    deliver: async (config, submission) => {
      delivered = { config, submission };
    },
  });

  const response = await submit(handler, validSubmission);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(delivered.config.adminEmail, smtpEnv.ADMIN_EMAIL);
  assert.deepEqual(delivered.submission, {
    name: validSubmission.name,
    email: validSubmission.email,
    subject: validSubmission.subject,
    message: validSubmission.message,
    submittedAt: "2026-11-16T12:34:56.000Z",
  });
});

test("rejects honeypot submissions without sending email", async () => {
  let deliveries = 0;
  const handler = createContactHandler({
    env: smtpEnv,
    deliver: async () => { deliveries += 1; },
  });

  const response = await submit(handler, { ...validSubmission, website: "spam" });

  assert.equal(response.statusCode, 400);
  assert.equal(deliveries, 0);
});

test("limits submissions from a client within the rate-limit window", async () => {
  const handler = createContactHandler({
    env: smtpEnv,
    deliver: async () => {},
  });
  let response;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    response = await submit(handler, validSubmission);
  }

  assert.equal(response.statusCode, 429);
  assert.equal(response.body.success, false);
});

test("reports missing SMTP configuration instead of claiming delivery", async () => {
  const handler = createContactHandler({ env: {}, deliver: async () => {} });

  const response = await submit(handler, validSubmission);

  assert.equal(response.statusCode, 503);
  assert.equal(response.body.success, false);
});

test("verifies the configured SMTP connection without exposing credentials", async () => {
  let transportOptions;
  let verified = false;
  let closed = false;

  const result = await verifySmtpConnection(smtpEnv, (options) => {
    transportOptions = options;
    return {
      async verify() {
        verified = true;
      },
      close() {
        closed = true;
      },
    };
  });

  assert.equal(result, true);
  assert.equal(verified, true);
  assert.equal(closed, true);
  assert.equal(transportOptions.host, smtpEnv.SMTP_HOST);
  assert.equal(transportOptions.port, 587);
  assert.equal(transportOptions.secure, false);
  assert.equal(transportOptions.requireTLS, true);
});

test("normalizes whitespace in Gmail App Passwords before authentication", async () => {
  let transportOptions;
  await verifySmtpConnection(
    { ...smtpEnv, SMTP_HOST: "smtp.gmail.com", SMTP_PASS: "abcd efgh ijkl mnop" },
    (options) => {
      transportOptions = options;
      return {
        async verify() {},
        close() {},
      };
    },
  );

  assert.equal(transportOptions.auth.pass, "abcdefghijklmnop");
});
