import axios from "axios";
import { broadcastMessage } from "../utils/websocket.js";

const botToken = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID;

export const sendMessageToSlack = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: channelId,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${botToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the full response from Slack
    console.log("Slack API Response:", response.data);

    if (!response.data.ok) {
      console.error("Slack API Error:", response.data.error);
      return res.status(500).json({ success: false, error: response.data.error });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to send message to Slack:", error.response?.data || error.message);
    return res.status(500).json({ success: false, error: "Failed to send message to Slack" });
  }
};

export const handleSlackEvents = (req, res) => {
  const body = req.body;

  // Respond to Slack's challenge during setup
  if (body.type === "url_verification") {
    return res.send({ challenge: body.challenge });
  }

  // Handle incoming messages
  if (body.event && body.event.type === "message" && !body.event.bot_id) {
    const { text, user, channel } = body.event;

    console.log(`Received message from Slack: ${text} (User: ${user}, Channel: ${channel})`);

    // Broadcast the message to all connected clients
    broadcastMessage({
      text,
      user,
      channel,
      isBot: false, // Indicates this is a user message
    });
  }

  res.send("OK");
};