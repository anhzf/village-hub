import { initializeApp } from 'firebase/app';
import config from 'src/config';

const firebaseApp = initializeApp(config.firebase.config);

export default firebaseApp;
