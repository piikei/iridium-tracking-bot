const S3 = require("aws-sdk/clients/s3");

module.exports = {
  getChatIds: () =>
    new Promise((resolve, reject) => {
      const s3 = new S3();

      const getParams = {
        Bucket: "jollity-track",
        Key: "chatIds.json",
      };

      s3.getObject(getParams, (err, data) => {
        if (err) {
          console.log("err", err);
          reject(err);
          return;
        } else {
          const JSONString = data.Body.toString();
          const chatIdsJSON = JSON.parse(JSONString);
          resolve(chatIdsJSON.chatIds);
        }
      });

      return;
    }),
};
