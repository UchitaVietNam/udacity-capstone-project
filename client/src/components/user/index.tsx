import React, { useEffect, useState } from 'react'
import { Image, Input, Button, Form, Card, Loader } from 'semantic-ui-react'
import './index.css'
import { ChangeUserInfo, UserInfo } from '../../types/user/UserTypes'
import {
  getCurrentUserInfo,
  updateUserInfo,
  uploadUserAvatar
} from '../../api/user-api'
import defaultAvatar from '../../share/default-avatar.png'

const UserInfoCpn: React.VFC<any> = (props): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false)
  const [displayMode, setDisplayMode] = useState<'display' | 'update'>(
    'display'
  )
  const [userInfo, setUserInfo] = useState<UserInfo>({
    uniqueId: '',
    id: '',
    name: '',
    avatar: '',
    createdAt: ''
  })
  const [changeUserInfo, setChangeUserInfo] = useState<ChangeUserInfo>({
    newName: '',
    avatar: null,
    isUploading: false
  })

  /** Do start update user info */
  const doStartUpdateUserInfo = () => {
    setChangeUserInfo({
      ...changeUserInfo,
      newName: userInfo.name,
      isUploading: false
    })
    setDisplayMode('update')
  }

  /** Do get current user info */
  const doGetUserInfo = async () => {
    setLoading(true)
    await getCurrentUserInfo().then((res) => setUserInfo(res))
    setLoading(false)
  }

  /** Get current user information */
  useEffect(() => {
    doGetUserInfo()
  }, [])

  /**
   * On change user name
   */
  const onChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangeUserInfo({ ...changeUserInfo, newName: event.target.value })
  }

  /** On change user avatar file*/
  const onChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    setChangeUserInfo({ ...changeUserInfo, avatar: files[0] })
  }

  /** On change user info */
  const onSubmitUpdateUserInfo = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      setChangeUserInfo({ ...changeUserInfo, isUploading: true })
      const res = await updateUserInfo({
        uniqueId: userInfo.uniqueId,
        id: userInfo.id,
        name: userInfo.name,
        newName: changeUserInfo.newName,
        avatar: '',
        isChangeAvatar: !!changeUserInfo.avatar
      })
      if (changeUserInfo.avatar) {
        await uploadUserAvatar(res.avatar, changeUserInfo.avatar)
      }
      setChangeUserInfo({ ...changeUserInfo, isUploading: true })
      await doGetUserInfo()
    } catch (error) {
      alert('An error has issued')
    } finally {
      setDisplayMode('display')
    }
  }

  return (
    <div className="user-info">
      {displayMode === 'display' ? (
        <Card>
          {loading ? (
            <Loader active={loading} inline="centered" size="medium">
              Getting User Information
            </Loader>
          ) : (
            <>
              <Image
                src={userInfo.avatar ? userInfo.avatar : defaultAvatar}
                circular
                size="small"
                wrapped
                ui={false}
              />
              <br />
              <Card.Content>
                <Card.Header>{userInfo.name}</Card.Header>
                <Card.Description>{userInfo.id}</Card.Description>
              </Card.Content>
              <br />
              <Button color="blue" onClick={() => doStartUpdateUserInfo()}>
                Update
              </Button>
            </>
          )}
        </Card>
      ) : (
        <Form onSubmit={onSubmitUpdateUserInfo}>
          <Form.Field>
            <label>Select avatar</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={onChangeAvatar}
            />
          </Form.Field>
          <br />
          <Input
            label="Name : "
            placeholder="Enter your name"
            disabled={false}
            value={changeUserInfo.newName}
            onChange={onChangeUserName}
          />
          <br />
          <Button color="blue" loading={changeUserInfo.isUploading}>
            OK
          </Button>
        </Form>
      )}
    </div>
  )
}

export default UserInfoCpn
