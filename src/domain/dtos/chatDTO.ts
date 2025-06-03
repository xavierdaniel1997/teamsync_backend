export interface IChat {
  _id?: string;
  projectId: string;
  senderId: string;
  recipientId: string;
  message: string;
  read: boolean;
  timestamp: Date;
}


export interface CreateMessageDto {
  projectId: string;
  senderId: string;
  recipientId: string;
  message: string;
  tempId?: string; 
}

export interface GetMessagesDto {
  projectId: string;
  recipientId: string;
}