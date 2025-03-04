import axios from "axios";

const botToken = process.env.SLACK_BOT_TOKEN

export const sendToSlack = async (channel, text) => {
    try {
      await axios.post(
        "https://slack.com/api/chat.postMessage",
        {
          channel,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${botToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true };
    } catch (error) {
      console.error("Failed to send message to Slack:", error.response?.data || error.message);
      return { success: false, error: "Failed to send message to Slack" };
    }
  };

  export const handleSlackEvent = (event, broadcastMessage) => {
    if (event.type === "message" && !event.bot_id) {
      const { text, user, channel } = event;
  
      console.log(`Received message from Slack: ${text} (User: ${user}, Channel: ${channel})`);
  
      broadcastMessage({ text, user, channel });
    }
  };