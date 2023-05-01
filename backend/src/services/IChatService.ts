import { ChatMessage } from '../models/request/chat/ReqChatModels'

export interface IChatService {
  getAllChatForUser(
    userId: string,
    targetUserId: string
  ): Promise<ChatMessage[]>
  createNewChat(chat: ChatMessage): Promise<ChatMessage>
}
