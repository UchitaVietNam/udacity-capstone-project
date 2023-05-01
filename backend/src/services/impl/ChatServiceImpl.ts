import { LOG_NAME, createLogger } from '../../utils/loggerUtil'
import { IChatService } from '../IChatService'
import { ChatRepository } from '../../repositories/ChatRepository'
import { ChatMessage } from '../../models/request/chat/ReqChatModels'

const uuid = require('uuid')
const LOGGER = createLogger(LOG_NAME.CHAT_SERVICE)

class ChatServiceImpl implements IChatService {
  /** Todo repository */
  private readonly chatRepository: ChatRepository

  /** Constructor */
  constructor(chatRepository: ChatRepository = new ChatRepository()) {
    this.chatRepository = chatRepository
  }

  /**
   * Get all chat message by user id and target user id
   * @param userId User Id
   * @param targetUserId Target User Id
   * @returns All chat
   */
  async getAllChatForUser(
    userId: string,
    targetUserId: string
  ): Promise<ChatMessage[]> {
    LOGGER.info('Start get all chat for current user')
    const toTargetUseMessage = await this.chatRepository.getAll(
      userId,
      targetUserId
    )
    const toMeMessage = await this.chatRepository.getAll(targetUserId, userId)
    const sortedResults = [...toTargetUseMessage, ...toMeMessage].sort((a, b) =>
      a.chatTime.localeCompare(b.chatTime)
    )
    return sortedResults
  }

  /**
   * Create a new message for current user
   * @param chat Chat info
   * @returns Created chat
   */
  async createNewChat(chat: ChatMessage): Promise<ChatMessage> {
    LOGGER.info('Start creating a new chat for current user')
    chat.id = uuid.v4()
    chat.chatTime = new Date().toISOString()
    return await this.chatRepository.create(chat)
  }
}

export const ChatService: IChatService = new ChatServiceImpl()
