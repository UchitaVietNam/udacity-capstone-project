import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createRes } from '../../../utils/responseUtil'
import { LOG_NAME, createLogger } from '../../../utils/loggerUtil'
import { UserService } from '../../../services/impl/UserServiceImpl'
import { getUserId } from '../../../utils/authorizationUtil'

const LOGGER = createLogger(LOG_NAME.GET_ALL_USER)

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    LOGGER.info(`Start get all User`)
    const userId = getUserId(event)
    const res = (await UserService.getAll()).filter(
      (user) => user.id !== userId
    )
    return createRes(200, res)
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
