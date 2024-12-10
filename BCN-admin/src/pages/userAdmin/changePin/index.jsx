import { Alert, Form, Input, Layouts } from 'components'
import s from './styles.module.scss'
import { head } from 'helpers'
import { useEffect, useRef, useState } from 'react'
import * as api from 'api'
import md5 from 'md5'

export default function Main() {
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [oldPinVisible, setOldPinVisible] = useState(false)
  const [newPinVisible, setNewPinVisible] = useState(false)
  const [confirmPin, setConfirmPin] = useState('')
  const processing = useRef(false)

  useEffect(() => {
    head({ title: 'Change Pin | BCN' })
  }, [])

  const changePinHandler = async () => {
    if (!oldPin) {
      Alert.error('Old Pin is required!')
      return
    }

    if (oldPin.length !== 6) {
      Alert.error('Enter 6 digit old pin')
      return
    }

    if (!newPin) {
      Alert.error('New Pin is required!')
      return
    }

    if (newPin.length !== 6) {
      Alert.error('Enter 6 digit new pin')
      return
    }

    if (!confirmPin) {
      Alert.error('Confirm Pin is required!')
      return
    }

    if (confirmPin.length !== 6) {
      Alert.error('Enter 6 digit confirm pin')
      return
    }

    if (newPin !== confirmPin) {
      Alert.error('Pin not matched!')
      return
    }

    if (processing.current) return
    processing.current = true
    const changePin = await api.userAdmin.user.changePin({
      oldPin: md5(oldPin),
      newPin: md5(newPin)
    })

    if (changePin.code === 200) {
      Alert.success(changePin.message)
    } else {
      Alert.error(changePin.message)
    }

    processing.current = false
  }

  return (
    <div className={s.main}>
      <div className={s.changePinOuter}>
        {/* <div className={s.header}> */}
        <Layouts.Classic title='Change Pin'>
          <div className={s.button}>
            <button onClick={changePinHandler}>Save</button>
          </div>
        </Layouts.Classic>
        {/* </div> */}
        <div className={s.changePin + ' innerScrollX'}>
          <Form className={s.changePinForm}>
            <Input.Classic
              type={oldPinVisible ? 'number' : 'password'}
              iconLeft='pin'
              iconRight={!oldPinVisible ? 'visibility' : 'visibility_off'}
              onRightIconClick={() => setOldPinVisible(!oldPinVisible)}
              label='Old Pin'
              placeholder='Enter Old Pin (6 Digits)'
              value={oldPin}
              onChange={e => setOldPin(e.target.value)}
            />
            <Input.Classic
              type={newPinVisible ? 'number' : 'password'}
              iconLeft='pin'
              iconRight={!newPinVisible ? 'visibility' : 'visibility_off'}
              onRightIconClick={() => setNewPinVisible(!newPinVisible)}
              label='New Pin'
              placeholder='Enter New Pin (6 Digits)'
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
            />
            <div className={s.confirm}>
              <Input.Classic
                type='number'
                label='Confirm Pin'
                iconLeft='pin'
                placeholder='Confirm Pin'
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value)}
              />
              {oldPin &&
                newPin &&
                confirmPin &&
                (newPin === confirmPin ? (
                  <span className='material-icons' style={{ color: 'var(--c-green)' }}>
                    check_circle
                  </span>
                ) : (
                  <span className='material-icons' style={{ color: 'var(--c-red)' }}>
                    cancel
                  </span>
                ))}
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
