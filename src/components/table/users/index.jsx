// import { Alert, Modal } from 'components'
// import s from './styles.module.scss'
// import { useState, useRef } from 'react'
// import * as api from 'api'
// import { useNavigate } from 'react-router-dom'

// export default function Main({ userData }) {
//   console.log(userData); // Debugging: Log userData to verify data is correctly received

//   return (
//     <div className={s.main}>
//       <div className={s.table}>
//         <div className={s.tableHeading}>
//           <div className={s.srNo}>S.No.</div>
//           <div className={s.userName}>User Name</div>
//           <div className={s.phoneNo}>Contact No</div>
//           <div className={s.fullyOnboarded}>Fully Onboarded</div>
//           <div className={s.paymentDone}>Payment Done</div>
//           <div className={s.profileComplete}>Profile Complete</div>
//           <div className={s.businessAdded}>Business Added</div>
//           <div className={s.exempt}>Exempt</div>
//           <div className={s.referSheet}>Refer Sheet</div>
//           <div className={s.joiningDate}>Joining Date</div>
//           <div className={s.paymentDate}>Payment Date</div>
//           <div className={s.paymentButton}>Payment Button</div>
//           <div className={s.receiptCreated}>Receipt Created</div>
//           <div className={s.actions}>Actions</div>
//         </div>
//         <div className={s.tableBody}>
//           {userData.map(({ _id, firstName, lastName, isBlocked, phoneNo, fullyOnboarded, paymentDone, profileComplete, businessAdded, exempt, referSheet, joiningDate, paymentDate, receiptCreated }, i) => (
//             <TableRow 
//               key={_id}
//               _id={_id} 
//               firstName={firstName + ' ' + lastName} 
//               isBlocked={isBlocked} 
//               contactNo={phoneNo} // Pass phoneNo as contactNo to TableRow
//               fullyOnboarded={fullyOnboarded} 
//               paymentDone={paymentDone} 
//               profileComplete={profileComplete} 
//               businessAdded={businessAdded} 
//               exempt={exempt} 
//               referSheet={referSheet} 
//               joiningDate={joiningDate} 
//               paymentDate={paymentDate} 
//               receiptCreated={receiptCreated} 
//               index={i} 
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// const TableRow = ({ 
//   _id, firstName, isBlocked, contactNo, fullyOnboarded, paymentDone, profileComplete, 
//   businessAdded, exempt, referSheet, joiningDate, paymentDate, receiptCreated, index 
// }) => {
//   const [userBlockStatus, setUserBlockStatus] = useState(isBlocked)
//   const processing = useRef(false)
//   const Navigate = useNavigate()

//   // Block/Unblock user handler
//   const BlockHandler = async () => {
//     if (processing.current) return
//     processing.current = true

//     const toggleUserBlockStatus = await api.admin.user.blockUser({ id: _id })

//     if (toggleUserBlockStatus.code === 201) {
//       setUserBlockStatus(toggleUserBlockStatus.payload.status)
//       toggleUserBlockStatus.payload.status
//         ? Alert.warn(toggleUserBlockStatus.message)
//         : Alert.success(toggleUserBlockStatus.message)
//     } else {
//       Alert.error(toggleUserBlockStatus.message)
//     }
//     processing.current = false
//   }

//   // Navigate to user profile edit page
//   const userHandler = async () => {
//     if (processing.current) return
//     processing.current = true
//     const userAuth = await api.auth.admin.getUserAdmin({ id: _id })
//     if (userAuth.code === 201) {
//       window.localStorage.setItem('authorization', userAuth.payload.authorization)
//       window.localStorage.setItem('userData', JSON.stringify(userAuth.payload.userData))
//       Navigate('/userAdmin/editProfile', { replace: true })
//     } else {
//       Alert.warn(userAuth.error)
//     }
//     processing.current = false
//   }

//   // Payment Button Handler
//   const handlePayment = async () => {
//     // Implement payment logic here
//     Alert.success('Payment logic triggered for ' + firstName)
//   }

//   return (
//     <div className={s.tableRow}>
//       <div className={s.srNo}>{index + 1}</div> {/* Display S.No */}
//       <div className={s.userName} onClick={userHandler}>{firstName}</div> {/* Display User Name */}
//       <div className={s.phoneNo}>{contactNo ? contactNo : 'No Contact Number Available'}</div> {/* Display Contact No */}
//       <div className={s.fullyOnboarded}>{fullyOnboarded ? 'Yes' : 'No'}</div>
//       <div className={s.paymentDone}>{paymentDone ? 'Yes' : 'No'}</div>
//       <div className={s.profileComplete}>{profileComplete ? 'Yes' : 'No'}</div>
//       <div className={s.businessAdded}>{businessAdded ? 'Yes' : 'No'}</div>
//       <div className={s.exempt}>{exempt ? 'Yes' : 'No'}</div>
//       <div className={s.referSheet}>{referSheet ? 'Yes' : 'No'}</div>
//       <div className={s.joiningDate}>{joiningDate}</div>
//       <div className={s.paymentDate}>{paymentDate}</div>
//       <div className={s.paymentButton}>
//         {!paymentDone && (
//           <button onClick={handlePayment}>Make Payment</button>
//         )}
//       </div>
//       <div className={s.receiptCreated}>{receiptCreated ? 'Yes' : 'No'}</div>
//       <div className={s.actions}>
//         <div
//           onClick={async () =>
//             Modal.Confirm(
//               'Are you sure you want to ' + (userBlockStatus ? 'unblock ' : 'block ') + firstName + '?',
//               BlockHandler
//             )
//           }
//           title='Block User'
//           className={s.blockUser}
//         >
//           <span
//             className='material-icons-outlined'
//             style={{ color: userBlockStatus ? 'var(--c-red)' : 'var(--c-font)' }}
//           >
//             block
//           </span>
//         </div>
//       </div>
//     </div>
//   )
// }


import axios from 'axios'; 
import { Alert, Modal } from 'components'
import s from './styles.module.scss'
import { useState,useEffect, useRef } from 'react'
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
          {userData.map(({ _id, firstName, lastName, isBlocked, phoneNo, fullyOnboarded, paymentDone, profileComplete, businessAdded, exempt, joiningDate, paymentDate, }, i) => (
            <TableRow 
              key={_id}
              _id={_id} 
              firstName={firstName + ' ' + lastName} 
              isBlocked={isBlocked} 
              contactNo={phoneNo} // Pass phoneNo as contactNo to TableRow
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
  )
}



const TableRow = ({ _id, firstName, isBlocked, contactNo, fullyOnboarded, paymentDone, profileComplete, 
  businessAdded, exempt, paymentDate: propPaymentDate, index }) => {
  const [userBlockStatus, setUserBlockStatus] = useState(isBlocked);
  const [isExempt, setIsExempt] = useState(exempt); // Initialize with the current exempt status
  const [isPaymentDone, setIsPaymentDone] = useState(paymentDone);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userContactNo, setUserContactNo] = useState(contactNo); 
  const [joiningDate, setJoiningDate] = useState(null); // Add state for joiningDate
  const [paymentDateState, setPaymentDateState] = useState(null); // Renamed to paymentDateState to avoid conflict
  const processing = useRef(false);
  const Navigate = useNavigate();

  useEffect(() => {
    // Fetch user details when component mounts
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/referral/user?id=all');
        if (response.data && Array.isArray(response.data)) {
          const user = response.data.find(user => user._id === _id);
          if (user) {
            const { phoneNo, plan, createdAt, updatedAt } = user;
            setUserContactNo(phoneNo);
            setSelectedPlan(plan);
            setJoiningDate(createdAt); // Set the joining date from the response
            setPaymentDateState(updatedAt); // Set payment date state
          } else {
            console.error("User not found in the list.");
          }
        } else {
          console.error("Invalid response data.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [_id]);

  useEffect(() => {
    // Update exempt status based on the selected plan
    if (selectedPlan && selectedPlan !== 'Plan 0') {
      setIsExempt(true);
      setIsPaymentDone(true); // If exempt, mark payment as done
    } else {
      setIsExempt(false);
      setIsPaymentDone(false); // Otherwise, mark payment as pending
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

    try {
      const response = await axios.put(`http://localhost:8080/api/payment/update-payment/${_id}`, {
        plan: selectedPlan
      });

      if (response.data.code === 200) {
        setIsPaymentDone(true);
        Alert.success('Payment successfully processed for ' + firstName);
      } else {
        Alert.error(response.data.message || 'Failed to update payment.');
      }
    } catch (error) {
      Alert.error('An error occurred while processing the payment.');
    }

    processing.current = false;
  };

  const handleExemptChange = () => {
    setIsExempt(!isExempt);
    setIsPaymentDone(!isExempt); // Toggle payment status based on exempt status
  };

  // Format the joining date
  const formattedJoiningDate = joiningDate ? new Date(joiningDate).toLocaleDateString() : 'N/A';
  const formattedPaymentDate = paymentDateState ? new Date(paymentDateState).toLocaleDateString() : 'N/A'; // Format payment date

  return (
    <div className={s.tableRow}>
      <div className={s.srNo}>{index + 1}</div>
      <div className={s.userName} onClick={userHandler}>{firstName}</div>
      <div className={s.phoneNo}>
        {userContactNo ? userContactNo : 'No Contact Number Available'}
      </div>
      <div className={s.fullyOnboarded}>{fullyOnboarded ? 'Yes' : 'No'}</div>
      <div className={s.paymentDone}>{isPaymentDone ? 'Yes' : 'No'}</div>
      <div className={s.profileComplete}>{profileComplete ? 'Yes' : 'No'}</div>
      <div className={s.businessAdded}>{businessAdded ? 'Yes' : 'No'}</div>
      <div className={s.exempt}>
        <input 
          type="checkbox" 
          checked={isExempt} 
          onChange={handleExemptChange} 
        />
      </div>
      <div className={s.joiningDate}>{formattedJoiningDate}</div> {/* Display the formatted joining date */}
      <div className={s.paymentDate}>{formattedPaymentDate}</div> {/* Display the formatted payment date */}
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
          onClick={async () =>
            Modal.Confirm(
              'Are you sure you want to ' + (userBlockStatus ? 'unblock ' : 'block ') + firstName + '?',
              BlockHandler
            )
          }
          title='Block User'
          className={s.blockUser}
        >
          <span
            className='material-icons-outlined'
            style={{ color: userBlockStatus ? 'var(--c-red)' : 'var(--c-font)' }}
          >
            block
          </span>
        </div>
      </div>
    </div>
  );
};






// const TableRow = ({ 
//   _id, firstName, isBlocked, contactNo, fullyOnboarded, paymentDone, profileComplete, 
//   businessAdded, exempt, joiningDate, paymentDate, index 
// }) => {
//   const [userBlockStatus, setUserBlockStatus] = useState(isBlocked)
//   const [isExempt, setIsExempt] = useState(exempt)
//   const [isPaymentDone, setIsPaymentDone] = useState(paymentDone)
//   const processing = useRef(false)
//   const Navigate = useNavigate()

//   // Block/Unblock user handler
//   const BlockHandler = async () => {
//     if (processing.current) return
//     processing.current = true

//     const toggleUserBlockStatus = await api.admin.user.blockUser({ id: _id })

//     if (toggleUserBlockStatus.code === 201) {
//       setUserBlockStatus(toggleUserBlockStatus.payload.status)
//       toggleUserBlockStatus.payload.status
//         ? Alert.warn(toggleUserBlockStatus.message)
//         : Alert.success(toggleUserBlockStatus.message)
//     } else {
//       Alert.error(toggleUserBlockStatus.message)
//     }
//     processing.current = false
//   }

//   // Navigate to user profile edit page
//   const userHandler = async () => {
//     if (processing.current) return
//     processing.current = true
//     const userAuth = await api.auth.admin.getUserAdmin({ id: _id })
//     if (userAuth.code === 201) {
//       window.localStorage.setItem('authorization', userAuth.payload.authorization)
//       window.localStorage.setItem('userData', JSON.stringify(userAuth.payload.userData))
//       Navigate('/userAdmin/editProfile', { replace: true })
//     } else {
//       Alert.warn(userAuth.error)
//     }
//     processing.current = false
//   }

//   // Payment Button Handler
// const handlePayment = async () => {
//   if (processing.current) return;
//   processing.current = true;

//   try {
//     const response = await axios.put(`http://localhost:8080/api/payment/update-payment/${_id}`,{
//       plan: 'Plan A' 
//     });
//     if (response.data.code === 200) {
//       setIsPaymentDone(true);
//       Alert.success('Payment successfully processed for ' + firstName);
//     } else {
//       Alert.error(response.data.message || 'Failed to update payment.');
//     }
//   } catch (error) {
//     Alert.error('An error occurred while processing the payment.');
//   }
//   processing.current = false;
// };

  
//   // Toggle Exempt and Payment Done status
//   const handleExemptChange = () => {
//     setIsExempt(!isExempt)
//     setIsPaymentDone(!isPaymentDone)
//   }

//   return (
//     <div className={s.tableRow}>
//       <div className={s.srNo}>{index + 1}</div>
//       <div className={s.userName} onClick={userHandler}>{firstName}</div>
//       <div className={s.phoneNo}>{contactNo ? contactNo : 'No Contact Number Available'}</div>
//       <div className={s.fullyOnboarded}>{fullyOnboarded ? 'Yes' : 'No'}</div>
//       <div className={s.paymentDone}>{isPaymentDone ? 'Yes' : 'No'}</div>
//       <div className={s.profileComplete}>{profileComplete ? 'Yes' : 'No'}</div>
//       <div className={s.businessAdded}>{businessAdded ? 'Yes' : 'No'}</div>
//       <div className={s.exempt}>
//         <input 
//           type="checkbox" 
//           checked={isExempt} 
//           onChange={handleExemptChange} 
//         />
//       </div>
//       <div className={s.joiningDate}>{joiningDate}</div>
//       <div className={s.paymentDate}>{paymentDate}</div>
//       <div className={s.plan}>{}</div>
//       <div className={s.paymentButton}>
//         {!isPaymentDone && (
//           <button onClick={handlePayment}>Make Payment</button>
//         )}
//       </div>
//       <div className={s.actions}>
//         <div
//           onClick={async () =>
//             Modal.Confirm(
//               'Are you sure you want to ' + (userBlockStatus ? 'unblock ' : 'block ') + firstName + '?',
//               BlockHandler
//             )
//           }
//           title='Block User'
//           className={s.blockUser}
//         >
//           <span
//             className='material-icons-outlined'
//             style={{ color: userBlockStatus ? 'var(--c-red)' : 'var(--c-font)' }}
//           >
//             block
//           </span>
//         </div>
//       </div>
//     </div>
//   )
// }