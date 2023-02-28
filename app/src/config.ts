import { FirebaseOptions } from 'firebase/app';

const config = Object.freeze({
  publicUrl: process.env.PUBLIC_URL || window.location.origin,
  firebase: {
    config: process.env.FIREBASE_CONFIG as FirebaseOptions,
    // useEmulator: process.env.FIREBASE_EMULATOR,
    // emulatorHost: 'localhost',
    // emulatorPort: {
    //   firestore: firebaseJson.emulators.firestore.port,
    //   auth: firebaseJson.emulators.auth.port,
    //   functions: firebaseJson.emulators.functions.port,
    //   storage: firebaseJson.emulators.storage.port,
    // },
  },
});

export default config;
