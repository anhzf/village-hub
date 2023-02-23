import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';
import Webhook from './webhook';

const app = express()

app.use(cors({ origin: true }));
app.use(express.json());
app.use('/webhook', Webhook);

export default functions.https.onRequest(app);