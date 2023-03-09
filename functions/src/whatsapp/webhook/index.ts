import { Router } from 'express';
import { logger } from 'firebase-functions';
import { Timestamp } from 'firebase-admin/firestore'
import config from '../../config';
import { Invitation, Recipient } from '../../models';
import { db } from '../../services';
import { sendMessage } from '../lib';
import createMessage from '../message-templates';
import { isMessage, isNotification } from './interfaces';

const router = Router();

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
      await Promise.all(req.body.entry.map((entry) => Promise.all(entry
        .changes.map((change) => {
          if (change.value.messages) {
            return Promise.all(change.value
              .messages.map(async (message) => {
                try {
                  if (isMessage('button', message)) {
                    switch (message.button.payload) {
                      case 'Buka undangan':
                        const recipientsQuery = db.collection(`${config.firebase.namespace}recipients`)
                          .where('phoneNumber', '==', message.from)
                          .limit(1);
                        const recipientSnapshot = await recipientsQuery.get();
                        const [recipientDoc] = recipientSnapshot.docs;

                        if (recipientDoc) {
                          const messagesPool = recipientDoc.ref.collection('messages')
                            .where(message.context.id.replace('wamid.', ''), '!=', null)
                            .limit(1);

                          const messagesPoolSnapshot = await messagesPool.get();
                          const [messagesPoolDoc] = messagesPoolSnapshot.docs;

                          logger.debug(messagesPoolSnapshot.docs);

                          if (messagesPoolDoc) {
                            const invitationId = messagesPoolDoc.data()[message.context.id.replace('wamid.', '')];
                            const invitationSnap = await db.doc(`${config.firebase.namespace}invitations/${invitationId}`).get();

                            if (invitationSnap.exists) {
                              const recipient = recipientDoc.data() as Recipient;
                              const invitation = invitationSnap.data() as Invitation;

                              return sendMessage(message.from, createMessage.invitation({
                                recipientName: recipient.title,
                                eventTitle: invitation.eventTitle,
                                eventDatetime: (invitation.datetime as unknown as Timestamp).toDate(),
                                eventLocation: invitation.location,
                                organizer: invitation.organizer,
                                organizerName: invitation.organizerName,
                              }));
                            }

                            logger.debug('invitationId:\t', invitationId);
                          }

                          throw new Error('Invitation not found or recipient not invited');
                        }

                        throw new Error('Recipient not found');
                      default:
                        break;
                    }
                  }
                } catch (err) {
                  logger.error(err);
                  return sendMessage(message.from, String(err));
                }

                return Promise.resolve();
              }))
          }
          return Promise.resolve();
        }))
      ));
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

export default router;
