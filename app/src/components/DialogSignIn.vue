<script lang="ts" setup>
import { Notify, useDialogPluginComponent } from 'quasar';
import FormSignIn, { Field as SignInFormField } from 'components/FormSignIn.vue';
import { reactive } from 'vue';
import { useFirebaseAuth } from 'vuefire';
import { signInWithEmailAndPassword } from 'firebase/auth';

defineEmits(useDialogPluginComponent.emits);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const auth = useFirebaseAuth();
const _ui = reactive({
  isLoading: false,
});

const onFormSubmit = async (payload: SignInFormField) => {
  _ui.isLoading = true;
  try {
    if (auth) {
      await signInWithEmailAndPassword(auth, payload.email, payload.password);
    } else {
      throw new Error('No Auth instance');
    }

    onDialogOK();
  } catch (err) {
    Notify.create({
      message: String(err),
      color: 'negative',
    });
  } finally {
    _ui.isLoading = false;
  }
};
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <form-sign-in @submit="onFormSubmit" />
      <q-inner-loading :showing="_ui.isLoading" />
    </q-card>
  </q-dialog>
</template>
