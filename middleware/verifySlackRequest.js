
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

// Middleware to capture raw body
export const rawBodyMiddleware = (req, res, next) => {
  let data = "";
  req.setEncoding("utf8");

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    req.rawBody = data; // Store the raw body
    next();
  });
};

// Middleware to verify Slack requests
export const verifySlackRequest = (req, res, next) => {
  const timestamp = req.headers["x-slack-request-timestamp"];
  const signature = req.headers["x-slack-signature"];

  // Bypass verification for url_verification requests
  if (req.body.type === "url_verification") {
    return next();
  }

  if (!timestamp || !signature) {
    return res.status(403).send("Invalid request");
  }

  // Prevent replay attacks by checking the timestamp
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 300) {
    return res.status(403).send("Request timestamp is too old");
  }

  // Construct the base string
  const baseString = `v0:${timestamp}:${req.rawBody}`;

  // Create the HMAC hash
  const hmac = crypto.createHmac("sha256", slackSigningSecret);
  hmac.update(baseString);
  const computedSignature = `v0=${hmac.digest("hex")}`;

  // Compare the computed hash with the received signature
  if (computedSignature !== signature) {
    return res.status(403).send("Invalid request");
  }

  next();
};