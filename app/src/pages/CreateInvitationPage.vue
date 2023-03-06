<script lang="ts" setup>
import FormCreateInvitation, { SubmittedField as FormCreateInvitationSubmittedField } from 'components/FormCreateInvitation.vue';
import RecipientSelector from 'components/RecipientSelector.vue';
import { Loading, Notify } from 'quasar';
import { Recipient } from 'src/models';
import { ref } from 'vue';
import { useCurrentUser } from 'vuefire';
import useInvitationRepository from 'src/composables/invitations';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = useCurrentUser();
const Invitation = useInvitationRepository();
const step = ref('details');
const selected = ref<Recipient[]>([]);
const details = ref<FormCreateInvitationSubmittedField | null>(null);

const onSendMessageClick = async () => {
  Loading.show();

  try {
    const created = await Invitation.create({
      eventTitle: details.value!.eventTitle,
      datetime: details.value!.datetime,
      location: details.value!.location,
      organizer: details.value!.organizer,
      organizerName: details.value!.organizerName,
    }, selected.value.map((recipient) => recipient.id));

    await router.push({
      name: 'invitation',
      params: {
        invitationId: created,
      },
    });
  } catch (err) {
    Notify.create({
      message: String(err),
      color: 'negative',
    });
  } finally {
    Loading.hide();
  }
};
const onDetailsSubmit = (payload: FormCreateInvitationSubmittedField) => {
  details.value = payload;
  step.value = 'recipients';
};

const onRecipientSelect = (recipients: Recipient[]) => {
  selected.value = recipients;
  step.value = 'summary';
};
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

    <template v-if="user">
      <q-tab-panels
        v-model="step"
        keep-alive
        animated
      >
        <q-tab-panel name="details">
          <form-create-invitation
            title="Detail undangan"
            submit-btn="Selanjutnya"
            class="max-w-screen-xs q-mx-auto"
            @submit="onDetailsSubmit"
          />
        </q-tab-panel>

        <q-tab-panel name="recipients">
          <recipient-selector
            :secondary-btn="{
              label: 'Kembali',
              icon: 'arrow_back',
              onClick: () => { step = 'details'; },
            }"
            class="max-w-screen-sm q-mx-auto"
            @select="onRecipientSelect"
          />
        </q-tab-panel>

        <q-tab-panel name="summary">
          <q-card class="max-w-screen-xs q-mx-auto">
            <q-card-section>
              <h5 class="q-my-none">
                Ringkasan Undangan
              </h5>
            </q-card-section>

            <q-card-section>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Penerima
                    </q-item-label>
                    <q-item-label caption>
                      {{ selected.length }} orang
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Judul Acara
                    </q-item-label>
                    <q-item-label caption>
                      {{ details?.eventTitle }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Waktu
                    </q-item-label>
                    <q-item-label caption>
                      {{ details?.datetime.toLocaleString('id-ID') }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Lokasi
                    </q-item-label>
                    <q-item-label caption>
                      {{ details?.location }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Penyelenggara
                    </q-item-label>
                    <q-item-label caption>
                      {{ details?.organizerName }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-card-actions>
              <q-btn
                label="Kembali"
                icon="arrow_back"
                flat
                @click="step = 'recipients'"
              />

              <q-space />

              <q-btn
                label="Kirim"
                icon="send"
                color="primary"
                @click="onSendMessageClick"
              />
            </q-card-actions>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-page>
</template>
