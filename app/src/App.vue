<!-- <script lang="ts" setup>
import * as fs from 'firebase/firestore';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { emulators } from 'src/../../firebase.json';

const db = useFirestore();
globalThis.$db = db;
globalThis.$fs = fs;

connectFirestoreEmulator(db, 'localhost', emulators.firestore.port);
</script> -->

<template>
  <router-view />
</template>
