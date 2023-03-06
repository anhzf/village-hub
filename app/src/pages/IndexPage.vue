<script lang="ts" setup>
import { useCurrentUser } from 'vuefire';

const user = useCurrentUser();
</script>

<template>
  <q-page
    padding
    class="column"
  >
    {{ user?.displayName || user?.email }}
  </q-page>
</template>
