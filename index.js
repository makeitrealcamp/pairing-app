const nodemon = require('nodemon');
const path = require('path');

nodemon({
  script: path.join(__dirname, 'server/server'),
  watch: process.env.NODE_ENV !== 'production' ? ['server/*'] : false
})
.on('restart', () => console.log('Server restarted!'))
.once('exit', () => {
  console.log('Shutting down server');
  process.exit();
});
