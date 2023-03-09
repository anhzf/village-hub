import wa from './whatsapp';
import * as triggers from './triggers';

export const viaWa = {
  wa,
  ...triggers,
}