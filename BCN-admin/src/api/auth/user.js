import handler from 'api/handler'

const prefix = '/auth/user'

const methods = {
  logIn: args => handler({ method: 'post', url: prefix + '/logIn', args }),
  getUser: args => handler({ method: 'get', url: prefix + '/getUser', args }),
  logOut: args => handler({ method: 'delete', url: prefix + '/logOut', args })
}

export default methods
