import Axios from './axios'
import axios from 'axios'
import { ReqUpdateUserInfo, UserInfo } from '../types/user/UserTypes'

export const getCurrentUserInfo = async (): Promise<UserInfo> => {
  return (await Axios().get('user')).data as UserInfo
}

export const updateUserInfo = async (
  req: ReqUpdateUserInfo
): Promise<UserInfo> => {
  return (await Axios().post('user/update', req)).data as UserInfo
}

export const uploadUserAvatar = async (
  uploadUrl: string,
  file: Buffer
): Promise<void> => {
  await axios.put(uploadUrl, file)
}

export const getAllUser = async (): Promise<UserInfo[]> => {
  return (await Axios().get('user/all')).data as UserInfo[]
}
