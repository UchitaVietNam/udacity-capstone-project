import auth0 from 'auth0-js'
import { authConfig } from '../config/config'
import { History } from 'history'

export default class Auth {
  accessToken: string
  idToken: string
  expiresAt: number
  history: History<unknown>
  userId: string

  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid'
  })

  constructor(history: History<unknown>) {
    this.history = history
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getIdToken = this.getIdToken.bind(this)
    this.renewSession = this.renewSession.bind(this)

    this.accessToken = ''
    this.idToken = ''
    this.expiresAt = 0
    this.userId = localStorage.getItem('userId') || ''
  }

  login() {
    this.auth0.authorize()
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        this.history.replace('/')
        alert(`Error: ${err.error}. Check the console for further details.`)
      }
    })
  }

  getAccessToken() {
    return this.accessToken
  }

  getIdToken() {
    this.idToken = localStorage.getItem('idToken') || ''
    return this.idToken
  }

  setSession(authResult: auth0.Auth0DecodedHash) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true')

    // Set the time that the access token will expire at
    if (authResult.expiresIn) {
      this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
    }
    if (authResult.accessToken) {
      this.accessToken = authResult.accessToken
    }

    if (authResult.idToken) {
      this.idToken = authResult.idToken
      this.userId = authResult.idTokenPayload.sub
      localStorage.setItem('idToken', authResult.idToken)
      localStorage.setItem('userId', authResult.idTokenPayload.sub)
    }

    // navigate to the home route
    this.history.replace('/')
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        this.logout()
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        )
      }
    })
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = ''
    this.idToken = ''
    this.expiresAt = 0
    this.userId = ''

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('idToken')
    localStorage.removeItem('userId')

    this.auth0.logout({
      return_to: window.location.origin
    } as auth0.LogoutOptions)

    // navigate to the home route
    this.history.replace('/')
  }

  isAuthenticated() {
    return localStorage.getItem('isLoggedIn') && localStorage.getItem('idToken')
    // Check whether the current time is past the
    // access token's expiry time
    // let expiresAt = this.expiresAt
    // return new Date().getTime() < expiresAt
  }
}
