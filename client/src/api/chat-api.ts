import Axios from './axios'
import { ChatMessage } from '../types/chat/ChatType'

export const getAllChats = async (
  targetUserId: string
): Promise<ChatMessage[]> => {
  return (await Axios().get(`chat/${targetUserId}`)).data as ChatMessage[]
}

export const sendMessage = async (req: ChatMessage): Promise<ChatMessage> => {
  return (await Axios().post('chat/new', req)).data as ChatMessage
}
