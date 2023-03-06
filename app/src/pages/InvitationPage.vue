<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import useInvitationRepository from 'src/composables/invitations';
import { useDocument } from 'vuefire';
import { doc } from 'firebase/firestore';

const route = useRoute();
const Invitation = useInvitationRepository();
const invitationId = computed(() => route.params.invitationId as string);
// const invitationRef = computed(() => doc(Invitation.collection, route.params.invitationId as string));
// const invitation = useDocument(invitationRef);
// const invitation = Invitation.get(invitationId.value);
const { data: invitation, useMessages } = Invitation.get(invitationId.value);
const messages = useMessages();

</script>

<template>
  <q-page
    padding
    class="column"
  >
    <pre>{{ invitation }}</pre>
    <pre>{{ messages }}</pre>
  </q-page>
</template>
