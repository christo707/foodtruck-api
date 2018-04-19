import express from 'express';
import config from '../config';
import initializeDb from '../db';
import middleware from '../middleware';
import foodtruck from '../controller/foodtruck';
import account from '../controller/account';

let router = express();

// connect to db
initializeDb(db => {

  // internal middleware
  router.use(middleware({ config, db }));

  // api routes v1 (/v1)
  let r = express.Router();
  router.use('/', r);
  r.get('/', (req, res) => {
      res.send('API is UP');
  });
  router.use('/foodtruck', foodtruck({ config, db }));
  router.use('/account', account({ config, db }));
});

export default router;