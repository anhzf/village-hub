import { INVITATION_MESSAGE_STATUS } from './constants';

export interface Model {
  id: string;
}

export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipient extends Model, Timestamped {
  title: string;
  phoneNumber: string;
  labels: string[];
}

export interface Invitation extends Model, Timestamped {
  eventTitle: string;
  datetime: Date;
  location: string;
  organizer: string;
  organizerName: string;
}

export type InvitationMessageStatus = typeof INVITATION_MESSAGE_STATUS[number];

export interface InvitationMessage {
  recipientId: string;
  messageId?: string;
  status?: InvitationMessageStatus;
}

export interface InvitationMessages {
  sort: number;
  messages: InvitationMessage[];
}
