
import { Alert, Modal } from 'components'
import s from './styles.module.scss'
import { useState, useEffect, useRef } from 'react'
import * as api from 'api'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx';

export default function Main({ userData }) {
  const [sortedData, setSortedData] = useState(userData);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    setSortedData(userData); // Update sortedData when userData changes
  }, [userData]);

  // Sorting logic
  const handleSort = (option) => {
    setSortOption(option);
    const sorted = [...sortedData];
    if (option === 'A-Z') {
      sorted.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));
    } else if (option === 'First come - Last come') {
      sorted.sort(
        (a, b) => new Date(a.joiningDate || 0) - new Date(b.joiningDate || 0)
      );
    }
    setSortedData(sorted);
  };

  // Export to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');
    XLSX.writeFile(workbook, 'user_data.xlsx');
  };

  return (
    <div className={s.main}>
      {/* Export to Excel Button */}
      <div className={s.exportButton}>
        <button onClick={handleExportToExcel}>Export to Excel</button>
      </div>

      {/* Sort Button */}
      <div className={s.sortButton}>
        <select value={sortOption} onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort-by:</option>
          <option value="A-Z">A-Z</option>
          <option value="First come - Last come">Join-First come - Join-Last come</option>
        </select>
      </div>

      <div className={s.table}>
        <div className={s.tableHeading}>
          <div className={s.srNo}>S.No.</div>
          <div className={s.userName}>User Name</div>
          <div className={s.phoneNo}>Contact No</div>
          <div className={s.fullyOnboarded}>Fully Onboarded</div>
          <div className={s.paymentDone}>Payment Done</div>
          <div className={s.profileComplete}>Profile Complete</div>
          <div className={s.businessAdded}>Business Added</div>
          <div className={s.exempt}>Exempt</div>
          <div className={s.joiningDate}>Joining Date</div>
          <div className={s.paymentDate}>Payment Date</div>
          <div className={s.plan}>Plan</div>
          <div className={s.paymentButton}>Payment Button</div>
          <div className={s.actions}>Actions</div>
        </div>
        <div className={s.tableBody}>
          {sortedData.map(({ _id, firstName, lastName, isBlocked, phoneNo, fullyOnboarded, paymentDone, profileComplete, businessAdded, exempt, joiningDate, paymentDate }, i) => (
            <TableRow 
              key={_id}
              _id={_id} 
              firstName={firstName + ' ' + lastName} 
              isBlocked={isBlocked} 
              contactNo={phoneNo} 
              fullyOnboarded={fullyOnboarded} 
              paymentDone={paymentDone} 
              profileComplete={profileComplete} 
              businessAdded={businessAdded} 
              exempt={exempt} 
              joiningDate={joiningDate} 
              paymentDate={paymentDate} 
              index={i} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}


const TableRow = ({ _id, firstName, isBlocked, contactNo, fullyOnboarded, paymentDone, profileComplete, businessAdded, exempt, paymentDate: propPaymentDate, index }) => {
  const [userBlockStatus, setUserBlockStatus] = useState(isBlocked);
  const [isExempt, setIsExempt] = useState(exempt);
  const [isPaymentDone, setIsPaymentDone] = useState(paymentDone);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userContactNo, setUserContactNo] = useState(contactNo);
  const [joiningDate, setJoiningDate] = useState(null);
  const [paymentDateState, setPaymentDateState] = useState(null);
  const processing = useRef(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (processing.current) return;
      processing.current = true;

      try {
        const response = await api.admin.user.fetchAll({ 
          city: null, 
          state: null, 
          searchQuery: null, 
          limit: 10, 
          pageNo: 1 
        });

        if (response.data && Array.isArray(response.data)) {
          const user = response.data.find(user => user._id === _id);
          if (user) {
            const { phoneNo, plan, createdAt, updatedAt } = user;
            setUserContactNo(phoneNo);
            setSelectedPlan(plan);
            setJoiningDate(createdAt);
            setPaymentDateState(updatedAt);
          } else {
            console.error("User not found in the list.");
          }
        } else {
          console.error("Invalid response data.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        processing.current = false;
      }
    };

    fetchUserDetails();
  }, [_id]);

  useEffect(() => {
    if (selectedPlan && selectedPlan !== 'Plan 0') {
      setIsExempt(true);
      setIsPaymentDone(true);
    } else {
      setIsExempt(false);
      setIsPaymentDone(false);
    }
  }, [selectedPlan]);

  const BlockHandler = async () => {
    if (processing.current) return;
    processing.current = true;

    const toggleUserBlockStatus = await api.admin.user.blockUser({ id: _id });

    if (toggleUserBlockStatus.code === 201) {
      setUserBlockStatus(toggleUserBlockStatus.payload.status);
      toggleUserBlockStatus.payload.status
        ? Alert.warn(toggleUserBlockStatus.message)
        : Alert.success(toggleUserBlockStatus.message);
    } else {
      Alert.error(toggleUserBlockStatus.message);
    }
    processing.current = false;
  };

  const userHandler = async () => {
    if (processing.current) return;
    processing.current = true;

    const userAuth = await api.auth.admin.getUserAdmin({ id: _id });
    if (userAuth.code === 201) {
      window.localStorage.setItem('authorization', userAuth.payload.authorization);
      window.localStorage.setItem('userData', JSON.stringify(userAuth.payload.userData));
      Navigate('/userAdmin/editProfile', { replace: true });
    } else {
      Alert.warn(userAuth.error);
    }
    processing.current = false;
  };

  const handlePayment = async () => {
    if (processing.current) return;
    processing.current = true;
  
    const paymentResponse = await api.admin.user.updatePaymentPlan({ id: _id, plan: selectedPlan });
  
    if (paymentResponse.code === 200) {
      setIsPaymentDone(true);
      Alert.success(`Payment successfully processed for ${firstName}`);
    } else {
      Alert.error(paymentResponse.message || 'Failed to update payment.');
    }
  
    processing.current = false;
  };

  const handleExemptChange = () => {
    setIsExempt(!isExempt);
    setIsPaymentDone(!isExempt); 
  };

  const formattedJoiningDate = joiningDate ? new Date(joiningDate).toLocaleDateString() : 'N/A';
  const formattedPaymentDate = paymentDateState ? new Date(paymentDateState).toLocaleDateString() : 'N/A';

  return (
    <div className={s.tableRow}>
      <div className={s.srNo}>{index + 1}</div>
      <div className={s.userName} onClick={userHandler}>{firstName}</div>
      <div className={s.phoneNo}>{userContactNo || 'No Contact Number Available'}</div>
      <div className={s.fullyOnboarded}>{fullyOnboarded ? 'Yes' : 'No'}</div>
      <div className={s.paymentDone}>{isPaymentDone ? 'Yes' : 'No'}</div>
      <div className={s.profileComplete}>{profileComplete ? 'Yes' : 'No'}</div>
      <div className={s.businessAdded}>{businessAdded ? 'Yes' : 'No'}</div>
      <div className={s.exempt}>
        <input type="checkbox" checked={isExempt} onChange={handleExemptChange} />
      </div>
      <div className={s.joiningDate}>{formattedJoiningDate}</div>
      <div className={s.paymentDate}>{formattedPaymentDate}</div>
      <div className={s.plan}>
        <select value={selectedPlan || 'Plan 0'} onChange={(e) => setSelectedPlan(e.target.value)}>
          <option value="Plan 0">Plan 0</option>
          <option value="Plan A">Plan A</option>
          <option value="Plan B">Plan B</option>
          <option value="Plan C">Plan C</option>
        </select>
      </div>
      <div className={s.paymentButton}>
        {!isPaymentDone && (
          <button onClick={handlePayment}>Make Payment</button>
        )}
      </div>
      <div className={s.actions}>
        <div
          onClick={() =>
            Modal.Confirm(
              `Are you sure you want to ${userBlockStatus ? 'unblock' : 'block'} ${firstName}?`,
              BlockHandler
            )
          }
          title='Block User'
          className={s.blockUser}
        >
          <span className='material-icons-outlined' style={{ color: userBlockStatus ? 'var(--c-red)' : 'var(--c-font)' }}>
            block
          </span>
        </div>
      </div>
    </div>
  );
};