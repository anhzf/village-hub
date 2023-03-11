<script lang="ts" setup>
import { required } from 'src/utils/input-rules';
import { computed, ref } from 'vue';
import { syncRefs } from '@vueuse/core';
import { useDocument, useFirestore } from 'vuefire';
import { collection, doc } from 'firebase/firestore';
import config from 'src/config';
import { Recipient } from 'src/models';

export interface Field {
  title: string;
  phoneNumber: string;
  labels: string[];
}

export interface Props {
  title?: string;
  entityId?: string;
  loading?: boolean;
}

export interface Emits {
  (event: 'submit', payload: Field): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Kontak',
  entityId: undefined,
});
const emit = defineEmits<Emits>();
const db = useFirestore();

const _source = useDocument<Recipient>(props.entityId
  ? doc(db, `${config.firebase.namespace}recipients`, props.entityId)
  : doc(collection(db, `${config.firebase.namespace}recipients`)));
const source = computed(() => _source.value ?? {});
const field = ref<Field>({
  title: '',
  phoneNumber: '',
  labels: [],
});
syncRefs(source, field);

const display = computed(() => ({
  title: props.entityId === '' ? 'Tambah kontak' : `Perbarui kontak ${_source.value?.title}`,
}));

const onSubmit = () => {
  emit('submit', field.value);
};
</script>

<template>
  <q-card>
    <q-form @submit="onSubmit">
      <q-card-section>
        <h6 class="q-my-none">
          {{ display.title }}
        </h6>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="field.title"
          label="Nama"
          name="Name"
          :rules="[required('Nama')]"
        />
        <q-input
          v-model="field.phoneNumber"
          label="Nomor WhatsApp"
          type="tel"
          name="whatsappNumber"
          :rules="[required('Nomor WhatsApp')]"
          hint="Gunakan format internasional, Contoh: 6281234567890"
        />
        <q-select
          v-model="field.labels"
          label="Label"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add-unique"
          hint="Tekan enter untuk menambahkan label"
        />
      </q-card-section>

      <q-card-actions>
        <q-space />
        <q-btn
          v-close-popup
          label="Batalkan"
          flat
        />
        <q-btn
          v-close-popup
          label="Simpan"
          type="submit"
          color="primary"
          text-color="white"
        />
      </q-card-actions>
    </q-form>

    <q-inner-loading :showing="loading" />
  </q-card>
</template>
