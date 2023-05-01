import { LOG_NAME, createLogger } from '../utils/loggerUtil'
import ENVIROMENTS from '../utils/enviromentsUtil'
import { CommonRepository } from './CommonRepository'
import { ChatMessage } from '../models/request/chat/ReqChatModels'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const LOGGER = createLogger(LOG_NAME.CHAT_REPO)
const ENVS = ENVIROMENTS()

export class ChatRepository extends CommonRepository {
  private readonly chatTableName: string

  constructor() {
    super()
    this.chatTableName = ENVS.CHAT_TABLE
  }

  /**
   * Get all chat message by user id and target user id
   * @param userId User Id
   * @param targetUserId Target User Id
   * @returns All chat
   */
  async getAll(userId: string, targetUserId: string): Promise<ChatMessage[]> {
    LOGGER.info(
      `Start Get All User Record by user id ${userId} and targetUserId ${targetUserId}`
    )
    const query: DocumentClient.ScanInput = {
      TableName: this.chatTableName,
      FilterExpression: 'userId = :userId and targetUserId = :targetUserId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':targetUserId': targetUserId
      }
    }
    return (await this.scanTable(query)).Items as ChatMessage[]
  }

  /**
   * Create a new message for current user
   * @param chat Chat info
   * @returns Created chat
   */
  async create(chat: ChatMessage): Promise<ChatMessage> {
    LOGGER.info(`Start Insert A Message: ${JSON.stringify(chat)}`)
    const query: DocumentClient.PutItemInput = {
      TableName: this.chatTableName,
      Item: chat
    }
    await this.createsItem(query)
    LOGGER.info(`Message Inserted: ${JSON.stringify(chat)}`)
    return chat
  }
}
