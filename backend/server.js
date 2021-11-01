/*const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});*/
process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});

const app = require('./app');
const port = process.env.PORT || 8000;

app.listen(port, () => {});
