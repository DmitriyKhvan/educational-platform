import React from 'react'
import Layout from '../../components/Layout'

import FavIcon from '../../assets/images/Favorite.png'

import './Mentors.scss'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { MENTORS_QUERY } from '../../modules/auth/graphql'
import MentorsModal from './MentorsModal'
import Loader from '../../components/Loader/Loader'

const filtersList = [
  {
    id: 1,
    caption: 'Sex',
    options: [
      {
        id: 1,
        title: 'Man'
      },
      {
        id: 2,
        title: 'Women'
      }
    ],
    checkbox: false
  },
  {
    id: 2,
    caption: 'school',
    options: [
      {
        id: 1,
        title: 'Harvard'
      },
      {
        id: 2,
        title: 'Cambridge'
      }
    ],
    checkbox: false
  },
  {
    id: 3,
    caption: 'major',
    options: [
      {
        id: 1,
        title: 'Major'
      },
      {
        id: 2,
        title: 'Major'
      }
    ],
    checkbox: false
  }
]

const Mentors = () => {
  const [showTutorModal, setShowTutorModal] = React.useState(false)
  const history = useHistory()
  const { data } = useQuery(MENTORS_QUERY)

  const mentors = data?.tutors

  console.log(mentors)

  const handleStatusTutor = id => {}

  const handleMoreTutor = id => {
    if (id) {
      history.push(`/student/mentors-list/${id}`)
    }

    setShowTutorModal(true)
  }

  const handleFilter = () => {}

  return (
    <Layout>
      <div className='tutors_section'>
        <div className='tutors_title'>
          <h1>Mentors</h1>
          <p>Find new tutors or contact your favorite ones.</p>
        </div>

        <div className='tutors_filters'>
          {filtersList.map(
            item =>
              item.options && (
                <select key={item.id}>
                  {item.options?.map(opt => (
                    <option value={opt.title.toLowerCase()} key={opt.id}>
                      {opt.title}
                    </option>
                  ))}
                </select>
              )
          )}

          <button className='tutors_show'>
            <label>
              <input type={'checkbox'} />
              Show Only Favorite Tutors
            </label>
          </button>
        </div>

        <div className='tutors_row'>
          {mentors?.length === 0 && <p>Empty</p>}

          {!mentors && <Loader height={"50vh"}/>}

          {mentors &&
            mentors.map(item => (
              <div key={item.id} className='tutors_card'>
                <div
                  className='tutors_card-img'
                  style={{
                    background: `url("${item.avatar?.url}") center / cover`
                  }}
                >
                  {item.isFavourite && <img src={FavIcon} alt='' />}
                </div>
                <div className='tutors_card-body'>
                  <div className='tutors_info'>
                    <h2>{item.userName}</h2>
                    <p>{item.university}</p>
                    <span>{item.language}</span>
                  </div>
                  <div className='tutors_control-buttons'>
                    <button onClick={() => handleMoreTutor(item.id)}>
                      Learn more
                    </button>
                    <button onClick={() => handleStatusTutor(item.id)}>
                      {item?.isFavourite ? 'Remove' : 'Favorite'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showTutorModal && (
        <MentorsModal
          tutorsList={mentors}
          handleStatusTutor={handleStatusTutor}
          setShowTutorModal={setShowTutorModal}
        />
      )}
    </Layout>
  )
}

export default Mentors;
