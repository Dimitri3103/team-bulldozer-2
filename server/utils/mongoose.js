const mongoose = require('mongoose');

const { connection } = mongoose;

mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to mongodb !!');
  })
  .catch((error) => console.error(error.message))

connection.on('error', (error) => {
  console.log(error.message)
})

// disconnect the mongoose db connection before exit the process
process.on('SIGINT', async () => {
  await connection.close();
  process.exit(0);
});
