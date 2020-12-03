module.exports = {
  apps: [
    {
      name: "myapp",
      script: "./app.js",
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: "development",
        AWS_ACCESS_KEY_ID: "AKIAS3QEH24BSTHPT4VY",
        AWS_SECRET_ACCESS_KEY: "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",
      },
      env_production: {
        PORT: 80,
        NODE_ENV: "production",
        AWS_ACCESS_KEY_ID: "AKIAS3QEH24BSTHPT4VY",
        AWS_SECRET_ACCESS_KEY: "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",
      },
    },
  ],
};
