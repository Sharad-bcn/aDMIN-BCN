import { Alert, ImageTag } from 'components'
import s from './styles.module.scss'
const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

export default function Main(props) {
  return (
    <div className={s.main}>
      <div className={s.title}>
        {props.label ? props.label : 'Upload Images'}
        <span>(Upto {props.max} images allowed)</span>
      </div>
      <div className={s.imagesUploadedOuter}>
        {!!props.oldListingImagesUrls.length &&
          props.oldListingImagesUrls.map((image, i) => (
            <div className={s.imagesUploaded} key={i}>
              <ImageTag src={IMAGE_HOST + image} alt='' />
              <span className='material-icons-outlined' onClick={() => props.handleRemoveOldImage(i)}>
                close
              </span>
            </div>
          ))}
        {!!props.listingImagesUrls.length &&
          props.listingImagesUrls.map((image, i) => (
            <div className={s.imagesUploaded} key={i}>
              <ImageTag src={image} alt='' />
              <span className='material-icons-outlined' onClick={() => props.handleRemoveImage(i)}>
                close
              </span>
            </div>
          ))}

        {props.listingImagesUrls.length + props.oldListingImagesUrls.length < props.max && (
          <div
            className={s.imageActions}
            onClick={
              props.listingImagesUrls.length + props.oldListingImagesUrls.length >= props.max
                ? () => Alert.warn(`Upto ${props.max} images allowed`)
                : () => {}
            }
          >
            {/* <span className='material-icons-outlined'>photo_camera</span> */}
            <label htmlFor='multipleImageUpload' className={s.uploadButton} title='Add Images'>
              <span className='material-icons-outlined'>add_circle</span>
            </label>
            <input
              type='file'
              id='multipleImageUpload'
              accept='image/*'
              onChange={props.handleListingImagesChange}
              style={{ display: 'none' }}
              disabled={props.listingImagesUrls.length + props.oldListingImagesUrls.length >= props.max}
              multiple
            />
          </div>
        )}
      </div>
    </div>
  )
}
