import axios from 'axios';
import { Router } from 'express';
import { logger } from 'firebase-functions';
import config from '../../config';
import createMessage from '../message-templates';
import { API_VERSION } from './constants';
import { isMessage, isNotification } from './interfaces';

const router = Router();

const sendMessage = async (to: string, body: string) => axios
  .post(`https://graph.facebook.com/${API_VERSION}/${config.whatsappCloudApi.phoneNumberId}/messages?access_token=${config.whatsappCloudApi.accesToken}`, {
    messaging_product: 'whatsapp',
    to,
    text: { body },
  })


router.get('/', (req, res) => {
  const { ['hub.mode']: mode, ['hub.challenge']: challenge, ['hub.verify_token']: token } = req.query;

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === config.whatsappCloudApi.verifyToken) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }

  res.sendStatus(404);
});

router.post('/', async (req, res) => {
  if (isNotification(req.body)) {
    logger.debug(req.body);

    if (Array.isArray(req.body.entry)) {
      await Promise.all(req.body.entry.map((entry) => {
        return Promise.all(entry.changes.map((change) => {
          if (change.value.messages) {
            return Promise.all(change.value.messages.map((message) => {
              if (isMessage('button', message)) {
                switch (message.payload) {
                  case 'Buka undangan':
                    return sendMessage(message.from, createMessage.invitation({
                      recipientName: change.value.contacts[0].profile.name,
                      eventTitle: 'Percobaan Giriroto Hub',
                      eventDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                      eventLocation: 'WhatsApp masing-masing',
                      organizer: 'KKN UNS 26 tahun 2023',
                      organizerName: 'Alwan Nuha Zaky Fadhila'
                    }));
                  default:
                    break;
                }
              }
              return Promise.resolve();
            }))
          }
          return Promise.resolve();
        }))
      }));

      // req.body.entry.forEach((entry) => {
      //   entry.changes.forEach((change) => {
      //     if (change.value.messages) {
      //       change.value.messages.forEach((message) => {
      //         if (isMessage('button', message)) {
      //           switch (message.payload) {
      //             case 'Buka undangan':
      //               sendMessage(message.from, createMessage.invitation({
      //                 recipientName: change.value.contacts[0].profile.name,
      //                 eventTitle: 'Percobaan Giriroto Hub',
      //                 eventDatetime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      //                 eventLocation: 'WhatsApp masing-masing',
      //                 organizer: 'KKN UNS 26 tahun 2023',
      //                 organizerName: 'Alwan Nuha Zaky Fadhila'
      //               }));
      //               break;

      //             default:
      //               break;
      //           }
      //         }
      //       });
      //     }
      //   });
      // });
    }

    res.sendStatus(200);
    res.end();
  }

  res.sendStatus(404);
  res.end();
});

export default router;
