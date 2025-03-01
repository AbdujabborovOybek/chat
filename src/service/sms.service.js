const axios = require("axios");

const service_url = "https://app.sms-service.uz/api/send/sms";
const secret = process.env.SMS_SECRET_KEY;

class sms {
  async verify(msg, phone) {
    return new Promise(async (resolve, reject) => {
      try {
        const option = {
          url: service_url,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: { secret, text: msg, phone },
        };

        const result = await axios(option);
        resolve(result.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new sms();
