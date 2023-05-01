import { ConnectItem } from '../models/request/connect/ConnectModels'

export interface IConnectService {
  getConnectIdByUserId(userId: string): Promise<string>
  create(connect: ConnectItem): Promise<ConnectItem>
  delete(id: string): Promise<void>
}
