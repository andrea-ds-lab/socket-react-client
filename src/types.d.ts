// types.ts
export interface MessageProps {
  id: number;
  user: string;
  body: string;
  boosted: boolean;
  channel: string;
  inserted_at: string;
  updated_at: string;
}

export interface MessageResponse {
  messages: Message[];
}

export interface Channel {
  leave: () => void;
  join: () => { receive: (status: string, callback: (response: any) => void) => void };
  on: (event: string, callback: (payload: { body: string, timestamp: number, user: string, boosted: boolean, channel: string }) => void) => void;
  push: (event: string, payload: { body: string, timestamp: number, user: string, boosted: boolean, channel: string }) => void;
}

export interface ChatMiddlewareProps {
  user: string | undefined;
}

export interface ChatDisplayProps {
  user: string,
  messages: MessageProps[] | null,
  scrollTargetMessage: number
}

export interface SendActionProps {
  user: string,
  channelName: string,
  channelInstance: Channel | null
}

export interface MessagesState {
  messages: MessageProps[];
  loading: boolean;
  error: string | null;
  lastMessagesAdded: MessageProps[] | null;
  scrollTargetMessage: number;
  oldestId: number;
}