import { useState, useCallback, useEffect, useRef } from 'react'
import s from './styles.module.scss'
import { Alert, Input, Layouts, Loader, UploadImages } from 'components'
import { Decrypt, head, imageCompressor, removeFromS3, uploadToS3 } from 'helpers'
import DashBoardNav from '../../dashboardNav'
import { useNavigate, useParams } from 'react-router-dom'
import * as api from 'api'
const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

export default function Main({ inLayout = false }) {
  const [loading, setLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState('Loading...')
  const [category, setCategory] = useState('')
  const [categoryPic, setCategoryPic] = useState()
  const [categoryOldPic, setCategoryOldPic] = useState()
  const [categoryPicUrl, setCategoryPicUrl] = useState('')
  const [addSubCategories, setAddSubCategories] = useState(false)
  const [oldSubCategories, setOldSubCategories] = useState([])
  const [subCategoriesImages, setSubCategoriesImages] = useState([null, null])
  const [subCategoriesOldImages, setSubCategoriesOldImages] = useState([])
  const [subCategoriesImagesUrls, setSubCategoriesImagesUrls] = useState([null, null])
  const [subCategories, setSubCategories] = useState([
    {
      subCategory: '',
      image: ''
    },
    {
      subCategory: '',
      image: ''
    }
  ])
  const [newSubCategoriesImages, setNewSubCategoriesImages] = useState([null, null])
  const [newSubCategoriesImagesUrls, setNewSubCategoriesImagesUrls] = useState([null, null])
  const navigate = useNavigate()
  const processing = useRef(false)
  let { categoryId } = useParams()
  if (categoryId) categoryId = Decrypt(categoryId).id

  const handleCategoryPicChange = async e => {
    const file = Array.prototype.slice.call(e.target.files)
    if (file) {
      let compressedFile = await imageCompressor(file, 'logo')

      if (compressedFile[0]) {
        const imageUrl = URL.createObjectURL(compressedFile[0])
        setCategoryPic(compressedFile[0])
        setCategoryPicUrl(imageUrl)
      }
    }
  }

  // const discardAll = () => {
  //   setCategory('')
  //   setCategoryPic()
  //   setCategoryOldPic()
  //   setCategoryPicUrl()
  //   setAddSubCategories(false)
  //   setSubCategories([])
  //   setSubCategoriesImages([])
  //   setSubCategoriesOldImages([])
  //   setSubCategoriesImagesUrls([])
  // }

  useEffect(() => {
    head({ title: (!categoryId ? 'Add' : 'Edit') + ' Category | BCN' })
  }, [categoryId])

  const getCategoryWithItsSubCategories = useCallback(async () => {
    if (processing.current) return
    processing.current = true
    setLoading(true)

    const fetchCategoryWithItsSubCategories = await api.admin.categories.fetch({ categoryId })

    if (fetchCategoryWithItsSubCategories.code === 200) {
      let resultCategory = fetchCategoryWithItsSubCategories.payload.category
      let resultSubCategory = fetchCategoryWithItsSubCategories.payload.subCategories

      setCategory(resultCategory.category)
      setCategoryPicUrl(resultCategory.image ? IMAGE_HOST + resultCategory.image : '')
      setCategoryOldPic(resultCategory.image ? resultCategory.image : '')
      setOldSubCategories(resultSubCategory)
      setSubCategoriesImages(Array.from({ length: resultSubCategory.length }, () => null))
      setSubCategoriesImagesUrls(
        resultSubCategory.map(subCategory => (subCategory.image ? IMAGE_HOST + subCategory.image : null))
      )
      setSubCategoriesOldImages(resultSubCategory.map(subCategory => (subCategory.image ? subCategory.image : '')))

      if (resultSubCategory.length) setAddSubCategories(true)
    } else {
      Alert.error(fetchCategoryWithItsSubCategories.message)
    }

    setLoading(false)
    processing.current = false
  }, [categoryId])

  useEffect(() => {
    if (categoryId) getCategoryWithItsSubCategories()
  }, [categoryId, getCategoryWithItsSubCategories])

  const saveHandler = async () => {
    if (!category) {
      Alert.error('Category is Required!')
      return
    }

    if (oldSubCategories.length) {
      let isSubCategoryEmpty = false

      for (const obj of oldSubCategories) {
        if (!obj.subCategory || obj.subCategory.trim() === '') isSubCategoryEmpty = true
      }

      if (isSubCategoryEmpty) {
        Alert.error('Old SubCategory is Empty!')
        return
      }
    }

    if (addSubCategories && subCategories.length) {
      let isSubCategoryEmpty = false

      for (const obj of subCategories) {
        if (!obj.subCategory || obj.subCategory.trim() === '') isSubCategoryEmpty = true
      }

      if (isSubCategoryEmpty) {
        Alert.error('SubCategory is Empty!')
        return
      }
    }

    if (processing.current) return
    processing.current = true
    Alert.success('Saving category info...')
    setLoading(true)
    setLoadingStatus('Saving...')

    let newSubCategories = [...subCategories]
    let oldEditedSubCategories = [...oldSubCategories]

    if (!addSubCategories) newSubCategories = []
    else {
      for (let i = 0; i < newSubCategoriesImages.length; i++) {
        if (newSubCategoriesImages[i] !== null) {
          newSubCategories[i].image = newSubCategoriesImages[i].name
        }
      }
    }

    if (!subCategoriesImages.every(item => item === null)) {
      for (let i = 0; i < subCategoriesImages.length; i++) {
        if (subCategoriesImages[i] !== null) {
          oldEditedSubCategories[i].image = subCategoriesImages[i].name
        }
      }
    }

    const saveCategory = await api.admin.categories.update({
      categoryId,
      category,
      image: categoryPic ? categoryPic.name : categoryOldPic ? categoryOldPic : '',
      oldSubCategories: oldEditedSubCategories,
      subCategories: newSubCategories
    })

    if (saveCategory.code === 200) {
      let res = ''
      let removePrevious = ''

      if (categoryPic && categoryOldPic) {
        removePrevious = await removeFromS3(categoryOldPic)
      }

      if (categoryPic) {
        res = await uploadToS3(categoryPic.name, categoryPic)
        // console.log(res)
        URL.revokeObjectURL(categoryPicUrl)
        setCategoryPicUrl(res)
        setCategoryOldPic(categoryPic.name)
        setCategoryPic()
      }

      if (addSubCategories && !newSubCategoriesImages.every(item => item === null)) {
        let res = []
        for (let i = 0; i < newSubCategoriesImages.length; i++) {
          if (newSubCategoriesImages[i] !== null)
            res.push(await uploadToS3(newSubCategoriesImages[i].name, newSubCategoriesImages[i]))
        }

        for (let i = 0; i < newSubCategoriesImagesUrls.length; i++) {
          if (newSubCategoriesImages[i] !== null) URL.revokeObjectURL(newSubCategoriesImagesUrls[i])
        }
      }

      if (!subCategoriesImages.every(item => item === null)) {
        let res = []
        for (let i = 0; i < subCategoriesImages.length; i++) {
          if (subCategoriesImages[i] !== null)
            res.push(await uploadToS3(subCategoriesImages[i].name, subCategoriesImages[i]))
        }

        for (let i = 0; i < subCategoriesImagesUrls.length; i++) {
          if (subCategoriesImages[i] !== null) URL.revokeObjectURL(subCategoriesImagesUrls[i])
        }

        if (subCategoriesOldImages.length) {
          let res = []

          for (let i = 0; i < subCategoriesOldImages.length; i++) {
            if (subCategoriesImages[i] !== null) res.push(await removeFromS3(subCategoriesOldImages[i]))
          }
        }
      }

      setSubCategoriesOldImages([])
      setSubCategoriesImagesUrls([])
      setSubCategoriesImages([])
      setNewSubCategoriesImages([])
      Alert.success(saveCategory.message)
      navigate(-1)
    } else {
      Alert.error(saveCategory.message)
    }

    setLoading(false)
    processing.current = false
  }

  const addHandler = async () => {
    if (!category) {
      Alert.error('Category is Required!')
      return
    }

    if (addSubCategories && subCategories.length) {
      let isSubCategoryEmpty = false

      for (const obj of subCategories) {
        if (!obj.subCategory || obj.subCategory.trim() === '') isSubCategoryEmpty = true
      }

      if (isSubCategoryEmpty) {
        Alert.error('SubCategory is Empty!')
        return
      }
    }

    if (processing.current) return
    processing.current = true
    Alert.success('Adding Category...')
    setLoading(true)
    setLoadingStatus('Adding...')

    let newSubCategories = [...subCategories]

    if (!addSubCategories) newSubCategories = []
    else {
      for (let i = 0; i < newSubCategoriesImages.length; i++) {
        if (newSubCategoriesImages[i] !== null) {
          newSubCategories[i].image = newSubCategoriesImages[i].name
        }
      }
    }

    const addCategory = await api.admin.categories.create({
      category,
      image: categoryPic ? categoryPic.name : '',
      subCategories: newSubCategories
    })

    if (addCategory.code === 200) {
      let res = ''

      if (categoryPic) {
        res = await uploadToS3(categoryPic.name, categoryPic)
        // console.log(res)
        URL.revokeObjectURL(categoryPicUrl)
        setCategoryPicUrl(res)
        setCategoryPic()
      }

      if (addSubCategories && !newSubCategoriesImages.every(item => item === null)) {
        let res = []
        for (let i = 0; i < newSubCategoriesImages.length; i++) {
          if (newSubCategoriesImages[i] !== null)
            res.push(await uploadToS3(newSubCategoriesImages[i].name, newSubCategoriesImages[i]))
        }

        for (let i = 0; i < newSubCategoriesImagesUrls.length; i++) {
          if (newSubCategoriesImages[i] !== null) URL.revokeObjectURL(newSubCategoriesImagesUrls[i])
        }
      }

      setSubCategoriesImagesUrls([])
      setSubCategoriesImages([])
      Alert.success(addCategory.message)
      navigate(-1)
    } else {
      Alert.error(addCategory.message)
    }

    setLoading(false)
    processing.current = false
  }

  const subCategoryRemoveHandler = async index => {
    let newSubCategories = subCategories.filter((x, i) => i !== index)
    setSubCategories(newSubCategories)
    let newImages = newSubCategoriesImages.filter((x, i) => i !== index)
    setNewSubCategoriesImages(newImages)
    let newUrls = newSubCategoriesImagesUrls.filter((x, i) => i !== index)
    setNewSubCategoriesImagesUrls(newUrls)
    if (!newSubCategories.length) setAddSubCategories(false)
  }

  const subCategoryChangeHandler = async (value, index) => {
    let newSubCategories = [...subCategories]
    newSubCategories[index] = {
      ...newSubCategories[index],
      subCategory: value
    }
    setSubCategories(newSubCategories)
  }

  const subCategoryPicChangeHandler = async (e, index) => {
    const file = Array.prototype.slice.call(e.target.files)
    if (file) {
      let compressedFile = await imageCompressor(file, 'logo')

      if (compressedFile[0]) {
        const imageUrl = URL.createObjectURL(compressedFile[0])
        let newImages = [...newSubCategoriesImages]
        newImages[index] = compressedFile[0]
        setNewSubCategoriesImages(newImages)
        let newUrls = [...newSubCategoriesImagesUrls]
        newUrls[index] = imageUrl
        setNewSubCategoriesImagesUrls(newUrls)
      }
    }
  }

  const oldSubCategoryPicChangeHandler = async (e, index) => {
    const file = Array.prototype.slice.call(e.target.files)
    if (file) {
      let compressedFile = await imageCompressor(file, 'logo')

      if (compressedFile[0]) {
        const imageUrl = URL.createObjectURL(compressedFile[0])
        let newSubCategoriesImages = [...subCategoriesImages]
        newSubCategoriesImages[index] = compressedFile[0]
        setSubCategoriesImages(newSubCategoriesImages)
        let newSubCategoriesImagesUrls = [...subCategoriesImagesUrls]
        newSubCategoriesImagesUrls[index] = imageUrl
        setSubCategoriesImagesUrls(newSubCategoriesImagesUrls)
      }
    }
  }

  const oldSubCategoryChangeHandler = async (value, index) => {
    let newSubCategories = [...oldSubCategories]
    newSubCategories[index] = {
      ...newSubCategories[index],
      subCategory: value
    }
    setOldSubCategories(newSubCategories)
  }

  return (
    <div className={s.main}>
      <div className={s.editCategory} style={{ padding: !inLayout && '0 1rem' }}>
        {!inLayout && <Layouts.Classic title='Dashboard' />}
        {!loading && (
          <div className={!inLayout ? s.content + ' innerScrollX' : s.content}>
            {!inLayout && <DashBoardNav />}

            <div className={s.title}>{categoryId ? 'Edit Category' : 'Add New Category'}</div>
            <div className={'row'}>
              <Input.Classic
                label='Category Name'
                type='text'
                iconLeft='category'
                placeholder='Enter Category Name'
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
            </div>

            <div className={s.imageUpload}>
              <UploadImages.Single userLogoUrl={categoryPicUrl} handleUserLogoChange={handleCategoryPicChange} />
            </div>

            {!!oldSubCategories.length && <div className={s.title}> Old Sub-Categories</div>}

            {!!oldSubCategories.length &&
              oldSubCategories.map((subCategory, i) => (
                <SubCategory
                  key={i}
                  index={i}
                  subCategories={oldSubCategories}
                  subCategoriesImagesUrls={subCategoriesImagesUrls}
                  subCategoryChangeHandler={oldSubCategoryChangeHandler}
                  subCategoryPicChangeHandler={oldSubCategoryPicChangeHandler}
                />
              ))}

            <div className={s.addSubCategories}>
              <span className='material-icons-outlined'>category</span>
              Add New Sub-Category
              <span
                className={'material-icons ' + s.iconSpan}
                style={{ color: addSubCategories ? 'var(--c-green)' : 'var(--c-red)' }}
                onClick={() => {
                  if (addSubCategories) {
                    Alert.warn('You need to remove subCategories first')
                    return
                  }
                  setAddSubCategories(!addSubCategories)
                  if (!subCategories.length) {
                    let newSubCategory = [
                      {
                        subCategory: '',
                        image: ''
                      },
                      {
                        subCategory: '',
                        image: ''
                      }
                    ]
                    let newSubCategories = [...subCategories, ...newSubCategory]
                    setSubCategories(newSubCategories)
                  }
                }}
              >
                {!!addSubCategories ? 'toggle_on' : 'toggle_off'}
              </span>
            </div>

            {!!addSubCategories && !!subCategories.length && <div className={s.title}> New Sub-Categories</div>}
            {!!addSubCategories &&
              !!subCategories.length &&
              subCategories.map((subCategory, i) => (
                <SubCategory
                  key={i}
                  index={i}
                  indexMargin={i + oldSubCategories.length}
                  subCategories={subCategories}
                  subCategoriesImagesUrls={newSubCategoriesImagesUrls}
                  subCategoryChangeHandler={subCategoryChangeHandler}
                  subCategoryRemoveHandler={subCategoryRemoveHandler}
                  subCategoryPicChangeHandler={subCategoryPicChangeHandler}
                />
              ))}

            {!!addSubCategories && !!subCategories.length && (
              <div className={s.addMore}>
                <div
                  onClick={() => {
                    let newSubCategory = {
                      subCategory: '',
                      image: ''
                    }
                    let newSubCategories = [...subCategories]
                    newSubCategories.push(newSubCategory)
                    setSubCategories(newSubCategories)
                    let newSubCategoriesImages = [...newSubCategoriesImages]
                    newSubCategoriesImages.push(null)
                    setNewSubCategoriesImages(newSubCategoriesImages)
                    let newSubCategoriesImagesUrls = [...newSubCategoriesImagesUrls]
                    newSubCategoriesImagesUrls.push(null)
                    setNewSubCategoriesImagesUrls(newSubCategoriesImagesUrls)
                  }}
                >
                  Add More Sub-Categories <span className='material-icons-outlined'>add_circle_outline</span>
                </div>
              </div>
            )}

            <div className={s.actionButtons}>
              {/* <div className={s.discard} onClick={discardAll}>
                <span className='material-icons-outlined'>remove_circle_outline</span>Discard
              </div> */}
              <div className={s.saveHandler} onClick={categoryId ? saveHandler : addHandler}>
                <span className='material-icons-outlined'>save</span>Finish
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

const SubCategory = props => {
  return (
    <div className={s.subCategory}>
      <div className={'row'}>
        <div className={s.title}>
          <span>Sub-Category {(props.indexMargin ? props.indexMargin : props.index) + 1}</span>
          {!!props.subCategoryRemoveHandler && (
            <span onClick={() => props.subCategoryRemoveHandler(props.index)}>
              Remove<span className='material-icons-outlined'>cancel</span>
            </span>
          )}
        </div>
      </div>

      <div className={'row'}>
        <Input.Classic
          type='text'
          iconLeft='category'
          placeholder='Enter Sub-Category Name'
          value={props.subCategories[props.index].subCategory}
          onChange={e => props.subCategoryChangeHandler(e.target.value, props.index)}
        />
      </div>

      <div className={s.imageUpload}>
        <UploadImages.Single
          userLogoUrl={props.subCategoriesImagesUrls[props.index] ? props.subCategoriesImagesUrls[props.index] : ''}
          handleUserLogoChange={e => props.subCategoryPicChangeHandler(e, props.index)}
          id={'imageUpload' + (props.indexMargin ? props.indexMargin : props.index)}
        />
      </div>
    </div>
  )
}
