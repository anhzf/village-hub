import { Router } from 'express';
import { isNotification } from './interfaces';

const router = Router();

router.get('/', (req, res) => {
  const WEBHOOK_VERIFY_TOKEN = 'ini-token-ingaattt';

  const { ['hub.mode']: mode, ['hub.challenge']: challenge, ['hub.verify_token']: token } = req.query;

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

router.post('/', (req, res) => {
  if (isNotification(req.body)) {
    if (Array.isArray(req.body.entry)) {
      req.body.entry.forEach((entry) => {
        // if (Array.isArray(entry.messaging)) {
        //   entry.messaging.forEach((messaging) => {
        //     if (messaging.message) {
        //       console.log(messaging.message);
        //     }
        //   });
        // }
      });
    }
  }

  res.sendStatus(404);
});

export default router;
