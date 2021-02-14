import S3 from "aws-sdk/clients/s3";

export const getChatIds = () =>
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
        console.log("your file", data);

        const JSONString = data.Body.toString();
        console.log(
          "🚀 ~ file: getChatIds.js ~ line 21 ~ s3.getObject ~ JSONString",
          JSONString
        );
        const chatIdsJSON = JSON.parse(JSONString);
        console.log(
          "🚀 ~ file: getChatIds.js ~ line 21 ~ s3.getObject ~ JSONString",
          chatIdsJSON
        );

        resolve(chatIdsJSON.chatIds);
      }
    });

    return;
  });
