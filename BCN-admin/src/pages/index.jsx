import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom'
import defaultRoutes from './routes'
import superAdminRoutes from './superAdminRoutes'

import { useEffect, useCallback, useRef, useState } from 'react'
import { Alert, Loader, Modal } from 'components'
import * as api from 'api'

export default function Main() {
  let routes = [...defaultRoutes]
  const adminData = JSON.parse(window.localStorage.getItem('adminData'))
  if (adminData && adminData.access === 'superAdmin') routes = [...defaultRoutes, ...superAdminRoutes]

  return (
    <Router>
      <Alert.Component />
      <Modal.Component />

      <Routes>
        <Route path='/' element={<Redirect />} />

        {routes.map(({ path, Component, Super, auth }, i) => (
          <Route
            key={i}
            path={path}
            element={
              auth ? (
                <Auth>
                  <Super>
                    <Component />
                  </Super>
                </Auth>
              ) : Super ? (
                <Super>
                  <Component />
                </Super>
              ) : (
                <Component />
              )
            }
          />
        ))}

        <Route path='*' element={<Redirect />} />
      </Routes>
    </Router>
  )
}

const Redirect = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/login', { replace: true })
  }, [navigate])
  return null
}

const Auth = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const authenticated = useRef(false)
  const processing = useRef()

  const authTest = useCallback(async () => {
    if (processing.current) return

    processing.current = true

    if (!authenticated.current) {
      const signInAPI = await api.auth.admin.getAdmin({})
      if (signInAPI.code === 201) {
        authenticated.current = true
        setLoading(false)
      } else {
        window.localStorage.clear()
        navigate('/login', { replace: true })
      }
    } else setLoading(false)
    processing.current = false
  }, [navigate])

  const logOutUserAdmin = useCallback(async () => {
    if (processing.current) return
    processing.current = true
    setLoading(true)

    const logOut = await api.auth.user.logOut({})

    if (logOut.code === 201) {
      window.localStorage.removeItem('authorization')
      window.localStorage.removeItem('userData')
    }

    setLoading(false)
    processing.current = false
  }, [])

  useEffect(() => {
    if (window.location.pathname.startsWith('/admin') && window.localStorage.getItem('authorization')) logOutUserAdmin()

    if (window.location.pathname.startsWith('/userAdmin') && !window.localStorage.getItem('authorization'))
      navigate('/login', { replace: true })

    if (!window.localStorage.getItem('authentication')) navigate('/login', { replace: true })
    else authTest()
  }, [authTest, navigate, logOutUserAdmin])

  return loading ? <Loader /> : <div style={{ overflow: 'hidden' }}>{children}</div>
}
