import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { apiEndpoint } from '../config/config'

/** Config axios */

const instance = () => {
  const headers: any = {
    'Content-Type': 'application/json'
  }
  headers.Authorization = `Bearer ${localStorage.getItem('idToken')}`

  const axiosInstant: AxiosInstance = axios.create({
    baseURL: `${apiEndpoint}/`,
    requiredAuth: true,
    errorHandle: true,
    headers: headers
  } as AxiosRequestConfig)
  return axiosInstant
}

export default instance
