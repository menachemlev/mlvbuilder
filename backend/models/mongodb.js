const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE).then((con) => {});
module.exports = mongoose;
