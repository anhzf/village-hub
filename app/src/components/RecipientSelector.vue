<script lang="ts" setup>
import { collection } from 'firebase/firestore';
import { QBtnProps, QTableColumn } from 'quasar';
import config from 'src/config';
import { Recipient } from 'src/models';
import { computed, ref } from 'vue';
import { useCollection, useFirestore } from 'vuefire';

interface Props {
  secondaryBtn?: QBtnProps;
}

interface Emits {
  (e: 'select', v: Recipient[]): void;
}

const recipientCols: QTableColumn<Recipient>[] = [
  {
    name: 'title',
    label: 'Nama',
    field: 'title',
    align: 'left',
    style: 'width: 25%; min-width: 20ch;',
  },
  // {
  //   name: 'phoneNumber',
  //   label: 'Nomor HP',
  //   field: 'phoneNumber',
  //   align: 'left',
  //   style: 'width: 16ch;',
  // },
  {
    name: 'labels',
    label: 'Label',
    field: 'labels',
    align: 'center',
  },
];

defineEmits<Emits>();
defineProps<Props>();

const db = useFirestore();

const COLLECTION_REF = collection(db, `${config.firebase.namespace}recipients`);

const { data: recipients } = useCollection<Recipient>(COLLECTION_REF);

const filter = ref('');
const selected = ref<Recipient[]>([]);

const availableLabel = computed(() => [...new Set(recipients.value.flatMap((el) => el.labels))]);
const selectedLabel = computed(() => [...new Set(selected.value.flatMap((el) => el.labels))]);

const toggleAll = (v?: boolean) => {
  if (v === undefined) {
    selected.value = selected.value.length === recipients.value.length
      ? []
      : recipients.value;
  } else if (v) {
    selected.value = recipients.value;
  } else {
    selected.value = [];
  }
};

const toggleRecipientByLabel = (label: string, v?: boolean) => {
  if (v === undefined) {
    selected.value = selected.value.some((el) => el.labels.includes(label))
      ? selected.value.filter((el) => !el.labels.includes(label))
      : [...selected.value, ...recipients.value.filter((el) => el.labels.includes(label))];
  } else if (v) {
    selected.value.push(...recipients.value.filter((el) => el.labels.includes(label)));
  } else {
    selected.value = selected.value.filter((el) => !el.labels.includes(label));
  }
};
</script>

<template>
  <q-card>
    <q-card-section>
      <h6 class="q-my-none">
        Pilih penerima pesan
      </h6>
    </q-card-section>

    <q-card-section>
      <q-table
        v-model:selected="selected"
        :columns="recipientCols"
        :rows="recipients"
        row-key="id"
        selection="multiple"
        :filter="filter"
        flat
        @row-click="(evt, row) => selected.push(row)"
      >
        <template #top>
          <div class="column">
            <q-input
              v-model="filter"
              label="Cari"
              dense
              style="width: 35ch;"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>

            <div class="q-mt-sm row items-center">
              <span>Pilih: </span>
              <q-checkbox
                :model-value="selected.length === recipients.length"
                label="Semua"
                @update:model-value="toggleAll"
              />

              <q-checkbox
                v-for="label in availableLabel"
                :key="label"
                :model-value="selectedLabel.includes(label)"
                :label="label"
                @update:model-value="toggleRecipientByLabel(label)"
              />
            </div>
          </div>
        </template>

        <template #body-cell-labels="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <q-badge
                v-for="label in props.value"
                :key="label"
                :label="label"
              />
            </div>
          </q-td>
        </template>
      </q-table>

      <div class="column q-gutter-sm">
        <span class="text-caption">
          Label terpilih
        </span>

        <div class="row">
          <template v-if="selectedLabel.length">
            <q-chip
              v-for="el in selectedLabel"
              :key="el"
              :label="el"
            />
          </template>

          <p v-else>
            -
          </p>
        </div>
      </div>
    </q-card-section>

    <q-card-actions>
      <q-btn
        v-if="secondaryBtn"
        flat
        v-bind="secondaryBtn"
      />

      <q-space />

      <q-btn
        label="Pilih"
        color="primary"
        @click="$emit('select', selected)"
      />
    </q-card-actions>
  </q-card>
</template>
