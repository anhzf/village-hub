import {
  addDoc, collection as $collection, doc, Timestamp, updateDoc,
} from 'firebase/firestore';
import config from 'src/config';
import { Model, Recipient, Timestamped } from 'src/models';
import { useFirestore } from 'vuefire';

const useRecipientInvitation = () => {
  const db = useFirestore();
  const collection = $collection(db, `${config.firebase.namespace}recipients`);

  const create = async (data: Omit<Recipient, keyof Model | keyof Timestamped>) => {
    const docRef = await addDoc(collection, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  };

  const update = async (id: string, details: Omit<Recipient, keyof Model | keyof Timestamped>) => {
    await updateDoc(doc(collection, id), {
      ...details,
      updatedAt: Timestamp.now(),
    });

    return id;
  };

  return {
    create,
    update,
  };
};

export default useRecipientInvitation;
