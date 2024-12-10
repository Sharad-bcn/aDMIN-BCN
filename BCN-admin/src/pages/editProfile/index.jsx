import { Alert, Input, Layouts, Loader, UploadImages } from 'components'
import s from './styles.module.scss'
import { useCallback, useEffect, useRef, useState } from 'react'
import { head, imageCompressor, removeFromS3, uploadToS3 } from 'helpers'
import images from 'images'
import { Link, useNavigate } from 'react-router-dom'
import * as api from 'api'
import md5 from 'md5'
const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

export default function Main() {
  const [adminProfilePic, setAdminProfilePic] = useState()
  const [adminOldProfilePic, setAdminOldProfilePic] = useState()
  const [adminProfilePicUrl, setAdminProfilePicUrl] = useState(images.Profile)
  const [loadingStatus, setLoadingStatus] = useState('Loading...')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [pin, setPin] = useState('')
  const [visible, setVisible] = useState(false)
  const [confirmPin, setConfirmPin] = useState('')
  const [confirmPinVisible, setConfirmPinVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const isAddAdminRoute = window.location.pathname.endsWith('/addAdmin')
  const processing = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    head({ title: (!!isAddAdminRoute ? 'Add Admin ' : 'Edit Admin Profile') + ' | BCN' })
  }, [isAddAdminRoute])

  const discardAll = () => {
    URL.revokeObjectURL(adminProfilePicUrl)
    setAdminProfilePic()
    setAdminProfilePicUrl(images.Profile)
  }

  const handleAdminProfilePicChange = async e => {
    const file = Array.prototype.slice.call(e.target.files)
    if (file) {
      let compressedFile = await imageCompressor(file, 'logo')

      if (compressedFile[0]) {
        const imageUrl = URL.createObjectURL(compressedFile[0])
        setAdminProfilePic(compressedFile[0])
        setAdminProfilePicUrl(imageUrl)
      }
    }
  }

  const getAdmin = useCallback(async () => {
    if (processing.current) return
    processing.current = true
    setLoading(true)

    const getAdminData = await api.admin.adminControls.fetch({})

    if (getAdminData.code === 200) {
      let admin = getAdminData.payload.getAdmin
      setAdminProfilePicUrl(admin.profilePic ? IMAGE_HOST + admin.profilePic : '')
      setAdminOldProfilePic(admin.profilePic ? admin.profilePic : '')
      setFirstName(admin.firstName)
      setLastName(admin.lastName)
      setEmail(admin.email)
      setMobile(admin.phoneNo.toString())
    } else {
      Alert.error(getAdminData.message)
    }

    setLoading(false)
    processing.current = false
  }, [])

  useEffect(() => {
    if (!isAddAdminRoute) getAdmin()
  }, [isAddAdminRoute, getAdmin])

  const saveHandler = async () => {
    if (!firstName) {
      Alert.error('First Name is Required!')
      return
    }

    if (!lastName) {
      Alert.error('Last Name is Required!')
      return
    }

    if (!mobile) {
      Alert.error('Contact No is Required!')
      return
    }

    if (mobile.length !== 10) {
      Alert.error('Enter Correct Contact No.!')
      return
    }

    if (processing.current) return
    processing.current = true
    Alert.success('Saving admin info...')
    setLoading(true)
    setLoadingStatus('Saving...')

    const editAdminProfile = await api.admin.adminControls.update({
      profilePic: adminProfilePic ? adminProfilePic.name : adminOldProfilePic ? adminOldProfilePic : '',
      firstName,
      lastName,
      email,
      phoneNo: mobile
    })

    if (editAdminProfile.code === 201) {
      let res = ''
      let removePrevious = ''

      if (adminProfilePic && adminOldProfilePic) {
        removePrevious = await removeFromS3(adminOldProfilePic)
      }

      if (adminProfilePic) {
        res = await uploadToS3(adminProfilePic.name, adminProfilePic)
        // console.log(res)
        let adminData = JSON.parse(window.localStorage.getItem('adminData'))
        adminData.profilePic = adminProfilePic.name
        localStorage.setItem('adminData', JSON.stringify(adminData))
        URL.revokeObjectURL(adminProfilePicUrl)
        setAdminProfilePicUrl(res)
        setAdminOldProfilePic(adminProfilePic.name)
        setAdminProfilePic()
      }

      Alert.success(editAdminProfile.message)
    } else {
      // Alert.error('Some Error Occured')
    }

    setLoading(false)
    processing.current = false
  }

  const addHandler = async () => {
    if (!firstName) {
      Alert.error('First Name is Required!')
      return
    }

    if (!lastName) {
      Alert.error('Last Name is Required!')
      return
    }

    if (!mobile) {
      Alert.error('Contact No is Required!')
      return
    }

    if (mobile.length !== 10) {
      Alert.error('Enter Correct Contact No.!')
      return
    }

    if (!pin) {
      Alert.warn('Pin is required!')
      return
    }

    if (pin.length !== 6) {
      Alert.warn('Enter 6 digit pin')
      return
    }

    if (pin !== confirmPin) {
      Alert.warn('Pin not matched!')
      return
    }

    if (processing.current) return
    processing.current = true
    Alert.success('Adding admin info...')
    setLoading(true)
    setLoadingStatus('Adding...')

    const AddAdmin = await api.admin.adminControls.create({
      profilePic: adminProfilePic ? adminProfilePic.name : '',
      firstName,
      lastName,
      email,
      pin: md5(pin),
      phoneNo: mobile
    })

    if (AddAdmin.code === 201) {
      let res = ''

      if (adminProfilePic) {
        res = await uploadToS3(adminProfilePic.name, adminProfilePic)
        // console.log(res)
        URL.revokeObjectURL(adminProfilePicUrl)
        setAdminProfilePicUrl(res)
        setAdminProfilePic()
      }
      Alert.success(AddAdmin.message)
      navigate(-1)
    } else {
      Alert.error(AddAdmin.message)
    }

    setLoading(false)
    processing.current = false
  }

  return (
    <div className={s.main}>
      <div className={s.editProfile}>
        <Layouts.Classic title={!!isAddAdminRoute ? 'Add new admin ' : 'Edit profile'} />
        {!loading && (
          <div className={s.content + ' innerScrollX'}>
            <div className={s.form}>
              <UploadImages.Single
                userLogoUrl={adminProfilePicUrl}
                handleUserLogoChange={handleAdminProfilePicChange}
              />
              <div className={s.rows + ' row'}>
                <Input.Classic
                  label='First Name'
                  type='text'
                  iconLeft='perm_identity'
                  placeholder='Enter First Name'
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
                <Input.Classic
                  label='Last Name'
                  type='text'
                  iconLeft='perm_identity'
                  placeholder='Enter Last Name'
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
              <div className={s.rows + ' row'}>
                <Input.Classic
                  label='Email'
                  type='text'
                  iconLeft='email'
                  placeholder='Enter Email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Input.Classic
                  label='Contact Number'
                  type='number'
                  iconLeft='call'
                  placeholder='Enter Contact Number'
                  value={mobile}
                  onChange={e => {
                    if (e.target.value.length <= 10) setMobile(e.target.value)
                  }}
                />
              </div>
              {!!isAddAdminRoute && (
                <div className={s.rows + ' row'}>
                  <Input.Classic
                    label='Enter Pin'
                    type={visible ? 'number' : 'password'}
                    iconLeft='lock'
                    iconRight={!visible ? 'visibility' : 'visibility_off'}
                    onRightIconClick={() => setVisible(!visible)}
                    placeholder='Enter Pin'
                    value={pin}
                    onChange={e => {
                      if (e.target.value.length <= 6) setPin(e.target.value)
                    }}
                  />
                  <div className={s.confirmOuter}>
                    <div className={s.confirmLabel}>Confirm Pin</div>
                    <div className={s.confirm}>
                      <Input.Classic
                        type={confirmPinVisible ? 'number' : 'password'}
                        iconLeft='lock'
                        iconRight={!confirmPinVisible ? 'visibility' : 'visibility_off'}
                        onRightIconClick={() => setConfirmPinVisible(!confirmPinVisible)}
                        placeholder='Enter Pin'
                        value={confirmPin}
                        onChange={e => setConfirmPin(e.target.value)}
                      />
                      {pin &&
                        confirmPin &&
                        (pin === confirmPin ? (
                          <span className='material-icons' style={{ color: 'var(--c-green)' }}>
                            check_circle
                          </span>
                        ) : (
                          <span className='material-icons' style={{ color: 'var(--c-red)' }}>
                            cancel
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              <div className={s.actionButtons}>
                {!isAddAdminRoute && (
                  <Link to='/admin/changePin'>
                    <span className='material-icons-outlined'>lock</span>Change Pin
                  </Link>
                )}
                <div onClick={discardAll} className={s.discard}>
                  <span className='material-icons-outlined'>remove_circle_outline</span>
                  Discard
                </div>
                <div onClick={!!isAddAdminRoute ? addHandler : saveHandler} className={s.save}>
                  <span className='material-icons-outlined'>{!!isAddAdminRoute ? 'add_circle_outline' : 'save'}</span>
                  {!!isAddAdminRoute ? 'Add' : 'Save'}
                </div>
              </div>
            </div>
          </div>
        )}
        {!!loading && (
          <div className={s.loader}>
            <Loader message={loadingStatus} color='var(--c-primary)' colorText='var(--c-primary)' />
          </div>
        )}
      </div>
    </div>
  )
}
