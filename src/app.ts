import express from 'express';
import connectDb from '../config/database';
import {json}  from 'body-parser';
import morgan from 'morgan';
import cors from "cors";
import rateLimit from 'express-rate-limit';
import userRouterController from './routers/userRouterController';
import '../src/controllers/redisController';
const bodyParser = require("body-parser");




const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // limit each IP to 200 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: function (req, res, /*next*/) {
        return res.status(429).json({
          error: 'You sent too many requests. Please wait a while then try again'
        })
    }
  });



const corsOptions = {
    origin: "*",
  };

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use( apiRequestLimiter);
app.use('/api', userRouterController);

connectDb();


const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send(' Talent Server up and running...!');
});




app.listen(port, () => {
  return console.log(`Talent Server is listening at POST ---> :${port}`);
});