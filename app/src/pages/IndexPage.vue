<script lang="ts" setup>
import FormCreateInvitation from 'components/FormCreateInvitation.vue';
import RecipientSelector from 'src/components/RecipientSelector.vue';

</script>

<template>
  <q-page
    padding
    class="column"
  >
    <h2 class="text-h5 q-my-sm">
      Kirim Undangan
    </h2>

    <q-separator />

    <div class="q-mt-md row justify-evenly q-col-gutter-md">
      <div class="col-12 col-md">
        <q-card>
          <form-create-invitation title="Detail undangan" />
        </q-card>
      </div>

      <div class="col-12 col-md">
        <q-card>
          <q-card-section>
            <h6 class="q-my-none">
              Pilih penerima pesan
            </h6>
          </q-card-section>

          <q-card-section>
            <recipient-selector />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              label="Pilih"
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="q-pa-xl row justify-end">
      <q-btn
        label="Kirim pesan"
        size="lg"
        icon="send"
        color="accent"
      />
    </div>
  </q-page>
</template>
