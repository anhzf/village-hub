export interface MessageTemplateComponent {
  type: 'body' | 'footer';
  parameters: {
    type: 'text';
    text: string;
  }[];
}

export interface SendMessageResponse {
  messaging_product: 'whatsapp',
  contacts: ValueContact[];
  messages: {
    id: string;
  }[];
}

export interface ValueContact {
  wa_id: string;
  profile: {
    name: string;
  }
}

export interface ValueError {
  code: number;
  title: string;
}

export interface MessageAudio {
  id: string;
  mime_type: string;
}

export interface MessageButton {
  payload: string;
  text: string;
}

export interface MessageContext {
  forwarded: boolean;
  frequently_forwarded: boolean;
  from: string;
  id: string;
  referred_product?: {
    catalog_id: string;
    product_retailer_id: string;
  }
}

export interface MessageDocument {
  caption: string;
  filename: string;
  ha256: string;
  mime_type: string;
  id: string;
}

export interface MessageError {
  [key: string]: any;
}

export interface MessageImage {
  caption: string;
  sha256: string;
  id: string;
  mime_type: string;
}

export interface MessageSticker {
  mime_type: string;
  sha256: string;
  id: string;
  animated: boolean;
}

export interface MessageSystem {
  body: string;
  identity: string;
  new_wa_id?: string;
  wa_id?: string;
  type: 'customer_changed_number' | 'customer_identity_changed';
  customer: string;
}

export interface MessageText {
  body: string;
}

export interface MessageVideo {
  caption: string;
  filename: string;
  sha256: string;
  id: string;
  mime_type: string;
}

export interface ValueMessageTypes {
  audio: MessageAudio;
  button: MessageButton;
  context: MessageContext;
  document: MessageDocument;
  error: MessageError;
  image: MessageImage;
  sticker: MessageSticker;
  system: MessageSystem;
  text: MessageText;
  video: MessageVideo;
}

export type ValueMessage<Type extends keyof ValueMessageTypes> = {
  type: Type;
  from: string;
  context: Partial<MessageContext>;
} & {
    [key in Type]: key extends Type ? ValueMessageTypes[key] : never;
  };

export interface ValueMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface ValueStatus {
  [key: string]: any;
}

// export interface NotifcationPayloadEntry {

// }

export interface NotificationPayload<Type extends keyof ValueMessageTypes> {
  object: 'whatsapp_business_account';
  entry: {
    id: string;
    changes: {
      value: {
        messaging_product: 'whatsapp';
        metadata: ValueMetadata;
        contacts: ValueContact[];
        errors: ValueError[];
        messages: ValueMessage<Type>[];
        statuses: ValueStatus[];
      },
      field: 'messages'
    }[];
  }[];
}

export const isNotification = <Type extends keyof ValueMessageTypes>(payload: any): payload is NotificationPayload<Type> => {
  return payload.object === 'whatsapp_business_account';
}

export const isMessage = <Type extends keyof ValueMessageTypes>(type: Type, payload: any): payload is ValueMessage<Type> => {
  return payload.type === type;
}