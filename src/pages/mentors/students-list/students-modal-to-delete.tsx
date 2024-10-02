// import FavIcon from '@/shared/assets/images/Favorite.png';
// import { useParams } from 'react-router-dom';

// import '@/pages/mentors/students-list/students-modal.scss';
// import type { Maybe, Student } from '@/types/types.generated';
// import { buttonizeA11Y } from '@/shared/utils/buttonizeA11Y';

// const StudentsModal = ({
//   setShowStudentModal,
//   studentId,
//   studentList,
// }: {
//   setShowStudentModal: (value: boolean) => void;
//   studentId?: string;
//   studentList?: Maybe<Student>[];
// }) => {
//   const { id } = useParams();

//   const renderSelectedTutor = studentList?.find(
//     (item) => item?.id === (studentId ? studentId : id),
//   );

//   const avatar = renderSelectedTutor?.avatar?.url;

//   return (
//     <div className="student_alfa">
//       <div className="tutor_modal">
//         <p {...buttonizeA11Y(() => setShowStudentModal(false))} className="close-sh p-2">
//           &times;
//         </p>
//         {!avatar && (
//           <div className="no_video">
//             <h2>No Image!</h2>
//           </div>
//         )}

//         {avatar && (
//           <img
//             src={renderSelectedTutor?.avatar?.url ?? undefined}
//             width="500px"
//             className="student_image pl-2"
//             alt=""
//           />
//         )}
//         <div className="tutor_more-content">
//           {renderSelectedTutor?.isFavourite && (
//             <img src={FavIcon} alt="" className="favTutorIcon" />
//           )}

//           <h1>{`${renderSelectedTutor?.user?.firstName} ${
//             renderSelectedTutor?.user?.lastName && renderSelectedTutor?.user.lastName
//           }`}</h1>
//           <div className="bottom_content">
//             <div className="bottom_content-status">
//               {renderSelectedTutor?.user?.address && (
//                 <div>
//                   <p>Address</p>
//                   <h3>{renderSelectedTutor?.user?.address}</h3>
//                 </div>
//               )}
//               {renderSelectedTutor?.user?.email && (
//                 <div>
//                   <p>Email</p>
//                   <h3>{renderSelectedTutor.user?.email}</h3>
//                 </div>
//               )}
//               {renderSelectedTutor?.user?.phoneNumber && (
//                 <div>
//                   <p>Phone Number</p>
//                   <h3>{renderSelectedTutor.user?.phoneNumber}</h3>
//                 </div>
//               )}
//               {renderSelectedTutor?.level && (
//                 <div>
//                   <p>Level</p>
//                   <h3>{renderSelectedTutor?.level}</h3>
//                 </div>
//               )}
//               {renderSelectedTutor?.courseType && (
//                 <div>
//                   <p>Course Type</p>
//                   <h3>{renderSelectedTutor?.courseType}</h3>
//                 </div>
//               )}
//             </div>
//             <div className="modal_bio">
//               {renderSelectedTutor?.about && (
//                 <div>
//                   <p>Biography</p>
//                   <span>{renderSelectedTutor?.about}</span>
//                 </div>
//               )}
//             </div>
//             <div className="bottom_content-button">
//               {/* <button onClick={() => setShowStudentModal(false)}>Cancel</button> */}
//               {/* <button>Message</button>
//               <button onClick={() => handleStatusTutor(parseInt(studentId))}>
//                 {renderSelectedTutor?.isFavourite ? 'Remove' : 'Favorite'}
//               </button> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentsModal;
