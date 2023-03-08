import { initializeApp } from 'firebase-admin/app';
initializeApp()

import wa from './whatsapp';
import * as triggers from './triggers';

export const viaWa = {
  wa,
  ...triggers,
}