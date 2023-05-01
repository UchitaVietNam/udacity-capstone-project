import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import 'source-map-support/register'
import { ConnectService } from '../../services/impl/ConnectionServiceImpl'
import { createRes } from '../../utils/responseUtil'
import { LOG_NAME, createLogger } from '../../utils/loggerUtil'

const LOGGER = createLogger(LOG_NAME.CONNECTION_CLOSE)

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    LOGGER.info('Websocket disconnect', JSON.stringify(event))
    const connectionId = event.requestContext.connectionId
    await ConnectService.delete(connectionId)
    return createRes(200, {})
  }
)
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
