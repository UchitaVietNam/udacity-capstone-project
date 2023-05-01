import React, { useEffect, useState } from 'react'
import { Grid, Menu, Image, Loader } from 'semantic-ui-react'
import './index.css'
import ChatDetails from './details/ChatDetails'
import { UserInfo } from '../../types/user/UserTypes'
import { getAllUser, getCurrentUserInfo } from '../../api/user-api'
import defaultAvatar from '../../share/default-avatar.png'

const initialUserInfo = {
  uniqueId: '',
  id: '',
  name: '',
  avatar: '',
  createdAt: ''
}

const ChatHomePage: React.VFC<any> = (props): JSX.Element => {
  const [activeItem, setActiveItem] = useState<string>('')
  const [userList, setUserList] = useState<UserInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo)

  /** Do get current user info */
  const doGetUserInfo = async () => {
    await getCurrentUserInfo().then((res) => setUserInfo(res))
  }

  /** Get all user */
  useEffect(() => {
    const request = async () => {
      setIsLoading(true)
      await getAllUser().then((res) => {
        if (res && res.length > 0) {
          setUserList(res)
          setActiveItem(res[0].uniqueId)
        }
      })
      await doGetUserInfo()
      setIsLoading(false)
    }
    request()
  }, [])

  /** Handle click chat item */
  const handleItemClick = (e: any, data: any) => {
    setActiveItem(data.id)
  }

  /** Get selected user */
  const getActiveUser = () => {
    return userList.find((user) => user.uniqueId === activeItem)
  }

  const ChatComponent = userList.map((chat: UserInfo) => (
    <Menu.Item
      id={chat.uniqueId}
      key={chat.uniqueId}
      active={activeItem === chat.uniqueId}
      onClick={handleItemClick}
    >
      <Image src={chat.avatar ? chat.avatar : defaultAvatar} avatar />
      {chat.name}
    </Menu.Item>
  ))

  return (
    <div className="chat-home-page">
      <br />
      <Grid>
        <Grid.Column width={4}>
          {isLoading ? (
            <Loader active={isLoading} inline="centered" size="medium">
              Getting list chat
            </Loader>
          ) : (
            <Menu fluid vertical tabular>
              {ChatComponent}
            </Menu>
          )}
        </Grid.Column>
        <ChatDetails
          ActiceUser={getActiveUser()}
          auth={props.auth}
          CurrentUser={userInfo}
        />
      </Grid>
    </div>
  )
}

export default ChatHomePage
