import axios from 'axios'

const API_HOST = process.env.REACT_APP_API_HOST
const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL
const BACKEND_ACCESS_KEY = process.env.REACT_APP_BACKEND_ACCESS_KEY

const handler = ({ baseURL = API_HOST, url = null, method = 'get', args = {} }) => {
  const request = {}

  request.url = url
  request.baseURL = baseURL
  request.method = method.toLowerCase()
  request.headers = {
    // for admin
    authentication: window.localStorage.getItem('authentication'),
    // for userAdmin
    authorization: window.localStorage.getItem('authorization'),
    'Content-Type': 'application/json',
    backendAccessKey: BACKEND_ACCESS_KEY
  }

  if (request.method === 'get') request.params = args
  else request.data = args

  return axios(request).then(
    response => {
      return response.data
    },
    async error => {
      if (error?.response) {
        if (
          error.response.data.error === 'jwt expired' ||
          error.response.data.error === 'UnAuthorized - Authorization required!'
        ) {
          window.localStorage.removeItem('authentication')
          window.localStorage.removeItem('authorization')
          window.localStorage.removeItem('adminData')
          window.location.href = PUBLIC_URL + '/login'
        }
        return error.response.data
      } else {
        return {}
      }
    }
  )
}

export default handler
