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

export interface ChatComponentProps {
  user: string;  // Properly define the username prop type
}

export interface SendActionProps {
  user: string,
  channelName: string,
  channelInstance: Channel | null
}