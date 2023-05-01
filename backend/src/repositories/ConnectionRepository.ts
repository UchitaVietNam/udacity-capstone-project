import { LOG_NAME, createLogger } from '../utils/loggerUtil'
import ENVIROMENTS from '../utils/enviromentsUtil'
import { CommonRepository } from './CommonRepository'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ConnectItem } from '../models/request/connect/ConnectModels'

const LOGGER = createLogger(LOG_NAME.CONNECTION_REPO)
const ENVS = ENVIROMENTS()

export class ConnectionRepository extends CommonRepository {
  private readonly connectTableName: string

  constructor() {
    super()
    this.connectTableName = ENVS.CONNECTIONS_TABLE
  }

  async getConnectIdByUserId(userId: string): Promise<string> {
    LOGGER.info(`Start Get connect id by user id ${userId}`)
    const query: DocumentClient.ScanInput = {
      TableName: this.connectTableName,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    const results = (await this.scanTable(query)).Items as ConnectItem[]
    return results && results.length > 0 ? results[0].id : null
  }

  async create(connect: ConnectItem): Promise<ConnectItem> {
    LOGGER.info(`Start Insert A connect item: ${JSON.stringify(connect)}`)
    const query: DocumentClient.PutItemInput = {
      TableName: this.connectTableName,
      Item: connect
    }
    await this.createsItem(query)
    LOGGER.info(`Message Inserted: ${JSON.stringify(connect)}`)
    return connect
  }

  async delete(id: string): Promise<void> {
    LOGGER.info(`Start delete connect ${id}`)
    const query: DocumentClient.DeleteItemInput = {
      TableName: this.connectTableName,
      Key: {
        id
      }
    }
    await this.deleteItem(query)
  }
}
