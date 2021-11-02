const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});
process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});
console.log('runnig');
const app = require('./app');
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {});
