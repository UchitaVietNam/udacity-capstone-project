import React, { useEffect, useRef, useState } from 'react'
import { Grid, Message, Image, Input, Loader } from 'semantic-ui-react'
import './ChatDetails.css'
import { UserInfo } from '../../../types/user/UserTypes'
import { getAllChats, sendMessage } from '../../../api/chat-api'
import { ChatMessage } from '../../../types/chat/ChatType'
import defaultAvatar from '../../../share/default-avatar.png'
import { SOCKET_URL } from '../../../config/config'

const ChatDetails: React.VFC<any> = (props): JSX.Element => {
  const [loading, setLoading] = useState<{
    isLoadingMessage: boolean
    isSendingMessage: boolean
  }>({ isLoadingMessage: false, isSendingMessage: false })
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [newChatMessage, setNewChatMessage] = useState<string>('')
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([])
  const chatMessageRef = useRef<ChatMessage[]>([])
  const chatTargetUser: UserInfo = props.ActiceUser
  const currentUser: UserInfo = props.CurrentUser

  useEffect(() => {
    chatMessageRef.current = chatMessage
  }, [chatMessage])

  const connection = async () => {
    const socket = new WebSocket(SOCKET_URL)
    socket.onopen = () => {}

    socket.onmessage = (event) => {
      setChatMessage([...chatMessageRef.current, JSON.parse(event.data)])
      scrollToBottom()
    }

    socket.onclose = (event) => {}

    socket.onerror = (error) => {}

    setWebSocket(socket)
  }

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const doGetAllMessage = async () => {
    if (chatTargetUser) {
      setLoading({ ...loading, isLoadingMessage: true })
      if (webSocket) {
        webSocket.close()
      }
      await getAllChats(chatTargetUser?.id).then((res) => {
        setChatMessage([...res])
      })
      await connection()
      setLoading({ ...loading, isLoadingMessage: false })
      scrollToBottom()
    }
  }

  useEffect(() => {
    if (chatMessage) {
      setChatMessage([])
    }
    doGetAllMessage()
    return () => {
      // Close the WebSocket connection when the component unmounts.
      if (webSocket) {
        webSocket.close()
      }
    }
  }, [chatTargetUser])

  useEffect(() => {}, [chatMessage])

  const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatMessage(event.target.value)
  }

  const onClickSendChat = async () => {
    setLoading({ ...loading, isSendingMessage: true })
    const newMessage: ChatMessage = {
      id: '',
      userId: currentUser.id,
      targetUserId: chatTargetUser.id,
      chatContent: newChatMessage,
      chatTime: ''
    }
    await sendMessage(newMessage).then((res) => {
      setChatMessage([...chatMessage, res])
      setLoading({ ...loading, isSendingMessage: false })
      setNewChatMessage('')
    })
    scrollToBottom()
  }

  const keyDownSendMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClickSendChat()
    }
  }

  const ChatMessageCpn = () => {
    return (
      <>
        {chatMessage?.map((message) =>
          message.userId === currentUser?.id &&
          message.targetUserId === chatTargetUser?.id ? (
            <Message key={message.id} color="yellow" className="owner-message">
              <Image
                src={currentUser?.avatar ? currentUser?.avatar : defaultAvatar}
                avatar
              />
              {message.chatContent}
            </Message>
          ) : message.userId === chatTargetUser?.id &&
            message.targetUserId === currentUser?.id ? (
            <Message key={message.id} className="target-message">
              <Image
                src={
                  chatTargetUser?.avatar
                    ? chatTargetUser?.avatar
                    : defaultAvatar
                }
                avatar
              />
              {message.chatContent}
            </Message>
          ) : null
        )}
      </>
    )
  }

  return (
    <div className="chat-details-home-page">
      <Grid.Column stretched width={12} className="message-grid">
        {loading.isLoadingMessage ? (
          <Loader
            active={loading.isLoadingMessage}
            inline="centered"
            size="medium"
          >
            Loading message...
          </Loader>
        ) : (
          <ChatMessageCpn />
        )}
        <div ref={bottomRef} />
      </Grid.Column>
      <Input
        loading={loading.isSendingMessage}
        action={
          loading.isSendingMessage
            ? {}
            : {
                icon: 'send',
                onClick: onClickSendChat
              }
        }
        placeholder="Enter your message..."
        className="input-your-message"
        value={newChatMessage}
        onChange={onChangeMessage}
        onKeyDown={keyDownSendMessage}
      />
    </div>
  )
}

export default ChatDetails
