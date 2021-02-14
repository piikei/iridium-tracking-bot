import Imap from "imap";

var imap = new Imap({
  user: "syjollity@gmail.com",
  password: process.env.JOLLITY_GMAIL_PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: {
    secureProcess: "TLS_method",
  },
  authTimeout: 3000,
});

module.exports = {
  connect: (query, reject) => {
    imap.once("ready", function () {
      console.log("imap ready");
      imap.openBox("INBOX", false, query(imap));
    });

    imap.once("error", function (err) {
      console.log("imap error:", err);
      reject({ err: "imap connection faild" });
    });

    imap.once("end", function () {
      console.log("imap connection ended");
    });

    imap.connect();
  },
};
