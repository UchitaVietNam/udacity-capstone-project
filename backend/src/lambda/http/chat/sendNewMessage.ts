import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createRes } from '../../../utils/responseUtil'
import { LOG_NAME, createLogger } from '../../../utils/loggerUtil'
import { ChatMessage } from '../../../models/request/chat/ReqChatModels'
import { ChatService } from '../../../services/impl/ChatServiceImpl'

const LOGGER = createLogger(LOG_NAME.CHAT_SEND_MESSAGE)

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    LOGGER.info(`Start Send a new Message`)
    const req = JSON.parse(event.body) as ChatMessage
    const res = await ChatService.createNewChat(req)
    return createRes(200, res)
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
