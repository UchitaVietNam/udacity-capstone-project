import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { UserInfo } from '../types/user/UserTypes'
import { Action } from 'redux'

export const UserActionTypes = {
  GET_USER_INFO: 'GET_USER_INFO'
}

let initialState: UserInfo = {
  uniqueId: '',
  id: '',
  name: '',
  avatar: '',
  createdAt: ''
}

export interface IUserReducerAction extends Action {
  type: typeof UserActionTypes.GET_USER_INFO
  payload: UserInfo
}

const userReducer = (state = initialState, action: IUserReducerAction) => {
  switch (action.type) {
    case UserActionTypes.GET_USER_INFO:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export const actions = {}

const persistConfig = {
  keyPrefix: 'user-',
  key: 'info',
  storage
}

export default persistReducer(persistConfig, userReducer)
