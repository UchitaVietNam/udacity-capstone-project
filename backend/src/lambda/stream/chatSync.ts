import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import { ConnectService } from '../../services/impl/ConnectionServiceImpl'
import { ChatMessage } from '../../models/request/chat/ReqChatModels'
import * as AWS from 'aws-sdk'

const stage = process.env.STAGE
const apiId = process.env.API_ID
const region = process.env.REGION

const connectionParams = {
  apiVersion: '2018-11-29',
  endpoint: `${apiId}.execute-api.${region}.amazonaws.com/${stage}`
}

const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams)

export const handler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
) => {
  for (const record of event.Records) {
    if (record.eventName !== 'INSERT') {
      continue
    }

    const newItem = record.dynamodb.NewImage
    const targetUserId = newItem.targetUserId.S
    const connectId = await ConnectService.getConnectIdByUserId(targetUserId)

    if (!connectId) {
      continue
    }

    const chatItem: ChatMessage = {
      id: newItem.id.S,
      userId: newItem.userId.S,
      targetUserId: newItem.targetUserId.S,
      chatContent: newItem.chatContent.S,
      chatTime: newItem.chatTime.S
    }

    await apiGateway
      .postToConnection({
        ConnectionId: connectId,
        Data: JSON.stringify(chatItem)
      })
      .promise()
  }
}
