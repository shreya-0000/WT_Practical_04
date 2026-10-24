// server.js - entry point
const http = require('http');
const { handleRequest } = require('./routes');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = server;
