<script lang="ts" setup>
import { QTableColumn, uid } from 'quasar';
import { computed, ref } from 'vue';

interface Recipient {
  id: string;
  title: string;
  phoneNumber: string;
  labels: string[];
}

const recipientCols: QTableColumn<Recipient>[] = [
  {
    name: 'title',
    label: 'Nama',
    field: 'title',
    align: 'left',
    style: 'width: 25%; min-width: 20ch;',
  },
  {
    name: 'phoneNumber',
    label: 'Nomor HP',
    field: 'phoneNumber',
    align: 'left',
    style: 'width: 16ch;',
  },
  {
    name: 'labels',
    label: 'Label',
    field: 'labels',
    align: 'center',
  },
];

const recipients = ref<Recipient[]>(Array.from({ length: 100 }, (el, i) => ({
  id: uid(),
  title: `Sdr. ${i}`,
  phoneNumber: '62851*****243',
  labels: ['RT 03', 'RW 04'].filter(() => Math.random() > 0.5),
})));

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
  <div>
    <q-table
      v-model:selected="selected"
      :columns="recipientCols"
      :rows="recipients"
      row-key="id"
      selection="multiple"
      :filter="filter"
      flat
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
  </div>
</template>
