// Super Admin Dashboard Routes
import Admins from './admins'
import AddAdmin from './editProfile'

import * as Layout from 'layouts'

const routes = [
  {
    path: '/admin/admins',
    Component: Admins,
    Super: Layout.Admin,
    auth: true
  },
  {
    path: '/admin/admins/addAdmin',
    Component: AddAdmin,
    Super: Layout.Admin,
    auth: true
  }
]

export default routes
