import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createRes } from '../../../utils/responseUtil'
import { LOG_NAME, createLogger } from '../../../utils/loggerUtil'
import { UserService } from '../../../services/impl/UserServiceImpl'
import { ReqUpdateUserInfo } from '../../../models/request/user/ReqUserModels'
import { getUserId } from '../../../utils/authorizationUtil'

const LOGGER = createLogger(LOG_NAME.UPDATE_USER_INFO)
const uuid = require('uuid')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    LOGGER.info(`Start update a Todo item`)
    const req = JSON.parse(event.body) as ReqUpdateUserInfo
    const userId = getUserId(event)
    req.id = userId
    const avatarId = uuid.v4()
    if (req.isChangeAvatar) {
      req.avatar = UserService.createAvatarUrl(userId, avatarId)
    }
    const res = await UserService.update(req)
    if (res.avatar) {
      res.avatar = await UserService.getAvatarSignedUrl(userId, avatarId)
    }
    return createRes(200, res)
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
