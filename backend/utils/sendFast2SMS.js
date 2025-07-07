const axios = require("axios");
require("dotenv").config();

const sendFast2Sms = async (to, message) => {
  const payload = {
    route: "v3",
    sender_id: "FSTSMS",
    message: message,
    language: "english",
    flash: 0,
    numbers: to,
  };

  try {
    const res = await axios.post("https://www.fast2sms.com/dev/bulkV2", payload, {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
    });

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message,
    };
  }
};

module.exports = sendFast2Sms;
