import { head, imageCompressor, removeFromS3, uploadToS3 } from 'helpers'
import s from './styles.module.scss'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Alert, ImageTag, Input, Layouts, Loader, TextArea, UploadImages } from 'components'
import DashBoardNav from '../dashboardNav'
import { Link } from 'react-router-dom'
import * as api from 'api'

export default function Main() {
  const [bannerImages, setBannerImages] = useState([])
  const [bannerImagesUrls, setBannerImagesUrls] = useState([])
  const [oldBannerImagesRemoved, setOldBannerImagesRemoved] = useState([])
  const [oldBannerImagesUrls, setOldBannerImagesUrls] = useState([])
  const [link, setLink] = useState('')
  const [links, setLinks] = useState([])
  const [loadingStatus, setLoadingStatus] = useState('Loading...')
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingProgress, setUploadingProgress] = useState(0)
  const [aboutUs, setAboutUs] = useState('')
  const [privacyPolicy, setPrivacyPolicy] = useState('')
  const [termsAndConditions, setTermsAndConditions] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [email, setEmail] = useState('')
  const [facebookLink, setFacebookLink] = useState('')
  const [whatsappLink, setWhatsappLink] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const processing = useRef(false)

  useEffect(() => {
    head({ title: 'Dashboard Demographics | BCN' })
  }, [])

  const handleRemoveBannerImage = i => {
    let newSelectedImages = [...bannerImages]
    let newImageUrls = [...bannerImagesUrls]
    newSelectedImages.splice(i, 1)
    newImageUrls.splice(i, 1)
    URL.revokeObjectURL(bannerImagesUrls[i])
    setBannerImages(newSelectedImages)
    setBannerImagesUrls(newImageUrls)
  }

  const handleRemoveOldBannerImage = i => {
    let newImageUrls = [...oldBannerImagesUrls]
    let newRemovedImages = [...oldBannerImagesRemoved]
    newRemovedImages.push(oldBannerImagesUrls[i])
    setOldBannerImagesRemoved(newRemovedImages)
    newImageUrls.splice(i, 1)
    setOldBannerImagesUrls(newImageUrls)
  }

  const handleBannerImagesChange = async e => {
    setIsUploading(true)
    const files = Array.prototype.slice.call(e.target.files)

    if (files.length > 6 - (bannerImagesUrls.length + oldBannerImagesUrls.length)) {
      Alert.warn('Upto 6 images allowed')
      setIsUploading(false)
      return
    }

    setUploadingProgress(10)

    if (files.length > 0) {
      const newSelectedImages = bannerImages
      const newImageUrls = bannerImagesUrls
      setUploadingProgress(30)
      const compressedFiles = await imageCompressor(files, 'listing')
      setUploadingProgress(70)

      for (let i = 0; i < compressedFiles.length; i++) {
        const file = compressedFiles[i]
        const imageUrl = URL.createObjectURL(file)
        newSelectedImages.push(file)
        newImageUrls.push(imageUrl)
      }

      setBannerImages(newSelectedImages)
      setBannerImagesUrls(newImageUrls)
      setUploadingProgress(100)
      setIsUploading(false)
    }
  }

  const getDemographics = useCallback(async () => {
    if (processing.current) return
    processing.current = true
    setLoading(true)

    const fetchDemographics = await api.admin.demographics.fetch({})

    if (fetchDemographics.code === 201) {
      let result = fetchDemographics.payload.demographics
      setOldBannerImagesUrls(result.banners)
      setLinks(result.links)
      setAboutUs(result.aboutUs)
      setPrivacyPolicy(result.privacyPolicy)
      setTermsAndConditions(result.termsAndConditions)
      setPhoneNo(result.phoneNo ? result.phoneNo.toString() : '')
      setEmail(result.email)
      setFacebookLink(result.facebookLink)
      setWhatsappLink(result.whatsappLink)
      setInstagramLink(result.instagramLink)
    } else {
      Alert.error(fetchDemographics.message)
    }

    setLoading(false)
    processing.current = false
  }, [])

  useEffect(() => {
    getDemographics()
  }, [getDemographics])

  const discardAll = () => {
    if (bannerImagesUrls.length) {
      bannerImagesUrls.forEach(imageUrl => {
        URL.revokeObjectURL(imageUrl)
      })
    }
    setBannerImages([])
    setBannerImagesUrls([])
    setOldBannerImagesUrls([])
    setOldBannerImagesRemoved([])
    setAboutUs('')
    setPrivacyPolicy('')
    setTermsAndConditions('')
    setPhoneNo('')
    setEmail('')
    setFacebookLink('')
    setWhatsappLink('')
    setInstagramLink('')
  }

  const saveHandler = async () => {
    if (phoneNo && phoneNo.length !== 10) {
      Alert.warn('Invalid Contact Number!')
      return
    }

    if (processing.current) return
    processing.current = true
    Alert.success('Saving Demographics info...')
    setLoading(true)
    setLoadingStatus('Saving...')

    const saveDemographics = await api.admin.demographics.update({
      banners: [...oldBannerImagesUrls, ...bannerImages.map((image, i) => image.name)],
      links,
      aboutUs,
      privacyPolicy,
      termsAndConditions,
      phoneNo,
      email,
      instagramLink,
      facebookLink,
      whatsappLink
    })

    if (saveDemographics.code === 201) {
      if (bannerImages.length) {
        let res = []
        for (let i = 0; i < bannerImages.length; i++) {
          res.push(await uploadToS3(bannerImages[i].name, bannerImages[i]))
        }

        for (let i = 0; i < bannerImagesUrls.length; i++) {
          URL.revokeObjectURL(bannerImagesUrls[i])
        }
      }

      if (oldBannerImagesRemoved.length) {
        let res = []

        for (let i = 0; i < oldBannerImagesRemoved.length; i++) {
          res.push(await removeFromS3(oldBannerImagesRemoved[i]))
        }
      }
      window.location.reload()
    } else {
      Alert.error(saveDemographics.message)
    }

    setLoading(false)
    processing.current = false
  }

  const addLink = () => {
    let newLink = link
    if (newLink) {
      try {
        new URL(newLink)
      } catch (error) {
        Alert.warn('Enter Valid Link!')
        setLink('')
        return
      }

      let isValidLink = new URLSearchParams(new URL(newLink).search).get('v')
      if (!isValidLink) {
        if (link.includes('youtu.be')) {
          // Convert youtu.be link to www.youtube.com/watch?v= format
          isValidLink = link.split('/').pop().split('?')[0]
          newLink = `https://www.youtube.com/watch?v=${isValidLink}`
          setLink(newLink)
        } else {
          Alert.warn('Enter Valid Link!')
          setLink('')
          return
        }
      }

      let newLinks = [...links]
      const isLinkAlreadyExists = newLinks.some(
        youtubeLink =>
          new URLSearchParams(new URL(youtubeLink).search).get('v') ===
          new URLSearchParams(new URL(newLink).search).get('v')
      )
      if (!isLinkAlreadyExists) {
        newLinks.push(newLink)
        setLinks(newLinks)
        setLink('')
      } else {
        Alert.warn('Link Already Exists!')
      }
    }
  }

  return (
    <div className={s.main}>
      <div className={s.demographics}>
        <Layouts.Classic title='Dashboard'>
          <div className={s.headerBottom}>
            <Link className={s.addTestimonies} to={'./testimonies'}>
              <span className='material-icons-outlined'>add_circle_outline</span> Testimonies
            </Link>
            <Link className={s.addFaq} to={'./faq'}>
              <span className='material-icons-outlined'>add_circle_outline</span> Faq's
            </Link>
          </div>
        </Layouts.Classic>
        {!loading && (
          <div className={s.content + ' innerScrollX'}>
            <DashBoardNav />
            <div className={s.banners}>
              <UploadImages.Multiple
                label='Upload Banners'
                listingImagesUrls={bannerImagesUrls}
                oldListingImagesUrls={oldBannerImagesUrls}
                handleListingImagesChange={handleBannerImagesChange}
                handleRemoveImage={handleRemoveBannerImage}
                handleRemoveOldImage={handleRemoveOldBannerImage}
                max={6}
              />
              {!!isUploading && (
                <Loader
                  message={uploadingProgress + '% uploaded'}
                  color='var(--c-primary)'
                  colorText='var(--c-primary)'
                />
              )}
            </div>
            <Input.Classic
              label='Upload Youtube Link'
              type='text'
              iconLeft='link'
              iconRight='add_circle_outline'
              onRightIconClick={addLink}
              placeholder='Enter Youtube Link'
              value={link}
              onChange={e => setLink(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault()
                    addLink()
                  }
                }
              }}
            />
            {links.length !== 0 && (
              <div className={s.links}>
                <div className={s.linksHeading}>Links</div>
                <div className={s.addedLinks}>
                  {links.map((link, i) => (
                    <div className={s.link} key={i}>
                      <ImageTag
                        src={`https://img.youtube.com/vi/${new URLSearchParams(new URL(link).search).get(
                          'v'
                        )}/hqdefault.jpg`}
                        alt=''
                      />
                      <span className='material-icons-outlined' onClick={() => setLinks(links.filter(x => x !== link))}>
                        close
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <TextArea.Classic
              label='About Us (Max. 1000 words)'
              iconLeft='description'
              placeholder='Enter About Us...'
              value={aboutUs}
              rows='10'
              onChange={e => {
                if (e.target.value.trim().split(/\s+/).length <= 1000) setAboutUs(e.target.value)
              }}
            />
            <TextArea.Classic
              label='Privacy Policy (Max. 1000 words)'
              iconLeft='description'
              placeholder='Enter Privacy Policy...'
              value={privacyPolicy}
              rows='10'
              onChange={e => {
                if (e.target.value.trim().split(/\s+/).length <= 1000) setPrivacyPolicy(e.target.value)
              }}
            />
            <TextArea.Classic
              label='Terms & Conditions (Max. 1000 words)'
              iconLeft='description'
              placeholder='Enter Terms & Conditions...'
              value={termsAndConditions}
              rows='10'
              onChange={e => {
                if (e.target.value.trim().split(/\s+/).length <= 1000) setTermsAndConditions(e.target.value)
              }}
            />
            <div className={s.websiteContact}>
              <div className={s.label}>Contact Us</div>
              <Input.Classic
                label='Contact Number*'
                type='number'
                iconLeft='call'
                placeholder='Enter Contact Number'
                value={phoneNo}
                onChange={e => {
                  if (e.target.value.length <= 10) setPhoneNo(e.target.value)
                }}
              />
              <Input.Classic
                label='Email*'
                type='text'
                iconLeft='email'
                placeholder='Enter Email'
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                }}
              />
            </div>
            <div className={s.websiteSocials}>
              <div className={s.label}>Socials</div>
              <Input.Classic
                label='Instagram Link'
                type='text'
                iconLeft='link'
                placeholder='Enter Instagram Link'
                value={instagramLink}
                onChange={e => {
                  setInstagramLink(e.target.value)
                }}
              />
              <Input.Classic
                label='Facebook Link'
                type='text'
                iconLeft='link'
                placeholder='Enter Facebook Link'
                value={facebookLink}
                onChange={e => {
                  setFacebookLink(e.target.value)
                }}
              />
              <Input.Classic
                label='Whatsapp Link'
                type='text'
                iconLeft='link'
                placeholder='Enter Whatsapp Link'
                value={whatsappLink}
                onChange={e => {
                  setWhatsappLink(e.target.value)
                }}
              />
            </div>

            <div className={s.actionButtons}>
              <div className={s.discard} onClick={discardAll}>
                <span className='material-icons-outlined'>remove_circle_outline</span>Discard
              </div>
              <div className={s.saveHandler} onClick={saveHandler}>
                <span className='material-icons-outlined'>save</span>Save
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
