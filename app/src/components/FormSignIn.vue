<script lang="ts" setup>
import { reactive } from 'vue';

export interface Field {
  email: string;
  password: string;
}

export interface Emits {
  (event: 'submit', payload: Field): void;
}

defineEmits<Emits>();

const field = reactive<Field>({
  email: '',
  password: '',
});
</script>

<template>
  <q-form @submit="$emit('submit', field)">
    <q-card-section>
      <h6 class="q-my-none">
        Masuk
      </h6>
    </q-card-section>

    <q-card-section>
      <q-input
        v-model="field.email"
        type="email"
        hint=""
        autofocus
      />
      <q-input
        v-model="field.password"
        type="password"
        hint=""
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        label="Masuk"
        type="submit"
        color="primary"
      />
    </q-card-actions>
  </q-form>
</template>
