<script setup lang="ts">
import { signOut } from 'firebase/auth';
import {
  Dialog, Loading, Notify, QItemProps,
} from 'quasar';
import DialogSignIn from 'src/components/DialogSignIn.vue';
import { ref } from 'vue';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';

interface Menu extends QItemProps {
  title?: string;
  icon?: string;
  caption?: string;
}

const auth = useFirebaseAuth();
const user = useCurrentUser();

const menus: Menu[] = [
  {
    title: 'Buat undangan',
    icon: 'forward_to_inbox',
    to: '/',
  },
  {
    title: 'Kelola penerima pesan',
    icon: 'groups',
    to: '/recipients',
  },
];

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const onSignInClick = () => {
  Dialog.create({
    component: DialogSignIn,
  });
};

const onUserClick = async () => {
  Loading.show();
  try {
    if (auth) {
      await signOut(auth);
    } else {
      throw new Error('No Auth instance');
    }
  } catch (err) {
    Notify.create({
      message: String(err),
      color: 'negative',
    });
  } finally {
    Loading.hide();
  }
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Village Hub
        </q-toolbar-title>

        <q-space />

        <q-btn
          v-if="user"
          :label="user.displayName || user.email || 'User'"
          icon="account_circle"
          flat
          @click="onUserClick"
        />

        <q-btn
          v-else
          label="Masuk"
          flat
          @click="onSignInClick"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Menu
        </q-item-label>

        <q-item
          v-for="menu in menus"
          :key="menu.title"
          v-bind="menu"
        >
          <q-item-section
            v-if="menu.icon"
            avatar
          >
            <q-icon :name="menu.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ menu.title }}</q-item-label>
            <q-item-label caption>
              {{ menu.caption }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
