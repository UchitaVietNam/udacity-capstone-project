import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import 'source-map-support/register'
import { ConnectItem } from '../../models/request/connect/ConnectModels'
import { getUserIdByToken } from '../../utils/authorizationUtil'
import { ConnectService } from '../../services/impl/ConnectionServiceImpl'
import { createRes } from '../../utils/responseUtil'
import { LOG_NAME, createLogger } from '../../utils/loggerUtil'

const LOGGER = createLogger(LOG_NAME.CONNECTION_OPEN)

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    LOGGER.info(JSON.stringify(event))
    const jwtToken = event.queryStringParameters.idToken
    const userId = getUserIdByToken(jwtToken)
    const connectionId = event.requestContext.connectionId
    const item: ConnectItem = {
      id: connectionId,
      userId: userId,
      connectTime: null
    }
    const result = await ConnectService.create(item)
    return createRes(200, result)
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
