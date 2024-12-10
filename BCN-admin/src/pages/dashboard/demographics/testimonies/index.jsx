import { Alert, Input, Layouts, Loader, TextArea, UploadImages } from 'components'
import s from './styles.module.scss'
import DashBoardNav from '../../dashboardNav'
import { useState, useRef, useEffect, useCallback } from 'react'
import { head, imageCompressor, removeFromS3, uploadToS3 } from 'helpers'
import * as api from 'api'
import { useNavigate } from 'react-router-dom'
const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

export default function Main() {
  const [loadingStatus, setLoadingStatus] = useState('Loading...')
  const [loading, setLoading] = useState(false)
  const [oldTestimonies, setOldTestimonies] = useState([])
  const [testimonies, setTestimonies] = useState([])
  const [testimoniesImages, setTestimoniesImages] = useState([null, null, null])
  const [testimoniesOldImages, setTestimoniesOldImages] = useState([])
  const [oldTestimoniesImagesRemoved, setOldTestimoniesImagesRemoved] = useState([])
  const [testimoniesImagesUrls, setTestimoniesImagesUrls] = useState([null, null, null])
  const [newTestimoniesImages, setNewTestimoniesImages] = useState([])
  const [newTestimoniesImagesUrls, setNewTestimoniesImagesUrls] = useState([])
  const navigate = useNavigate()
  const processing = useRef(false)

  const oldTestimonyChangeHandler = async (value, index) => {
    let newTestimonies = [...oldTestimonies]
    newTestimonies[index] = {
      ...newTestimonies[index],
      testimony: value
    }
    setOldTestimonies(newTestimonies)
  }

  const oldTestimonyNameChangeHandler = async (value, index) => {
    let newTestimonies = [...oldTestimonies]
    newTestimonies[index] = {
      ...newTestimonies[index],
      name: value
    }
    setOldTestimonies(newTestimonies)
  }

  const oldTestimonyDesignationChangeHandler = async (value, index) => {
    let newTestimonies = [...oldTestimonies]
    newTestimonies[index] = {
      ...newTestimonies[index],
      designation: value
    }
    setOldTestimonies(newTestimonies)
  }

  const oldTestimoniesPicChangeHandler = async (e, index) => {
    const file = Array.prototype.slice.call(e.target.files)
    if (file) {
      let compressedFile = await imageCompressor(file, 'logo')

      if (compressedFile[0]) {
        const imageUrl = URL.createObjectURL(compressedFile[0])
        let newTestimoniesImages = [...testimoniesImages]
        newTestimoniesImages[index] = compressedFile[0]
        setTestimoniesImages(newTestimoniesImages)
        let newTestimoniesImagesUrls = [...testimoniesImagesUrls]
        newTestimoniesImagesUrls[index] = imageUrl
        setTestimoniesImagesUrls(newTestimoniesImagesUrls)
      }
    }
  }

  const oldTestimonyRemoveHandler = async index => {
    let newRemovedImages = [...oldTestimoniesImagesRemoved]
    newRemovedImages.push(testimoniesImagesUrls[index])
    setOldTestimoniesImagesRemoved(newRemovedImages)
    let newTestimonies = oldTestimonies.filter((x, i) => i !== index)
    setOldTestimonies(newTestimonies)
    let newImages = testimoniesImages.filter((x, i) => i !== index)
    setTestimoniesImages(newImages)
    let newUrls = testimoniesImagesUrls.filter((x, i) => i !== index)
    setTestimoniesImagesUrls(newUrls)
  }

  const testimonyChangeHandler = async (value, index) => {
    let newTestimonies = [...testimonies]
    newTestimonies[index] = {
      ...newTestimonies[index],
      testimony: value
    }
    setTestimonies(newTestimonies)
  }

  const testimonyNameChangeHandler = async (value, index) => {
    let newTestimonies = [...testimonies]
    newTestimonies[index] = {
      ...newTestimonies[index],
      name: value
    }
    setTestimonies(newTestimonies)
  }

  const testimonyDesignationChangeHandler = async (value, index) => {
    let newTestimonies = [...testimonies]
    newTestimonies[index] = {
      ...newTestimonies[index],
      designation: value
    }
    setTestimonies(newTestimonies)
  }

  const testimoniesPicChangeHandler = async (e, index) => {
    const file = Array.prototype.slice.call(e.target.files)
    if (file) {
      let compressedFile = await imageCompressor(file, 'logo')

      if (compressedFile[0]) {
        const imageUrl = URL.createObjectURL(compressedFile[0])
        let newImages = [...newTestimoniesImages]
        newImages[index] = compressedFile[0]
        setNewTestimoniesImages(newImages)
        let newImagesUrls = [...newTestimoniesImagesUrls]
        newImagesUrls[index] = imageUrl
        setNewTestimoniesImagesUrls(newImagesUrls)
      }
    }
  }

  const testimonyRemoveHandler = async index => {
    let newTestimonies = testimonies.filter((x, i) => i !== index)
    setTestimonies(newTestimonies)
    let newImages = newTestimoniesImages.filter((x, i) => i !== index)
    setNewTestimoniesImages(newImages)
    let newUrls = newTestimoniesImagesUrls.filter((x, i) => i !== index)
    setNewTestimoniesImagesUrls(newUrls)
  }

  const getTestimonies = useCallback(async () => {
    if (processing.current) return
    processing.current = true
    setLoading(true)

    const fetchTestimonies = await api.admin.testimony.fetch({})

    if (fetchTestimonies.code === 201) {
      let resultTestimonies = fetchTestimonies.payload.testimonies
      setOldTestimonies(resultTestimonies)
      setTestimoniesImages(Array.from({ length: resultTestimonies.length }, () => null))
      setTestimoniesImagesUrls(
        resultTestimonies.map(testimony => (testimony.image ? IMAGE_HOST + testimony.image : null))
      )
      setTestimoniesOldImages(resultTestimonies.map(testimony => (testimony.image ? testimony.image : '')))

      if (!resultTestimonies.length) {
        setTestimonies([
          {
            testimony: '',
            image: '',
            name: '',
            designation: ''
          },
          {
            testimony: '',
            image: '',
            name: '',
            designation: ''
          },
          {
            testimony: '',
            image: '',
            name: '',
            designation: ''
          }
        ])
        setNewTestimoniesImages([null, null, null])
        setNewTestimoniesImagesUrls([null, null, null])
      }
    } else {
      Alert.error(fetchTestimonies.message)
    }

    setLoading(false)
    processing.current = false
  }, [])

  useEffect(() => {
    getTestimonies()
  }, [getTestimonies])

  const saveHandler = async () => {
    if (oldTestimonies.length) {
      let isTestimonyEmpty = false

      for (const obj of oldTestimonies) {
        if (
          !obj.testimony ||
          obj.testimony.trim() === '' ||
          !obj.name ||
          obj.name.trim() === '' ||
          !obj.designation ||
          obj.designation.trim() === ''
        )
          isTestimonyEmpty = true
      }

      if (isTestimonyEmpty) {
        Alert.warn('Testimony is Empty!')
        return
      }
    }

    if (testimonies.length) {
      let isTestimonyEmpty = false

      for (const obj of testimonies) {
        if (
          !obj.testimony ||
          obj.testimony.trim() === '' ||
          !obj.name ||
          obj.name.trim() === '' ||
          !obj.designation ||
          obj.designation.trim() === ''
        )
          isTestimonyEmpty = true
      }

      if (isTestimonyEmpty) {
        Alert.warn('Testimony is Empty!')
        return
      }
    }

    if (processing.current) return
    processing.current = true
    Alert.success('Saving Testimonies info...')
    setLoading(true)
    setLoadingStatus('Saving...')

    let newTestimonies = [...testimonies]
    let oldEditedTestimonies = [...oldTestimonies]

    for (let i = 0; i < newTestimoniesImages.length; i++) {
      if (newTestimoniesImages[i] !== null) {
        newTestimonies[i].image = newTestimoniesImages[i].name
      }
    }

    if (!testimoniesImages.every(item => item === null)) {
      for (let i = 0; i < testimoniesImages.length; i++) {
        if (testimoniesImages[i] !== null) {
          oldEditedTestimonies[i].image = testimoniesImages[i].name
        }
      }
    }

    const saveTestimonies = await api.admin.testimony.update({
      oldTestimonies: oldEditedTestimonies,
      testimonies: newTestimonies
    })

    if (saveTestimonies.code === 201) {
      if (!newTestimoniesImages.every(item => item === null)) {
        let res = []
        for (let i = 0; i < newTestimoniesImages.length; i++) {
          if (newTestimoniesImages[i] !== null)
            res.push(await uploadToS3(newTestimoniesImages[i].name, newTestimoniesImages[i]))
        }

        for (let i = 0; i < newTestimoniesImagesUrls.length; i++) {
          if (newTestimoniesImages[i] !== null) URL.revokeObjectURL(newTestimoniesImagesUrls[i])
        }
      }

      if (!testimoniesImages.every(item => item === null)) {
        let res = []
        for (let i = 0; i < testimoniesImages.length; i++) {
          if (testimoniesImages[i] !== null) res.push(await uploadToS3(testimoniesImages[i].name, testimoniesImages[i]))
        }

        for (let i = 0; i < testimoniesImagesUrls.length; i++) {
          if (testimoniesImages[i] !== null) URL.revokeObjectURL(testimoniesImagesUrls[i])
        }

        if (testimoniesOldImages.length) {
          let res = []

          for (let i = 0; i < testimoniesOldImages.length; i++) {
            if (testimoniesImages[i] !== null) res.push(await removeFromS3(testimoniesOldImages[i]))
          }
        }
      }

      if (oldTestimoniesImagesRemoved.length) {
        let res = []

        for (let i = 0; i < oldTestimoniesImagesRemoved.length; i++) {
          res.push(await removeFromS3(oldTestimoniesImagesRemoved[i]))
        }
      }

      setTestimoniesOldImages([])
      setTestimoniesImagesUrls([])
      setTestimoniesImages([])
      setNewTestimoniesImages([])
      Alert.success(saveTestimonies.message)
      navigate(-1)
    } else {
      Alert.error(saveTestimonies.message)
    }

    setLoading(false)
    processing.current = false
  }

  useEffect(() => {
    head({ title: 'Testimonies | BCN' })
  }, [])

  return (
    <div className={s.main}>
      <div className={s.testimoniesOuter}>
        <Layouts.Classic title='Testimonies'>
          <div className={s.headerBottom}>
            <div className={s.addTestimony} onClick={saveHandler}>
              <span className='material-icons-outlined'>save</span> Save
            </div>
          </div>
        </Layouts.Classic>

        {!loading && (
          <div className={s.content + ' innerScrollX'}>
            <DashBoardNav />
            <div className={s.testimonies}>
              <div className={s.label}>Testimony</div>
              {!!oldTestimonies.length &&
                oldTestimonies.map((testimony, i) => (
                  <Testimony
                    key={i}
                    index={i}
                    testimonies={oldTestimonies}
                    testimoniesImagesUrls={testimoniesImagesUrls}
                    testimonyChangeHandler={oldTestimonyChangeHandler}
                    testimonyNameChangeHandler={oldTestimonyNameChangeHandler}
                    testimonyDesignationChangeHandler={oldTestimonyDesignationChangeHandler}
                    testimoniesPicChangeHandler={oldTestimoniesPicChangeHandler}
                    testimonyRemoveHandler={oldTestimonyRemoveHandler}
                  />
                ))}
              {!!testimonies.length &&
                testimonies.map((testimony, i) => (
                  <Testimony
                    key={i}
                    index={i}
                    indexMargin={i + oldTestimonies.length}
                    testimonies={testimonies}
                    testimoniesImagesUrls={newTestimoniesImagesUrls}
                    testimonyChangeHandler={testimonyChangeHandler}
                    testimonyNameChangeHandler={testimonyNameChangeHandler}
                    testimonyDesignationChangeHandler={testimonyDesignationChangeHandler}
                    testimoniesPicChangeHandler={testimoniesPicChangeHandler}
                    testimonyRemoveHandler={testimonyRemoveHandler}
                  />
                ))}
            </div>
            <div className={s.addMore}>
              <div
                onClick={() => {
                  let newTestimony = {
                    testimony: '',
                    image: '',
                    name: '',
                    designation: ''
                  }
                  let newTestimonies = [...testimonies]
                  newTestimonies.push(newTestimony)
                  setTestimonies(newTestimonies)
                  let newImages = [...newTestimoniesImages]
                  newImages.push(null)
                  setNewTestimoniesImages(newImages)
                  let newImagesUrls = [...newTestimoniesImagesUrls]
                  newImagesUrls.push(null)
                  setNewTestimoniesImagesUrls(newImagesUrls)
                }}
              >
                Add Testimony <span className='material-icons-outlined'>add_circle_outline</span>
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

const Testimony = props => (
  <div className={s.testimony}>
    <div className={s.title}>
      <span>Testimony {(props.indexMargin ? props.indexMargin : props.index) + 1}</span>
      <span onClick={() => props.testimonyRemoveHandler(props.index)}>
        Remove<span className='material-icons-outlined'>cancel</span>
      </span>
    </div>
    <div className={s.imageUpload}>
      <UploadImages.Single
        userLogoUrl={props.testimoniesImagesUrls[props.index] ? props.testimoniesImagesUrls[props.index] : ''}
        handleUserLogoChange={e => props.testimoniesPicChangeHandler(e, props.index)}
        id={'imageUpload' + (props.indexMargin ? props.indexMargin : props.index)}
      />
    </div>
    <TextArea.Classic
      label='Description'
      iconLeft='description'
      placeholder='Enter testimony description...'
      value={props.testimonies[props.index].testimony}
      onChange={e => {
        // if (e.target.value.trim().split(/\s+/).length <= 1000)
        props.testimonyChangeHandler(e.target.value, props.index)
      }}
    />
    <Input.Classic
      type='text'
      label='Name'
      iconLeft='person'
      placeholder='Enter Name'
      value={props.testimonies[props.index].name}
      onChange={e => props.testimonyNameChangeHandler(e.target.value, props.index)}
    />
    <Input.Classic
      type='text'
      label='Designation'
      iconLeft='description'
      placeholder='Enter Designation'
      value={props.testimonies[props.index].designation}
      onChange={e => props.testimonyDesignationChangeHandler(e.target.value, props.index)}
    />
  </div>
)
