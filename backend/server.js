/*const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
  path: path.resolve('config.env'),
});*/

console.log(process.env);
process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});
console.log('runnig');
const { defaultConfiguration } = require('./app');
const app = require('./app');
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {});
