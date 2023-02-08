import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import LessonConfirmation from './LessonConfirmation'
import ScheduleSelector from './ScheduleSelector'
import SelectLesson from './SelectLesson'
import SelectTutorCards from './SelectTutorCards'
import Tut from '../../../assets/images/nao.png'
import { getPlanStatus } from '../../../actions/subscription'

import '../../../assets/styles/tutor.scss'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import { useQuery, gql } from '@apollo/client'

const GET_TUTORS = gql`
  query {
    tutors(where: {}, orderBy: [], take: null, skip: 0) {
      id
      userName(something: 1)
      major
      language
      university
      acceptanceRate
      checked
      videoUrl
      totalRequests
      graduatingYear
      degree
      certificates
      introduction
      relevantExperience
      uniqueFacts
      about
      experience
      facts
      avatar {
        id
        filesize
        width
        height
        extension
        url
      }
      picture {
        id
        filesize
        width
        height
        extension
        url
      }
      diplomaVerification {
        filename
        filesize
        url
      }
      user {
        id
        firstName
        lastName
        koreanEquivalent
        phoneNumber
        address
        gender
        timeZone
        country
        avatar
        emailVerificationToken
        resetPasswordExpires
        resetPasswordToken
        referalId
        referalConfirmed
        fullName(something: 1)
        role(something: 1)
        email
        createdAt
        updatedAt
        passwordResetIssuedAt
        passwordResetRedeemedAt
      }
      createdAt
      updatedAt
    }
  }
`

const ScheduleLesson = () => {
  const dispatch = useDispatch()
  const [clicked, setClicked] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState({})
  const [schedule, setSchedule] = useState()
  const [tabIndex, setTabIndex] = useState(0)
  const [selectTutor, setSelectTutor] = useState()
  // const tutors = useSelector(state => state.tutor.list)
  const { loading, error, data } = useQuery(GET_TUTORS)
  // const tutors = [
  //   {
  //     id: 1,
  //     img: Tut,
  //     first_name: 'Sarah B.',
  //     univer: 'Harvard University',
  //     lang: 'B.A. in English',
  //     isFavourite: false
  //   },
  //   {
  //     id: 2,
  //     img: 'https://media.istockphoto.com/id/1365223878/photo/attractive-man-feeling-cheerful.jpg?b=1&s=170667a&w=0&k=20&c=Pt_reBU6pAQV6cXnIcBSLdtYSB4a_8MJM4qWAO_0leU=',
  //     first_name: 'Alex',
  //     last_name: 'T.',
  //     univer: 'Stanford University',
  //     lang: 'B.A. in English',
  //     isFavourite: true
  //   },
  //   {
  //     id: 3,
  //     img: 'https://img.freepik.com/free-photo/lifestyle-people-emotions-and-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-to-help-listening-to-coworkers-taking-part-conversation_1258-59335.jpg?w=2000',
  //     first_name: 'Caroline',
  //     last_name: 'W.',
  //     univer: 'Brown University',
  //     lang: 'B.A. in English',
  //     isFavourite: false
  //   },
  //   {
  //     id: 4,
  //     img: Tut,
  //     first_name: 'Sarah',
  //     last_name: 'B.',
  //     univer: 'Harvard University',
  //     lang: 'B.A. in English',
  //     isFavourite: false
  //   }
  // ]
  const tutors = data?.tutors?.map(tutor => {
    return {
      id: tutor.id,
      avatar: tutor?.avatar?.url ?? "",
      first_name: tutor.user.firstName,
      last_name: tutor.user.lastName,
      univer: 'Stanford University',
      lang: 'SMTH',
      isFavourite: false
    }
  })
  const { id } = useParams()

  useEffect(() => {
    dispatch(getPlanStatus())
  }, [dispatch, schedule])

  return (
    <React.Fragment>
      {tabIndex === 0 ? (
        <SelectLesson
          setSelectedPlan={setSelectedPlan}
          setTabIndex={setTabIndex}
          clicked={clicked}
          setClicked={setClicked}
        />
      ) : tabIndex === 1 ? (
        <ScheduleSelector
          setTabIndex={setTabIndex}
          duration={selectedPlan.duration}
          setSchedule={setSchedule}
          schedule={schedule}
          tabIndex={tabIndex}
        />
      ) : tabIndex === 2 ? (
        <SelectTutorCards
          tutors={tutors}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          setSelectTutor={setSelectTutor}
        />
      ) : (
        tabIndex === 3 && (
          <LessonConfirmation
            plan={selectedPlan}
            time={schedule}
            tutor={selectTutor}
            setTabIndex={setTabIndex}
            lessonId={null}
          />
        )
      )}
    </React.Fragment>
  )
}

export default ScheduleLesson
