import axios from 'axios';
import config from '../config';
import { API_VERSION } from './webhook/constants';
import { MessageTemplateComponent, SendMessageResponse } from './webhook/interfaces';

const ENDPOINT = `https://graph.facebook.com/${API_VERSION}/${config.whatsappCloudApi.phoneNumberId}/messages?access_token=${config.whatsappCloudApi.accesToken}`

export const sendMessage = async (to: string, body: string) => axios
  .post(ENDPOINT, {
    messaging_product: 'whatsapp',
    to,
    text: { body },
  })

export const sendTemplate = async (to: string, templateName: string, components: MessageTemplateComponent[]) => axios
  .post<SendMessageResponse>(ENDPOINT, {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: 'ID',
      },
      components,
    }
  })