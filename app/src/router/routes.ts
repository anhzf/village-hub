import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/invitations',
      },
      {
        path: 'invitations',
        component: () => import('pages/InvitationsPage.vue'),
      },
      {
        path: 'invitations/create',
        component: () => import('pages/CreateInvitationPage.vue'),
      },
      {
        path: 'invitations/:invitationId',
        name: 'invitation',
        component: () => import('pages/InvitationPage.vue'),
      },
      {
        path: 'recipients',
        component: () => import('pages/ManageRecipientsPage.vue'),
      },
      {
        path: 'privacy-policy',
        component: () => import('pages/PrivacyPolicyPage.vue'),
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
