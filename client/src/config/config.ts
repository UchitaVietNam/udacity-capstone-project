const apiId = '7d2qn8ogi7'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'uchita.jp.auth0.com', // Auth0 domain
  clientId: 'fpE5XHGiOko9TikY3RgTIQ1YDiJpvvL9', // Auth0 client id
  // callbackUrl: 'http://localhost:3000/callback'
  callbackUrl: 'https://d370nu2nj1qpv8.cloudfront.net/callback'
}

export const SOCKET_URL = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      const value = localStorage.getItem('idToken')
      if (value !== null) {
        clearInterval(intervalId)
        resolve(
          `wss://6dtl6fxbra.execute-api.us-east-1.amazonaws.com/dev?idToken=Bearer ${value}`
        )
      }
    }, 100)
  })
}

// export const SOCKET_URL = async () => {
//   const token = await getItemFromLocalStorage('idToken')
//   return `wss://6dtl6fxbra.execute-api.us-east-1.amazonaws.com/dev?idToken=Bearer ${token}`
// }
