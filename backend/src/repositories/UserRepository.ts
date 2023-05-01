import { LOG_NAME, createLogger } from '../utils/loggerUtil'
import ENVIROMENTS from '../utils/enviromentsUtil'
import {
  ReqUpdateUserInfo,
  UserInfo
} from '../models/request/user/ReqUserModels'
import { CommonRepository } from './CommonRepository'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const LOGGER = createLogger(LOG_NAME.USER_REPO)
const ENVS = ENVIROMENTS()

export class UserRepository extends CommonRepository {
  private readonly userTableName: string

  constructor() {
    super()
    this.userTableName = ENVS.USER_TABLE
  }

  /**
   * Get all User record
   * @returns All record
   */
  async getAll(): Promise<UserInfo[]> {
    LOGGER.info(`Start Get All User Record`)
    const query: DocumentClient.ScanInput = {
      TableName: this.userTableName
    }
    return (await this.scanTable(query)).Items as UserInfo[]
  }

  /**
   * Get user info by user id
   * @param userId User id
   * @returns User info
   */
  async getByUserId(userId: string): Promise<UserInfo> {
    LOGGER.info(`Start Get User Info By User Id : '${userId}'`)
    const query: DocumentClient.QueryInput = {
      TableName: this.userTableName,
      KeyConditionExpression: 'id = :userId and uniqueId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    const result = (await this.directlyAccess(query)).Items
    LOGGER.info(`Getted1 ${JSON.stringify(result)}`)
    return result && result.length > 0 ? (result[0] as UserInfo) : null
  }

  /**
   * Update user info
   * @param updateUser Upate data
   * @returns Result
   */
  async update(updateUser: ReqUpdateUserInfo): Promise<UserInfo> {
    LOGGER.info(`Start Update User Info: ${JSON.stringify(updateUser)}`)
    const query: DocumentClient.UpdateItemInput = {
      TableName: this.userTableName,
      Key: {
        id: updateUser.id,
        uniqueId: updateUser.uniqueId
      },
      ExpressionAttributeNames: { '#N': 'name' },
      UpdateExpression: updateUser.isChangeAvatar
        ? 'set #N = :name, avatar = :avatar'
        : 'set #N = :name',
      ExpressionAttributeValues: updateUser.isChangeAvatar
        ? {
            ':name': updateUser.newName,
            ':avatar': updateUser.avatar
          }
        : {
            ':name': updateUser.newName
          },
      ReturnValues: 'UPDATED_NEW'
    }
    await this.editsItem(query)
    LOGGER.info(`User Info Updated: ${JSON.stringify(updateUser)}`)
    return {
      id: updateUser.id,
      name: updateUser.newName,
      avatar: updateUser.avatar
    } as UserInfo
  }

  /**
   * Create User
   * @param user User Info
   * @returns Created user info
   */
  async create(user: UserInfo): Promise<UserInfo> {
    user.createdAt = new Date().toISOString()
    LOGGER.info(`Start Insert A New User: ${JSON.stringify(user)}`)
    const query: DocumentClient.PutItemInput = {
      TableName: this.userTableName,
      Item: user
    }
    await this.createsItem(query)
    LOGGER.info(`User Inserted: ${JSON.stringify(user)}`)
    return user
  }
}
