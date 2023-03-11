<script lang="ts" setup>
import FormEditRecipient, { Field as FormEditRecipientField } from 'components/FormEditRecipient.vue';
import RecipientTable from 'components/RecipientTable.vue';
import { Notify } from 'quasar';
import useRecipientsRepo from 'src/composables/recipients';
import { computed, reactive, ref } from 'vue';

const { create, update } = useRecipientsRepo();
const editDialogEntityId = ref<string|null>(null);
const showEditDialog = computed({
  get: () => editDialogEntityId.value !== null,
  set: (value) => {
    editDialogEntityId.value = value ? '' : null;
  },
});
const _ui = reactive({
  editDialogLoading: false,
});

const onRowEditClick = (id: string) => {
  editDialogEntityId.value = id;
};

const onAddClick = () => {
  editDialogEntityId.value = '';
};

const onFormEditRecipientSubmit = async (field: FormEditRecipientField) => {
  _ui.editDialogLoading = true;
  try {
    if (editDialogEntityId.value === '') {
      await create(field);
    } else if (editDialogEntityId.value !== null) {
      await update(editDialogEntityId.value, field);
    }
  } catch (err) {
    Notify.create({
      message: String(err),
      color: 'negative',
    });
  } finally {
    _ui.editDialogLoading = false;
  }
};
</script>

<template>
  <q-page padding>
    <recipient-table :hide-cols="[]">
      <template #top-actions>
        <div class="row items-center">
          <q-btn
            label="Tambah"
            icon="add"
            color="secondary"
            @click.stop="onAddClick"
          />
        </div>
      </template>

      <template #row-actions="scopedProps">
        <q-btn
          icon="edit"
          flat
          round
          @click.stop="onRowEditClick(scopedProps.value)"
        />
      </template>
    </recipient-table>
  </q-page>

  <q-dialog
    v-model="showEditDialog"
    persistent
  >
    <form-edit-recipient
      :entity-id="editDialogEntityId === null ? undefined : editDialogEntityId"
      :loading="_ui.editDialogLoading"
      class="full-width max-w-screen-xs"
      @submit="onFormEditRecipientSubmit"
    />
  </q-dialog>
</template>
