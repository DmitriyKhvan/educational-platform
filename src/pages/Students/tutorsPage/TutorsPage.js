import React from 'react'
import Layout from '../../../components/Layout'

import FavIcon from "../../../assets/images/Favorite.png"
import Tut from "../../../assets/images/nao.png"

import "./TutorsPage.scss"
import TutorMoreModal from './TutorMoreModal'
import { useHistory, useParams } from 'react-router-dom'

const filtersList = [
  {
    id:1,
    caption: "Sex",
    options: [
      {
        id:1,
        title: "Man",
      },
      {
        id:2,
        title: "Women",
      },
    ],
    checkbox: false
  },
  {
    id:2,
    caption: "school",
    options: [
      {
        id:1,
        title: "Harvard",
      },
      {
        id:2,
        title: "Cambridge",
      },
    ],
    checkbox: false
  },
  {
    id:3,
    caption: "major",
    options: [
      {
        id:1,
        title: "Major",
      },
      {
        id:2,
        title: "Major",
      },
    ],
    checkbox: false
  },
 
]

const tutorList = [
  {
    id:1,
    img: Tut,
    name:'Sarah B.',
    univer: "Harvard University",
    lang: "B.A. in English",
    isFavourite: false
  },
  {
    id:2,
    img: "https://media.istockphoto.com/id/1365223878/photo/attractive-man-feeling-cheerful.jpg?b=1&s=170667a&w=0&k=20&c=Pt_reBU6pAQV6cXnIcBSLdtYSB4a_8MJM4qWAO_0leU=",
    name:'Alex T.',
    univer: "Stanford University",
    lang: "B.A. in English",
    isFavourite: false
  },
  {
    id:3,
    img: "https://img.freepik.com/free-photo/lifestyle-people-emotions-and-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-to-help-listening-to-coworkers-taking-part-conversation_1258-59335.jpg?w=2000",
    name:'Caroline W.',
    univer: "Brown University",
    lang: "B.A. in English",
    isFavourite: false
  },
  {
    id:4,
    img: Tut,
    name:'Sarah B.',
    univer: "Harvard University",
    lang: "B.A. in English",
    isFavourite: false
  },
  {
    id:5,
    img:Tut,
    name:'Alex T.',
    univer: "Stanford University",
    lang: "B.A. in English",
    isFavourite: false
  },
  {
    id:6,
    img: Tut,
    name:'Caroline W.',
    univer: "Brown University",
    lang: "B.A. in English",
    isFavourite: false
  },
]

const TutorsPage = () => {
  const [tutors, setTutors] = React.useState(tutorList)
  const [showTutorModal , setShowTutorModal] = React.useState(false)
  const {id} = useParams();
  const history = useHistory();

  const handleStatusTutor = (id) => 
    setTutors(tutors.map(item => {
      if(item.id === id) {
        item.isFavourite = !item.isFavourite;
        return item;
      } else {
        return item;
      } 
  }))

  const handleMoreTutor = (id) => {
    if(id) {
      history.push(`/student/tutors/${id}`)
    }

    setShowTutorModal(true)
  }
  
  return (
    <Layout>
      <div className='tutors_section'>
        <div className='tutors_title'>
          <h1>Tutors</h1>
          <p>
            Find new tutors or contact your favorite ones.
          </p>
        </div>

        <div className='tutors_filters'>
          {
            filtersList.map(item => 
              item.options &&
                <select key={item.id}>
                  {item.options?.map(opt => 
                    <option 
                      value={opt.title.toLowerCase()} 
                      key={opt.id}
                    >
                      {opt.title}
                      
                    </option>  
                  )}
                </select>
            )
          }

          <button className='tutors_show'>
            <label>
              <input type={"checkbox"}/>
              Show Only Favorite Tutors
            </label>
          </button>
        </div>

        <div className='tutors_row'>
          {
            tutors.map(item => 
              <div key={item.id} className='tutors_card'>
                <div className='tutors_card-img' style={{background:`url("${item.img}") center / cover`}}>
                  {item.isFavourite && <img src={FavIcon} alt=''/>}
                </div>
                <div className='tutors_card-body'>
                  <div className='tutors_info'>
                    <h2>{item.name}</h2>
                    <p>{item.univer}</p>
                    <span>{item.lang}</span>
                  </div>
                  <div className='tutors_control-buttons'>
                    <button onClick={() => handleMoreTutor(item.id)}>
                      Learn more
                    </button>
                    <button onClick={() => handleStatusTutor(item.id)}>
                      {item.isFavourite ? "Remove" : "Favorite"}
                    </button>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>

      {showTutorModal && <TutorMoreModal 
        tutorId={id} 
        tutorsList={tutors}
        setTutors={setTutors}
        handleStatusTutor={handleStatusTutor}
        setShowTutorModal={setShowTutorModal}
      />}

    </Layout>
  )
}

export default TutorsPage
