import * as AWS from 'aws-sdk'
import ENVIROMENTS from '../../utils/enviromentsUtil'
import { LOG_NAME, createLogger } from '../../utils/loggerUtil'
import { IUserService } from '../IUserService'
import {
  UserInfo,
  ReqUpdateUserInfo
} from '../../models/request/user/ReqUserModels'
import { UserRepository } from '../../repositories/UserRepository'

const LOGGER = createLogger(LOG_NAME.USER_SERVICE)
const ENVS = ENVIROMENTS()
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
// const uuid = require('uuid')

class UserServiceImpl implements IUserService {
  private readonly userRepository: UserRepository

  /** Constructor */
  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository
  }

  async getAll(): Promise<UserInfo[]> {
    LOGGER.info(`Getting all user`)
    const results = await this.userRepository.getAll()
    return results
  }

  async getByUserId(userId: string): Promise<UserInfo> {
    LOGGER.info(`Getting User by User Id ${userId}`)
    const result = await this.userRepository.getByUserId(userId)
    LOGGER.info(`Getted2 ${JSON.stringify(result)}`)
    if (!result) {
      LOGGER.info(`Creating a new user because user do not exist`)
      const user: UserInfo = {
        uniqueId: userId,
        id: userId,
        name: `User ${userId}`,
        avatar: null,
        createdAt: null
      }
      return this.userRepository.create(user)
    }
    LOGGER.info(`Getted user : ${JSON.stringify(result)}`)
    return result
  }

  async update(updateUser: ReqUpdateUserInfo): Promise<UserInfo> {
    LOGGER.info(`Updating User with data : ${JSON.stringify(updateUser)}`)
    return await this.userRepository.update(updateUser)
  }

  async create(user: UserInfo): Promise<UserInfo> {
    LOGGER.info(`Creating User ${JSON.stringify(user)}`)
    return await this.userRepository.create(user)
  }

  async getAvatarSignedUrl(userId: string, uuid: string): Promise<string> {
    LOGGER.info(`Getting SignedUrl by user id : ${userId}`)
    return await s3.getSignedUrl('putObject', {
      Bucket: ENVS.USER_S3_BUCKET_NAME,
      Key: `${userId}-${uuid}`,
      Expires: parseInt(ENVS.USER_SIGNED_URL_EXP)
    })
  }

  createAvatarUrl(userId: string, uuid: string): string {
    return `https://${ENVS.USER_S3_BUCKET_NAME}.s3.amazonaws.com/${userId}-${uuid}`
  }
}

export const UserService: IUserService = new UserServiceImpl()
