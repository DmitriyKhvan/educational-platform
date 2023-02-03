import React from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import styles from './LessonInfo.module.scss'
import Avatar from '../../assets/images/Avatar.png'

const LessonInfo = () => {
  const { lessonID } = useParams()

  return (
    <Layout>
      <div className={styles.header}>
        <h1>Lesson Info</h1>
        <div className={styles.actions}>
          <button disabled>Start Lesson</button>
          <button>Edit Lesson</button>
          <button>Contact Support</button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.general_info}>
            <h2>General Information</h2>
            <div className={styles.info}>
              <div className={styles.info_item}>
                <h3>Topic Name</h3>
                <p>Jurassic Park Lesson</p>
              </div>
              <div className={styles.info_item}>
                <h3>Level</h3>
                <p>Level 3</p>
              </div>
              <div className={styles.info_item}>
                <h3>Date and Time</h3>
                <p>January 14th, 2022 1:00 PM → 1:30 PM (PDT)</p>
              </div>
              <div className={styles.info_item}>
                <h3>Duration</h3>
                <p>30 minutes</p>
              </div>
              <div className={styles.info_item}>
                <h3>Lesson Format</h3>
                <p>Private</p>
              </div>
              <div className={styles.info_item}>
                <h3>Lesson Type</h3>
                <p>English</p>
              </div>
            </div>
          </div>
          <div className={styles.attendants}>
            <div className={styles.attendants_header}>
              <h2>Attendants</h2>
            </div>
            <div className={styles.attendants_item}>
              <img src={Avatar} alt='profile' />
              <h4 className={styles.name}>Rachel</h4>
              <span className={styles.status}>Tutor</span>
            </div>
            <div className={styles.attendants_item}>
              <img src={Avatar} alt='profile' />
              <h4 className={styles.name}>Rachel</h4>
              <span className={styles.status}>Tutor</span>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.progress}>
            <div className={styles.progress_header}>
              <h2>Class Progress</h2>
            </div>
            <div className={styles.progress_item}>
              <h3>Topic Video</h3>
              <p>In Progress</p>
            </div>
            <div className={styles.progress_item}>
              <h3>Vocabulary Game</h3>
              <p>Completed</p>
            </div>
            <div className={styles.progress_item}>
              <h3>Vocabulary Video</h3>
              <p>Completed</p>
            </div>
            <div className={styles.progress_item}>
              <h3>Vocabulary Section</h3>
              <p>Completed</p>
            </div>
            <div className={styles.progress_item}>
              <h3>Warm Up Exercises</h3>
              <p>Completed</p>
            </div>
            <div className={styles.progress_item}>
              <h3>Overview</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className={styles.homework}>
            <div className={styles.homework_header}>
              <h2>Homework</h2>
            </div>
            <div className={styles.homework_card}>
              <div>
                <h3 className={styles.homework_name}>Class Homework</h3>
                <p className={styles.homework_status}>Reviewed</p>
              </div>
              <button>{'\u2192'}</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LessonInfo
