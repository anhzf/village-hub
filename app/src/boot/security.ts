import DialogSignIn from 'components/DialogSignIn.vue';
import { Dialog, Loading, Notify } from 'quasar';
import { boot } from 'quasar/wrappers';
import { watch } from 'vue';
import { getCurrentUser, useCurrentUser } from 'vuefire';

export default boot(async () => {
  Loading.show();

  try {
    await getCurrentUser();
  } catch (error) {
    Notify.create({
      message: String(error),
      color: 'negative',
    });
  } finally {
    Loading.hide();

    const user = useCurrentUser();

    // If no user is logged in, show login dialog
    watch(() => !user.value, (isGuest) => {
      if (!isGuest) return;

      Dialog.create({ component: DialogSignIn });
    }, { immediate: true });
  }
});
