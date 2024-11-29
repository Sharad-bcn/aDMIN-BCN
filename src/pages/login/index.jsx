import { Alert, Form, Input } from 'components'
import s from './styles.module.scss'
import images from 'images'
import { head } from 'helpers'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from 'api'
import md5 from 'md5'

export default function Main() {
  const [mobile, setMobile] = useState('')
  const [pin, setPin] = useState('')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const processing = useRef()
  const Navigate = useNavigate()
  const isAuthenticated = window.localStorage.getItem('authentication')

  useEffect(() => {
    if (isAuthenticated) Navigate('/admin/dashboard/features', { replace: true })
  }, [isAuthenticated, Navigate])

  useEffect(() => {
    head({ title: 'Login | BCN' })
  }, [])

  const loginHandler = async e => {
    e.preventDefault()
    if (!mobile) return Alert.error('Contact no. is required!')
    if (!pin) return Alert.error('Pin is required!')

    if (mobile.length !== 10) {
      Alert.error('Enter Correct Contact No.!')
      return
    }

    if (processing.current) return
    processing.current = true
    setLoading(true)
    Alert.success('Logging In')

    const loginAdmin = await api.auth.admin.logIn({ phoneNo: mobile.trim(), pin: md5(pin.trim()) })

    if (loginAdmin.code === 201) {
      Alert.success(loginAdmin.message)
      window.localStorage.setItem('authentication', loginAdmin.payload.authentication)
      window.localStorage.setItem('adminData', JSON.stringify(loginAdmin.payload.adminData))
      Navigate('/admin/dashboard/features', { replace: true })
    } else {
      Alert.warn(loginAdmin.message)
    }
    setMobile('')
    setPin('')
    setLoading(false)
    processing.current = false
  }

  return (
    <div className={s.main}>
      <div className={s.loginOuter}>
        <div className={s.login + ' indent'}>
          <Form onSubmit={loginHandler} className={s.loginForm}>
            <Link to='/' className={s.logo}>
              <img src={images.logo} alt='' />
            </Link>
            <Input.Classic
              type='number'
              iconLeft='smartphone'
              placeholder='MOBILE'
              value={mobile}
              onChange={e => {
                if (e.target.value.length <= 10) setMobile(e.target.value)
              }}
            />
            <Input.Classic
              type={visible ? 'number' : 'password'}
              iconLeft='lock'
              iconRight={!visible ? 'visibility' : 'visibility_off'}
              onRightIconClick={() => setVisible(!visible)}
              placeholder='PIN'
              value={pin}
              onChange={e => {
                if (e.target.value.length <= 6) setPin(e.target.value)
              }}
            />
            <div className={s.button}>
              <button
                onClick={loginHandler}
                type='submit'
                disabled={loading}
                style={{ opacity: loading ? '0.8' : '1' }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className={s.forgotPin}>
              <Link to='/signUp'>Register Now</Link>
              <Link to='/'>Forgot Pin?</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
