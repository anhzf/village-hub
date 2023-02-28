import { boot } from 'quasar/wrappers';
import firebaseApp from 'src/firebase';
import { VueFire, VueFireAuth } from 'vuefire';

export default boot(({ app }) => {
  app.use(VueFire, {
    firebaseApp,
    modules: [
      VueFireAuth(),
    ],
  });
});
