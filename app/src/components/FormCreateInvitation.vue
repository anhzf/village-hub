<script lang="ts" setup>
import { QBtnProps } from 'quasar';
import { required } from 'src/utils/input-rules';
import { reactive } from 'vue';

export interface Field {
  eventTitle: string;
  datetime: string;
  location: string;
  organizer: string;
  organizerName: string;
}

export interface SubmittedField extends Omit<Field, 'datetime'> {
  datetime: Date;
}

export interface Props {
  title?: string;
  submitBtn?: string | QBtnProps;
}

export interface Emits {
  (event: 'submit', payload: SubmittedField): void;
}

const emit = defineEmits<Emits>();
withDefaults(defineProps<Props>(), {
  title: 'Buat undangan',
  submitBtn: 'Kirim',
});

const field = reactive<Field>({
  eventTitle: '',
  datetime: '',
  location: '',
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
  <q-card>
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
          name="eventTitle"
          :rules="[required()]"
        />

        <q-input
          v-model="field.datetime"
          label="Tanggal dan Waktu (YYYY-MM-DD HH:mm)"
          name="datetime"
          :rules="[required()]"
          readonly
        >
          <template #append>
            <q-btn
              icon="event"
              round
              flat
            >
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="field.datetime"
                  mask="YYYY-MM-DD HH:mm"
                >
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      label="Tetapkan"
                      color="primary"
                      flat
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>

            <q-btn
              icon="access_time"
              round
              flat
            >
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="field.datetime"
                  mask="YYYY-MM-DD HH:mm"
                  format24h
                >
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      label="Tetapkan"
                      color="primary"
                      flat
                    />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-btn>
          </template>
        </q-input>

        <q-input
          v-model="field.location"
          label="Tempat"
          name="location"
          :rules="[required()]"
        />

        <q-input
          v-model="field.organizer"
          label="Instansi Penyelenggara"
          name="organizer"
          :rules="[required()]"
        />

        <q-input
          v-model="field.organizerName"
          label="Nama penyelenggara"
          name="organizerName"
          :rules="[required()]"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          :label="typeof submitBtn === 'string' ? submitBtn : submitBtn.label"
          type="submit"
          color="primary"
          v-bind="typeof submitBtn === 'string' ? {} : submitBtn"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>
