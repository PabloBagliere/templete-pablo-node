import 'dotenv/config';

import fs from 'fs';
import https from 'https';

import Express from 'express';
import cors from 'cors';

import router from './routes/OBSweb';

const app = Express();

app.use(Express.json());

app.use(cors());

app.use('/', router);

// app.listen(process.env.PORT || 3000, () => {
//   console.log('hola mundo');
// });

https
  .createServer(
    {
      key: fs.readFileSync(__dirname + '/../192.168.0.112-key.pem'),
      cert: fs.readFileSync(__dirname + '/../192.168.0.112.pem'),
    },
    app,
  )
  .listen(process.env.PORT || 3000, () => {
    console.log('hola mundo');
  });
