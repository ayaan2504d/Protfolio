import nodemailer from "nodemailer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 12 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(JSON.stringify(payload));
}

function readStreamBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let byteLength = 0;
    let tooLarge = false;

    request.on("data", (chunk) => {
      byteLength += Buffer.byteLength(chunk);
      if (byteLength > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
      } else if (!tooLarge) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
    });

    request.on("end", () => {
      if (tooLarge) {
        reject(new RequestError(413, "Request is too large."));
        return;
      }
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", reject);
  });
}

async function readJsonBody(request) {
  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    throw new RequestError(413, "Request is too large.");
  }

  const contentType = String(request.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new RequestError(415, "Send the form as JSON.");
  }

  let rawBody;
  if (request.body !== undefined) {
    rawBody = typeof request.body === "string" ? request.body : JSON.stringify(request.body);
    if (Buffer.byteLength(rawBody || "") > MAX_BODY_BYTES) {
      throw new RequestError(413, "Request is too large.");
    }
  } else {
    rawBody = await readStreamBody(request);
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new RequestError(400, "The form submission is not valid JSON.");
  }
}

function validateSubmission(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new RequestError(400, "Please complete all contact form fields.");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) {
    throw new RequestError(400, "Unable to verify this submission. Please try again.");
  }
  if (
    name.length < 1 ||
    name.length > 100 ||
    /[\r\n]/.test(name) ||
    email.length > 254 ||
    !EMAIL_PATTERN.test(email) ||
    subject.length < 1 ||
    subject.length > 150 ||
    /[\r\n]/.test(subject) ||
    message.length < 1 ||
    message.length > 5000 ||
    message.includes("\0")
  ) {
    throw new RequestError(400, "Enter a valid name, email, subject, and message.");
  }

  return { name, email, subject, message };
}

function getSmtpConfig(env) {
  const port = Number(env.SMTP_PORT);
  const secureValue = typeof env.SMTP_SECURE === "string" ? env.SMTP_SECURE.trim().toLowerCase() : "";
  const host = typeof env.SMTP_HOST === "string" ? env.SMTP_HOST.trim() : "";
  const rawPass = typeof env.SMTP_PASS === "string" ? env.SMTP_PASS : "";
  const config = {
    host,
    port,
    secure: secureValue ? secureValue === "true" : port === 465,
    user: typeof env.SMTP_USER === "string" ? env.SMTP_USER.trim() : "",
    pass: host.toLowerCase() === "smtp.gmail.com" ? rawPass.replace(/\s/g, "") : rawPass,
    adminEmail: typeof env.ADMIN_EMAIL === "string" ? env.ADMIN_EMAIL.trim() : "",
  };

  if (
    !config.host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    (secureValue !== "" && secureValue !== "true" && secureValue !== "false") ||
    !config.user ||
    !config.pass ||
    !EMAIL_PATTERN.test(config.adminEmail)
  ) {
    return null;
  }
  return config;
}

function getClientKey(request) {
  if (request.ip) return request.ip;
  const forwardedFor = request.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.socket?.remoteAddress || "unknown";
}

function allowSubmission(rateLimits, key, time) {
  const cutoff = time - RATE_LIMIT_WINDOW_MS;
  const attempts = (rateLimits.get(key) || []).filter((attempt) => attempt > cutoff);
  if (attempts.length >= RATE_LIMIT_MAX) {
    rateLimits.set(key, attempts);
    return false;
  }

  attempts.push(time);
  rateLimits.set(key, attempts);
  if (rateLimits.size > 1000) {
    for (const [clientKey, clientAttempts] of rateLimits) {
      if (clientAttempts.every((attempt) => attempt <= cutoff)) {
        rateLimits.delete(clientKey);
      }
    }
  }
  return true;
}

function createSmtpTransport(config, transportFactory = nodemailer.createTransport) {
  return transportFactory({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.port === 587 && !config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

export async function verifySmtpConnection(env = process.env, transportFactory = nodemailer.createTransport) {
  const config = getSmtpConfig(env);
  if (!config) {
    throw new Error("SMTP configuration is incomplete or invalid.");
  }
  const transporter = createSmtpTransport(config, transportFactory);
  try {
    await transporter.verify();
    return true;
  } finally {
    transporter.close();
  }
}

async function deliverContactEmail(config, submission) {
  const transporter = createSmtpTransport(config);
  try {
    await transporter.sendMail({
      from: { name: "Portfolio Contact Form", address: config.user },
      to: config.adminEmail,
      replyTo: { name: submission.name, address: submission.email },
      subject: `Portfolio contact: ${submission.subject}`,
      text: [
        `Visitor Name: ${submission.name}`,
        `Visitor Email: ${submission.email}`,
        `Subject: ${submission.subject}`,
        `Submission Date and Time (UTC): ${submission.submittedAt}`,
        "",
        "Full Message:",
        submission.message,
      ].join("\n"),
    });
  } finally {
    transporter.close();
  }
}

function getSafeSmtpErrorDetails(error) {
  const details = {
    name: error instanceof Error ? error.name : "UnknownError",
  };
  if (error && typeof error === "object") {
    if (typeof error.code === "string" && /^[A-Z0-9_]+$/.test(error.code)) {
      details.code = error.code;
    }
    if (Number.isInteger(error.responseCode)) {
      details.responseCode = error.responseCode;
    }
    if (typeof error.command === "string" && /^[A-Z ]{2,20}$/.test(error.command)) {
      details.command = error.command;
    }
  }
  return details;
}

export function createContactHandler({
  env = process.env,
  deliver = deliverContactEmail,
  now = () => new Date(),
  rateLimits = new Map(),
} = {}) {
  return async function handleContact(request, response) {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      sendJson(response, 405, { success: false, message: "Use POST to submit the contact form." });
      return;
    }

    const origin = request.headers.origin;
    if (origin) {
      let originHost;
      try {
        originHost = new URL(origin).host;
      } catch {
        sendJson(response, 403, { success: false, message: "This form submission is not allowed." });
        return;
      }
      if (originHost !== request.headers.host) {
        sendJson(response, 403, { success: false, message: "This form submission is not allowed." });
        return;
      }
    }

    let body;
    try {
      body = await readJsonBody(request);
    } catch (error) {
      if (error instanceof RequestError) {
        sendJson(response, error.status, { success: false, message: error.message });
        return;
      }
      throw error;
    }

    let submission;
    try {
      submission = validateSubmission(body);
    } catch (error) {
      if (error instanceof RequestError) {
        sendJson(response, error.status, { success: false, message: error.message });
        return;
      }
      throw error;
    }

    const timestamp = now();
    if (!allowSubmission(rateLimits, getClientKey(request), timestamp.getTime())) {
      sendJson(response, 429, { success: false, message: "Too many messages were submitted. Please try again later." });
      return;
    }

    const config = getSmtpConfig(env);
    if (!config) {
      sendJson(response, 503, { success: false, message: "Email delivery is not configured. Please email me directly." });
      return;
    }

    try {
      await deliver(config, { ...submission, submittedAt: timestamp.toISOString() });
    } catch (error) {
      console.error("Contact form email delivery failed:", getSafeSmtpErrorDetails(error));
      sendJson(response, 502, { success: false, message: "Email delivery failed. Please try again or email me directly." });
      return;
    }

    sendJson(response, 200, { success: true });
  };
}
