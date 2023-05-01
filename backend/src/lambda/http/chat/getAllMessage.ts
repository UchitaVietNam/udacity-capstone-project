import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createRes } from '../../../utils/responseUtil'
import { LOG_NAME, createLogger } from '../../../utils/loggerUtil'
import { getUserId } from '../../../utils/authorizationUtil'
import { ChatService } from '../../../services/impl/ChatServiceImpl'

const LOGGER = createLogger(LOG_NAME.CHAT_GET_ALL_MESSAGE)

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    LOGGER.info(`Start get all message`)
    const targetUserId = decodeURIComponent(event.pathParameters.targetUserId)
    const userId = getUserId(event)
    LOGGER.info(`Start get all message ${userId} ${targetUserId}`)
    const res = await ChatService.getAllChatForUser(userId, targetUserId)
    return createRes(200, res)
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
