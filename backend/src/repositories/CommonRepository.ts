import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDocumentClient } from './DocumentClient'
import { LOG_NAME, createLogger } from '../utils/loggerUtil'
import { PromiseResult } from 'aws-sdk/lib/request'
import { AWSError } from 'aws-sdk'

const LOGGER = createLogger(LOG_NAME.COMMON_REPO)

export class CommonRepository {
  private readonly docClient: DocumentClient

  constructor(docClient: DocumentClient = createDocumentClient()) {
    this.docClient = docClient
  }

  /**
   * Get all record of a table
   * @param params table name
   * @returns Results
   */
  async scanTable(
    params: DocumentClient.ScanInput
  ): Promise<PromiseResult<DocumentClient.ScanOutput, AWSError>> {
    return await this.docClient.scan(params).promise()
  }

  /**
   * Execute a get query
   * @param query Query
   * @returns Result
   */
  async directlyAccess(
    query: DocumentClient.QueryInput
  ): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
    LOGGER.info(`Start Execute A Get Query '${query}'`)
    return await this.docClient.query(query).promise()
  }

  /**
   * Execute a update query
   * @param query Query
   * @returns Result
   */
  async editsItem(
    query: DocumentClient.UpdateItemInput
  ): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>> {
    LOGGER.info(`Start Execute A Update Query '${query}'`)
    return await this.docClient.update(query).promise()
  }

  /**
   * Execute a insert query
   * @param query Query
   * @returns Result
   */
  async createsItem(
    query: DocumentClient.PutItemInput
  ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
    LOGGER.info(`Start Execute A Insert Query '${query}'`)
    return await this.docClient.put(query).promise()
  }

  /**
   * Excecute a delete query
   * @param query Query
   * @returns Result
   */
  async deleteItem(
    query: DocumentClient.DeleteItemInput
  ): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> {
    LOGGER.info(`Start Execute A Delete Query '${query}'`)
    return await this.docClient.delete(query).promise()
  }
}
