const DOMParser = require("xmldom").DOMParser;
const S3 = require("aws-sdk/clients/s3");

export const updateChatIds = (chatIds) => {
  const s3 = new S3();

  const chatIdJson = JSON.stringify({ chatIds }, null, 2);
  console.log("🚀 ~ file: updateChatIds.js ~ line 8 ~ updateChatIds ~ chatIdJson", chatIdJson)

  const chatIdsParams = {
    Bucket: "jollity-track",
    Key: "chatIds.json",
    Body: chatIdJson,
    ACL: "public-read",
    ContentType: "application/json",
  };

  s3.upload(chatIdsParams, (err, data) => {
    if (err) console.log(err);
    else {
      console.log("chatIds uploadet to", data.Location);
    }
  });
};
