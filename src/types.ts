// types.ts
export interface Message {
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
