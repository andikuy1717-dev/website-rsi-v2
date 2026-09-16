const http = require("http");
const next = require("next");

const port = process.env.PORT || 3000;

const app = next({
  dev: false,
  hostname: "0.0.0.0",
  port,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`Next.js berjalan di port ${port}`);
  });
});