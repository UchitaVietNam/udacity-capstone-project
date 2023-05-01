import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createRes } from '../../../utils/responseUtil'
import { LOG_NAME, createLogger } from '../../../utils/loggerUtil'
import { getUserId } from '../../../utils/authorizationUtil'
import { UserService } from '../../../services/impl/UserServiceImpl'

const LOGGER = createLogger(LOG_NAME.GET_USER_INFO)

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    LOGGER.info(`Start get User info`)
    const userId = getUserId(event)
    const res = await UserService.getByUserId(userId)
    return createRes(200, res)
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
