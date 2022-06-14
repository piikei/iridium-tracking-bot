const Imap = require("imap");

var imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PW,
  host: process.env.IMAP_SERVER,
  port: 993,
  tls: true,
  tlsOptions: {
    secureProcess: "TLS_method",
  },
  authTimeout: 3000,
  connTimeout: 20000
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
