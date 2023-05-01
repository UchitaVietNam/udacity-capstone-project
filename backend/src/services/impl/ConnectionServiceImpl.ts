import { IConnectService } from '../IConnectService'
import { ConnectionRepository } from '../../repositories/ConnectionRepository'
import { ConnectItem } from '../../models/request/connect/ConnectModels'

// const LOGGER = createLogger(LOG_NAME.CONNECTION_SERVICE)
// const ENVS = ENVIROMENTS()
// const AWSXRay = require('aws-xray-sdk')
// const XAWS = AWSXRay.captureAWS(AWS)
// const s3 = new XAWS.S3({
//   signatureVersion: 'v4'
// })
// const uuid = require('uuid')

class ConnectServiceImpl implements IConnectService {
  private readonly connectRepository: ConnectionRepository

  /** Constructor */
  constructor(
    connectRepository: ConnectionRepository = new ConnectionRepository()
  ) {
    this.connectRepository = connectRepository
  }
  async getConnectIdByUserId(userId: string): Promise<string> {
    return await this.connectRepository.getConnectIdByUserId(userId)
  }
  async create(connect: ConnectItem): Promise<ConnectItem> {
    connect.connectTime = new Date().toISOString()
    return await this.connectRepository.create(connect)
  }
  async delete(id: string): Promise<void> {
    return await this.connectRepository.delete(id)
  }
}

export const ConnectService: IConnectService = new ConnectServiceImpl()
