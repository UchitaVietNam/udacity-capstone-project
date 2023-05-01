const apiId = '7d2qn8ogi7'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'uchita.jp.auth0.com', // Auth0 domain
  clientId: 'fpE5XHGiOko9TikY3RgTIQ1YDiJpvvL9', // Auth0 client id
  callbackUrl: 'https://d370nu2nj1qpv8.cloudfront.net/callback'
}

export const SOCKET_URL = `wss://6dtl6fxbra.execute-api.us-east-1.amazonaws.com/dev?idToken=Bearer ${localStorage.getItem(
  'idToken'
)}`
