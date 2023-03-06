<script lang="ts" setup>
import { useCurrentUser } from 'vuefire';
import useInvitationRepository from 'src/composables/invitations';
import { computed } from 'vue';
import { QTableColumn } from 'quasar';
import { Invitation } from 'src/models';
import { Timestamp } from 'firebase/firestore';

const COLUMNS: QTableColumn<Invitation>[] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true,
  },
  {
    name: 'eventTitle',
    label: 'Judul acara',
    field: 'eventTitle',
    align: 'left',
    sortable: true,
  },
  {
    name: 'datetime',
    label: 'Tanggal dan waktu',
    field: 'datetime',
    align: 'left',
    sortable: true,
    format: (v: Timestamp) => v.toDate().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  },
  {
    name: 'location',
    label: 'Lokasi',
    field: 'location',
    align: 'left',
    sortable: true,
  },
  {
    name: 'organizer',
    label: 'Penyelenggara',
    field: 'organizer',
    align: 'left',
    sortable: true,
  },
  {
    name: 'organizerName',
    label: 'Nama penyelenggara',
    field: 'organizerName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: 'Dibuat pada',
    field: 'createdAt',
    align: 'left',
    sortable: true,
    format: (v: Timestamp) => v.toDate().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  },
];

const user = useCurrentUser();
const InvitationRepo = useInvitationRepository();
const data = InvitationRepo.list();
</script>

<template>
  <q-page
    padding
    class="column"
  >
    <div class="row q-my-sm items-center">
      <h2 class="text-h5">
        Undangan
      </h2>

      <q-space />

      <q-btn
        v-if="user"
        label="Buat undangan"
        to="/invitations/create"
        color="primary"
        class="q-ml-sm"
      />
    </div>

    <q-table
      :rows="data"
      :columns="COLUMNS"
      @row-click="(ev, row) => $router.push({ name: 'invitation', params: { invitationId: row.id } })"
    />
  </q-page>
</template>
