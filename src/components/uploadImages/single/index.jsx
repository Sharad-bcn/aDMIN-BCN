import { ImageTag } from 'components'
import s from './styles.module.scss'

export default function Main(props) {
  return (
    <div className={s.main}>
      <div className={s.image}>
        <div className={s.imageActions} title='Upload Image'>
          <label htmlFor={props.id ? props.id : 'imageUpload'} className={s.uploadButton}>
            <span className='material-icons-outlined'>photo_camera</span>
          </label>
          <input
            type='file'
            id={props.id ? props.id : 'imageUpload'}
            accept='image/*'
            onChange={props.handleUserLogoChange}
            style={{ display: 'none' }}
          />
        </div>
        <ImageTag src={props.userLogoUrl} alt='' />
      </div>
    </div>
  )
}
