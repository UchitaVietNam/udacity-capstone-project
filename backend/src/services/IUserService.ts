import {
  ReqUpdateUserInfo,
  UserInfo
} from '../models/request/user/ReqUserModels'

export interface IUserService {
  getAll(): Promise<UserInfo[]>
  getByUserId(userId: string): Promise<UserInfo>
  update(updateUser: ReqUpdateUserInfo): Promise<UserInfo>
  create(user: UserInfo): Promise<UserInfo>
  getAvatarSignedUrl(userId: string, uuid: string): Promise<string>
  createAvatarUrl(userId: string, uuid: string): string
}
