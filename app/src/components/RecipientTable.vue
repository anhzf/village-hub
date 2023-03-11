<script lang="ts" setup>
import { collection } from 'firebase/firestore';
import { QBtnProps, QTableColumn, QTableProps } from 'quasar';
import config from 'src/config';
import { Recipient } from 'src/models';
import { computed, ref, useSlots } from 'vue';
import { useCollection, useFirestore } from 'vuefire';

interface Props {
  secondaryBtn?: QBtnProps;
  hideCols?: string[];
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
  {
    name: 'phoneNumber',
    label: 'Nomor HP',
    field: 'phoneNumber',
    align: 'left',
    style: 'width: 16ch;',
    // Censor phone number
    format: (val: string) => val.replace(/(\d{3})\d{6}(\d{4})/, '$1******$2'),
  },
  {
    name: 'labels',
    label: 'Label',
    field: 'labels',
    align: 'center',
  },
  {
    name: 'actions',
    label: 'Aksi',
    field: 'id',
    align: 'right',
  },
];

const props = withDefaults(defineProps<Props>(), {
  secondaryBtn: undefined,
  hideCols: () => ['phoneNumber'],
});
defineEmits<Emits>();
const slots = useSlots();

const db = useFirestore();

const COLLECTION_REF = collection(db, `${config.firebase.namespace}recipients`);

const { data: recipients } = useCollection<Recipient>(COLLECTION_REF);

const cols = recipientCols.filter((el) => {
  if (el.name === 'actions') {
    return !!slots['row-actions'];
  }

  return !props.hideCols.includes(el.name);
});
const filter = ref('');
const selected = ref<Recipient[]>([]);

const availableLabel = computed(() => [...new Set(recipients.value.flatMap((el) => el.labels))]);
const selectedLabel = computed(() => [...new Set(selected.value.flatMap((el) => el.labels))]);

const toggleSelectedRow = (row: Recipient) => {
  selected.value = selected.value.some((el) => el.id === row.id)
    ? selected.value.filter((el) => el.id !== row.id)
    : [...selected.value, row];
};

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

const onRowClick: QTableProps['onRowClick'] = (evt, row) => {
  toggleSelectedRow(row);
};
</script>

<template>
  <q-table
    v-model:selected="selected"
    :columns="cols"
    :rows="recipients"
    row-key="id"
    selection="multiple"
    :filter="filter"
    flat
    @row-click="onRowClick"
  >
    <template #top>
      <div class="full-width row q-gutter-md">
        <div class="col-shrink column">
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

        <q-space />

        <slot name="top-actions" />
      </div>
    </template>

    <template #body-cell-labels="scopedProps">
      <q-td :props="scopedProps">
        <div class="row q-gutter-xs">
          <q-badge
            v-for="label in scopedProps.value"
            :key="label"
            :label="label"
          />
        </div>
      </q-td>
    </template>

    <template #body-cell-actions="scopedProps">
      <q-td :props="scopedProps">
        <slot
          name="row-actions"
          v-bind="scopedProps"
        />
      </q-td>
    </template>

    <template #bottom>
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

      <!-- <q-btn
        v-if="secondaryBtn"
        flat
        v-bind="secondaryBtn"
      />

      <q-space />

      <q-btn
        label="Pilih"
        color="primary"
        @click="$emit('select', selected)"
      /> -->
    </template>
  </q-table>
</template>
