import * as functions from 'firebase-functions';
import { FieldValue } from 'firebase-admin/firestore'
import config from '../config';
import { InvitationMessages, Recipient } from '../models';
import { db } from '../services';
import { sendTemplate } from '../whatsapp/lib';

export const onInvitationCreated = functions.firestore.document(`${config.firebase.namespace}invitations/{invitationId}/messages/{messageId}`)
  .onCreate(async (snap) => {
    const invitationMessages = snap.data() as InvitationMessages;
    const sendMessageResult: InvitationMessages = {}

    // Send message via Cloud API and store the summary to the database
    await Promise.all(Object.keys(invitationMessages)
      .map(async (recipientId) => {
        const recipientSnap = await db.doc(`${config.firebase.namespace}recipients/${recipientId}`).get()
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

          sendMessageResult[recipientId] = { messageId, status: 'SENT' };
        } catch (err) {
          sendMessageResult[recipientId] = { status: 'FAILED' };
        }

        const messagesRef = recipientSnap.ref.collection('messages');
        const avalaibleMessagesPool = await messagesRef.where('_count', '<=', 100).limit(1).get();
        const messagesPool = avalaibleMessagesPool.docs[0]?.ref || messagesRef.doc();

        await messagesPool.set({
          _count: FieldValue.increment(1),
          [sendMessageResult[recipientId].messageId!.replace('wamid.', '')]: snap.ref.parent.parent?.id,
        }, { merge: true });
      }));


    await snap.ref.update({
      ...invitationMessages,
      ...sendMessageResult,
    })

    return true;
  })
