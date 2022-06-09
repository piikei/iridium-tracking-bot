const { connect } = require("../imapClient");

module.exports = {
  fetchIridiumMessages: () =>
    new Promise((resolve, reject) => {
      connect(
        (imap) => (err, box) => {
          var messages = [];

          if (err) {
            console.log("connection error: " + err);
            reject({ err: "connection error: " + err });
            imap.end();
            return;

          }

          imap.search(
            ["UNSEEN", ["FROM", "881631452105@msg.iridium.com"]],
            function (err, results) {
              if (err) {
                console.log("search error: " + err);
                reject({ err: "search for messages faild" });
                imap.end();
                return;

              }

              if (!results || !results.length) {
                console.log("No unseen email available");
                reject({ err: "no messages found" });
                imap.end();
                return;
              }

              var f = imap.fetch(results, {
                bodies: ["HEADER.FIELDS (DATE)", "TEXT"],
              });

              f.on("message", function (msg, seqno) {
                var prefix = "(#" + seqno + ") ";
                const message = { seqno };

                msg.on("body", function (stream, info) {
                  var buffer = "",
                    count = 0;
                  stream.on("data", function (chunk) {
                    if (info.which === "TEXT") {
                      buffer += chunk.toString("utf8");
                      message.text = buffer;
                    }
                  });
                  stream.once("end", function () {});
                });

                msg.once("attributes", function (attrs) {
                  message.date = attrs.date;

                  // set all results to seen
                  let uid = attrs.uid;
                  imap.addFlags(uid, ["\\Seen"], function (err) {
                    if (err) {
                      console.log(err);
                    }
                  });
                });

                msg.once("end", function () {
                  messages.push(message);
                });

                msg.once("error", function (err) {
                  console.log("Message error: " + err);
                });
              });

              f.once("error", function (err) {
                console.log("Fetch error: " + err);
              });

              f.once("end", function () {
                console.log("fetched " + messages.length + " messages");
                console.log("Done fetching all messages!");
                imap.end();
                resolve(messages);
              });
            }
          );
        },
        // pass reject methode to imap connect
        reject
      );
    }),
};
