<script lang="ts" setup>
import { required } from 'src/utils/input-rules';
import { reactive } from 'vue';

export interface Field {
  eventTitle: string;
  datetime: string;
  place: string;
  organizer: string;
  organizerName: string;
}

export interface SubmittedField extends Omit<Field, 'datetime'> {
  datetime: Date;
}

export interface Props {
  title?: string;
}

export interface Emits {
  (event: 'submit', payload: SubmittedField): void;
}

const emit = defineEmits<Emits>();
withDefaults(defineProps<Props>(), {
  title: 'Buat undangan',
});

const field = reactive<Field>({
  eventTitle: '',
  datetime: '',
  place: '',
  organizer: '',
  organizerName: '',
});

const onSubmit = () => {
  emit('submit', {
    ...field,
    datetime: new Date(field.datetime),
  });
};
</script>

<template>
  <q-form @submit="onSubmit">
    <q-card-section>
      <h6 class="q-my-none">
        {{ title }}
      </h6>
    </q-card-section>

    <q-card-section>
      <q-input
        v-model="field.eventTitle"
        label="Nama kegiatan/keperluan"
        :rules="[required()]"
      />

      <p class="text-subtitle1 text-blue-grey-6 q-mb-xs">
        Tanggal dan Waktu
      </p>

      <div class="row no-wrap justify-evenly q-gutter-md q-mb-md">
        <q-date
          v-model="field.datetime"
          mask="YYYY-MM-DD HH:mm"
          flat
          bordered
          :rules="[required()]"
        />
        <q-time
          v-model="field.datetime"
          mask="YYYY-MM-DD HH:mm"
          format24h
          flat
          bordered
          :rules="[required()]"
        />
      </div>

      <q-input
        v-model="field.place"
        label="Tempat"
        :rules="[required()]"
      />

      <q-input
        v-model="field.organizer"
        label="Instansi Penyelenggara"
        :rules="[required()]"
      />

      <q-input
        v-model="field.organizerName"
        label="Nama penyelenggara"
        :rules="[required()]"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        label="Selanjutnya"
        color="primary"
      />
    </q-card-actions>
  </q-form>
</template>
