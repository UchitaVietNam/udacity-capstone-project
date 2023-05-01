export interface ReqAddUser {
  uniqueId: string
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

export interface UserInfo {
  uniqueId: string
  id: string
  name: string
  avatar: string
  createdAt: string
}
