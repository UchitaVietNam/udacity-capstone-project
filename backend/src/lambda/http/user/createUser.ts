import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createRes } from '../../../utils/responseUtil'
import { LOG_NAME, createLogger } from '../../../utils/loggerUtil'
import { UserInfo } from '../../../models/request/user/ReqUserModels'
import { UserService } from '../../../services/impl/UserServiceImpl'

const LOGGER = createLogger(LOG_NAME.CREATE_USER)

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    LOGGER.info(`Start Create User`)
    const req = JSON.parse(event.body) as UserInfo
    const res = await UserService.create(req)
    return createRes(200, res)
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
