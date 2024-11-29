import handler from 'api/handler'

const prefix = '/auth/admin'

const methods = {
  logIn: args => handler({ method: 'post', url: prefix + '/logIn', args }),
  getAdmin: args => handler({ method: 'get', url: prefix + '/getAdmin', args }),
  getUserAdmin: args => handler({ method: 'get', url: prefix + '/getUserAdmin', args }),
  logOut: args => handler({ method: 'delete', url: prefix + '/logOut', args })
}

export default methods
