import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import CustomTable from '../../components/CustomTable'

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../../components/Avatar'
import {
  filterLessonsByStatus,
  getAbbrName,
  getAvatarName
} from '../../constants/global'

const options = [
  { value: 'studentName', label: 'student_name' },
  // { value: 'lessonNumber', label: 'lesson_number' },
  { value: 'lessonDate', label: 'lesson_date' }
]

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? '#F2F2F2' : null,
    color: '#000000',
    padding: '8px 0 8px 16px',
    fontSize: 14,
    fontWeight: isSelected ? 600 : 300
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    transform: state.selectProps.menuIsOpen && 'rotate(180deg)'
  })
}

const Lessons = ({
  appointments,
  title,
  status,
  onAction,
  onComplete,
  onFeedback
}) => {
  const [selectedOption, setSelectedOption] = useState()
  const [students, setStudents] = useState([])
  const [t, i18n] = useTranslation('translation')

  useEffect(() => {
    if (appointments && appointments.list) {
      let students = filterLessonsByStatus(status, appointments.list)
      setStudents(students)
    }
  }, [appointments])

  const columns = [
    {
      title: t('student_name'),
      dataKey: 'student',
      width: 30,
      render: (text, record) => (
        <div className='with-avatar'>
          <Avatar
            avatar={record.img}
            name={getAvatarName(record.first_name, record.last_name)}
          />
          <p>{getAbbrName(record.first_name, record.last_name)}</p>
        </div>
      )
    },
    {
      title: t('lesson'),
      dataKey: 'lessonType',
      width: 30,
      render: (text, record) => <p className='lesson-type'>{text}</p>
    },
    // {
    //   title: t('lesson_number'),
    //   dataKey: 'id',
    //   width: 30,
    // },
    {
      title: t('lesson_date'),
      dataKey: 'lessonDate',
      width: 30
    }
  ]

  if (onComplete) {
    columns.push({
      title: t('completed'),
      dataKey: 'completed',
      width: 20,
      render: (item, record) => (
        <div className='actions'>
          {record.completed ? (
            <a onClick={() => onComplete(record)} className='edit'>
              {t('edit')}
            </a>
          ) : (
            <a onClick={() => onComplete(record)}>{t('complete')}</a>
          )}
        </div>
      )
    })
  }

  columns.push({
    title: 'Actions',
    dataKey: 'actions',
    width: 20,
    render: (item, record) => (
      <div className='actions'>
        {onAction ? (
          <a onClick={() => onAction(record, status)}>{t('view_detail')}</a>
        ) : (
          <Link
            to={{
              pathname: `/tutor/students/${record.studentId}`,
              state: { student: record.student }
            }}
          >
            {t('view_detail')}
          </Link>
        )}
      </div>
    )
  })

  if (onFeedback) {
    columns.push({
      title: t('feedback'),
      dataKey: 'feedback',
      width: 20,
      render: (item, record) => (
        <div className='actions'>
          {record.feedbacks.length > 0 ? (
            <a className='given-feedback'>{t('feedback_complete')}</a>
          ) : (
            <a onClick={() => onFeedback(record)}>{t('feedback')}</a>
          )}
        </div>
      )
    })
  }

  const handleChange = option => {
    setSelectedOption(option)
    switch (option.value) {
      case 'studentName':
        students.sort(function (a, b) {
          const aa = a.student.user.first_name + a.student.user.last_name
          const bb = b.student.user.first_name + b.student.user.last_name
          return aa.localeCompare(bb)
        })
        break
      case 'lessonNumber':
        students.sort(function (a, b) {
          return a.id - b.id
        })
        break
      case 'lessonDate':
        students.sort(function (a, b) {
          return new Date(b['lessonDate']) - new Date(a['lessonDate'])
        })
        break
    }
    setStudents(students)
  }

  return (
    <>
      <div className='page-header'>
        <h4 className='main-title'>{title}</h4>
        <Select
          value={selectedOption}
          onChange={handleChange}
          options={options.map(opt => ({
            value: opt.value,
            label: t(opt.label)
          }))}
          styles={customStyles}
          placeholder='Sort By'
          classNamePrefix='custom-select'
          className='custom-select'
          name='sortBy'
          rules={{ required: 'Please select an option' }}
          getOptionValue={option => option.value}
          getOptionLabel={option => option.label}
        />
      </div>
      <div className='divider' />
      {appointments && !appointments.loading && (
        <CustomTable data={students} columns={columns} type='student' />
      )}
    </>
  )
}

export default Lessons
