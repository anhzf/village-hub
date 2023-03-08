import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import config from '../config';
import { InvitationMessage, InvitationMessages, Recipient } from '../models';
import { sendTemplate } from '../whatsapp/lib';

export const onInvitationCreated = functions.firestore.document(`${config.firebase.namespace}invitations/{invitationId}/messages/{messageId}`)
  .onCreate(async (snap) => {
    const db = getFirestore();

    db.settings({ ignoreUndefinedProperties: true });

    const data = snap.data() as InvitationMessages;
    const sendMessageResult: Record<string, Omit<InvitationMessage, 'recipientId'>> = {}

    // Send message via Cloud API and store the summary to the database
    await Promise.all(data.messages.map(async (message) => {
      const recipientSnap = await db.doc(`${config.firebase.namespace}recipients/${message.recipientId}`).get()
      const recipient = recipientSnap.data() as Recipient;

      try {
        const res = await sendTemplate(recipient.phoneNumber, 'grt__invitation', [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: recipient.title,
              },
              {
                type: 'text',
                text: 'tempat',
              },
            ]
          }
        ]);

        const { data: { messages: [{ id: messageId }] } } = res;

        sendMessageResult[recipientSnap.id] = { messageId, status: 'SENT' };
      } catch (err) {
        sendMessageResult[recipientSnap.id] = { status: 'FAILED' };
      }
    }));


    await snap.ref.update({
      messages: data.messages.map((message) => ({
        ...message,
        messageId: sendMessageResult[message.recipientId]?.messageId || null,
        status: sendMessageResult[message.recipientId]?.status || null,
      }))
    })

    return true;
  })
