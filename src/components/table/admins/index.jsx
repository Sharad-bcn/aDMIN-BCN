import { Alert, Modal } from 'components'
import { useRef } from 'react'
import s from './styles.module.scss'
import * as api from 'api'
import { Link } from 'react-router-dom'
import { Encrypt } from 'helpers'

export default function Main({ adminData, setAdmins }) {
  return (
    <div className={s.main}>
      <div className={s.table}>
        <div className={s.tableHeading}>
          <div className={s.srNo}>S.No.</div>
          <div className={s.adminName}>Admin Name</div>
          <div className={s.actions}>Actions</div>
        </div>
        <div className={s.tableBody}>
          {adminData.map(({ _id, firstName, lastName }, i) => (
            <TableRow
              _id={_id}
              firstName={firstName + ' ' + lastName}
              adminData={adminData}
              setAdmins={setAdmins}
              index={i}
              key={i}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const TableRow = ({ _id, firstName, adminData, setAdmins, index }) => {
  const processing = useRef(false)

  const DeleteHandler = async () => {
    if (processing.current) return
    processing.current = true

    const deleteAdmin = await api.admin.adminControls.delete({ id: _id })

    if (deleteAdmin.code === 200) {
      setAdmins(adminData.filter(admin => admin._id !== _id))
      Alert.warn(deleteAdmin.message)
    } else {
      Alert.error(deleteAdmin.message)
    }
    processing.current = false
  }

  return (
    <div className={s.tableRow}>
      <div className={s.srNo}>{index + 1}</div>
      <div className={s.adminName}>{firstName}</div>
      <div className={s.actions}>
        <Link
          to={'/admin/changePin?adminId=' + Encrypt({ id: _id, name: firstName })}
          title='Change Admin Pin'
          className={s.changeAdminPin}
        >
          <span className='material-icons-outlined'>vpn_key</span>
        </Link>
        <div
          onClick={async () => Modal.Confirm('Are u sure u want to delete ' + firstName + '?', DeleteHandler)}
          title='Block User'
          className={s.deleteAdmin}
        >
          <span className='material-icons-outlined' style={{ color: 'var(--c-red)' }}>
            delete
          </span>
        </div>
      </div>
    </div>
  )
}
