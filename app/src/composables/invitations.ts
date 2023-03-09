import {
  addDoc, collection as $collection, doc as $doc, Timestamp, writeBatch,
} from 'firebase/firestore';
import config from 'src/config';
import {
  Invitation, InvitationMessage, InvitationMessages, Model, Timestamped,
} from 'src/models';
import * as arr from 'src/utils/array';
import { useCollection, useDocument, useFirestore } from 'vuefire';

interface InvitationMessageMap extends InvitationMessage {
  recipientId: string;
}

const useInvitationRepository = () => {
  const db = useFirestore();
  const collection = $collection(db, `${config.firebase.namespace}invitations`);
  /**
   * @todo support more than 500 InvitationMessages
   */
  const _createInvitationMessages = async (invitationId: string, recipientIds: string[]) => {
    const messagesCollection = $collection(collection, invitationId, 'messages');
    const messages: InvitationMessageMap[] = recipientIds.map((recipientId) => ({
      recipientId,
    }));
    const messageChunks: InvitationMessages[] = arr.chunks(messages, 100)
      .map((_messages) => _messages.reduce((acc, message) => ({
        ...acc,
        [message.recipientId]: {},
      }), {}));

    const batch = writeBatch(db);
    messageChunks.forEach((messageChunk) => {
      batch.set($doc(messagesCollection), messageChunk);
    });

    await batch.commit();
  };

  const create = async (details: Omit<Invitation, keyof Model | keyof Timestamped>, recipientIds: string[]) => {
    const doc = await addDoc(collection, {
      ...details,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    await _createInvitationMessages(doc.id, recipientIds);

    return doc.id;
  };

  const list = () => useCollection(collection);

  const get = (id: string) => {
    const docRef = $doc(collection, id);
    const state = useDocument(docRef);
    const messagesRef = $collection(collection, id, 'messages');
    const useMessages = () => useCollection(messagesRef);

    return Object.assign(state, {
      useMessages,
    });
  };

  return {
    get,
    list,
    create,
    collection,
  };
};

export default useInvitationRepository;
