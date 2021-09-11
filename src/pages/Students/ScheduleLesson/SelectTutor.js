import React, { useEffect, useState } from 'react'
import '../../../assets/styles/dashboard.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import { format } from 'date-fns'
import { genders } from '../../../constants/global'
import { Checkbox } from '../../../components/Checkbox'
import TutorCard from '../TutorCard'
import ImgArrowBack from '../../../assets/images/arrow_back.svg'
import ModalTutorBrief from '../ModalTutorBrief'

import { getTutorList } from '../../../actions/tutor'
import Loader from 'react-spinners/ClipLoader'
import { fetchTutors } from '../../../actions/admin'

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

const SelectTutor = ({ selectedTime, onBack, onContinue, isTimeFirst }) => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')
  const [selectedTutor, setSelectedTutor] = useState(-1)
  const majors = [
    { label: t('all'), value: 'all' },
    { label: t('english'), value: 'english' },
    { label: t('korean'), value: 'korean' }
  ]

  const [genderOption, setGenderOption] = useState(genders[0])
  const [majorOption, setMajorOption] = useState(majors[0])
  const [genderAll, setGenders] = useState(genders)
  const [checkedFavouriteTutors, setCheckedFavouriteTutors] = useState(false)
  const [modalBriefVisible, setModalBriefVisible] = useState(false)
  const tutors = useSelector(state =>
    isTimeFirst ? state.tutor.list : state.admin.tutors
  )
  const loading1 = useSelector(state => state.tutor.loading)
  const loading2 = useSelector(state => state.admin.loading)
  const [filterTutors, setFilterTutors] = useState(tutors)

  useEffect(() => {
    let genderAll = [
      { value: 'all', label: t('all') },
      ...genders.map(gender => ({ ...gender, label: t(gender.label) }))
    ]
    setGenders(genderAll)
    setGenderOption(genderAll[0])
    if (isTimeFirst) {
      dispatch(getTutorList(format(selectedTime, "yyyy-MM-dd'T'HH:mm:ss")))
    } else {
      dispatch(fetchTutors())
    }
  }, [dispatch])

  useEffect(() => {
    updateFilter()
    setSelectedTutor(-1)
  }, [genderOption, majorOption, checkedFavouriteTutors])

  useEffect(() => {
    updateFilter()
  }, [tutors])

  const updateFilter = () => {
    let filterTutors = tutors
    if (genderOption.value !== 'all') {
      filterTutors = filterTutors.filter(
        tutor => tutor.gender === genderOption.value
      )
    }
    if (majorOption.value !== 'all') {
      filterTutors = filterTutors.filter(
        tutor => tutor.major === majorOption.value
      )
    }
    if (checkedFavouriteTutors) {
      filterTutors = filterTutors.filter(tutor => tutor.favorite)
    }
    setFilterTutors(filterTutors)
  }

  const onChangeGender = e => {
    setGenderOption(e)
  }

  const onChangeMajor = e => {
    setMajorOption(e)
  }

  const onChangeCheckFavouriteTutors = e => {
    setCheckedFavouriteTutors(!checkedFavouriteTutors)
  }

  const onShowTutorBrief = index => {
    setSelectedTutor(index)
    setModalBriefVisible(true)
  }

  const onDismiss = () => {
    setModalBriefVisible(false)
  }

  const onClickContinue = () => {
    if (selectedTutor === -1) return
    onContinue(filterTutors[selectedTutor])
  }

  return (
    <div className="select-tutor">
      <h4 className="main-title">{t('choose_available_tutors')}</h4>
      <div className="divider" />
      <div className="scroll-layout">
        <div className="filter">
          <div>
            {/* <p>{t('placeholder_sortby')}</p> */}
            <div className="btn-step-back" onClick={onBack}>
              <img src={ImgArrowBack} alt="" />
              <span>{t('step_back')}</span>
            </div>
            <Select
              value={genderOption}
              onChange={onChangeGender}
              options={genderAll}
              styles={customStyles}
              placeholder={t('gender')}
              classNamePrefix="custom-select"
              className="custom-select"
              name="gender"
              getOptionValue={option => option.value}
              getOptionLabel={option => option.label}
            />
            <Select
              value={majorOption}
              onChange={onChangeMajor}
              options={majors}
              styles={customStyles}
              placeholder={t('major')}
              classNamePrefix="custom-select"
              className="custom-select"
              name="major"
              getOptionValue={option => option.value}
              getOptionLabel={option => option.label}
            />
            <Checkbox
              label={t('show_favourite_tutors_only')}
              checked={checkedFavouriteTutors}
              onChange={onChangeCheckFavouriteTutors}
            />
          </div>
          <p>
            {t('show_all_available_tutors', {
              tutors: filterTutors ? filterTutors.length : 0
            })}
          </p>
        </div>
        <div className="tutors-wrapper">
          {loading1 || loading2 ? (
            <Loader
              className="align-center"
              type="Audio"
              color="#00BFFF"
              height={50}
              width={50}
            />
          ) : (
            <>
              {filterTutors.map((tutor, index) => (
                <TutorCard
                  key={`tutorcard-${index}`}
                  tutor={tutor}
                  selected={selectedTutor === index}
                  onSelect={() => setSelectedTutor(index)}
                  onShowTutorBrief={() => onShowTutorBrief(index)}
                />
              ))}
            </>
          )}
        </div>
        <div className="btn-continue" onClick={onClickContinue}>
          {t('continue')}
        </div>
      </div>
      {modalBriefVisible && (
        <ModalTutorBrief
          tutor={tutors[selectedTutor]}
          visible={modalBriefVisible}
          onSelect={() => {}}
          onDismiss={onDismiss}
        />
      )}
    </div>
  )
}

export default SelectTutor
