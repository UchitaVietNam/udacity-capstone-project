export interface ReqAddUser {
  id: string
  name: string
  avatar: string
}

export interface ReqUpdateUserInfo {
  uniqueId: string
  id: string
  name: string
  newName: string
  avatar: string
  isChangeAvatar: boolean
}

export interface ChangeUserInfo {
  newName: string
  avatar: any
  isUploading: boolean
}

export interface UserInfo {
  uniqueId: string
  id: string
  name: string
  avatar: string
  createdAt: string
}

export type UserList = UserInfo[]
