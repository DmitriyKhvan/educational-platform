import React, { useEffect, useState } from 'react';
import '../../../assets/styles/dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { genders } from '../../../constants/global';
import { Checkbox } from '../../../components/Checkbox';
import TutorCard from '../TutorCard';
import ImgArrowBack from '../../../assets/images/arrow_back.svg';
import ModalTutorBrief from '../ModalTutorBrief';
import NotificationManager from '../../../components/NotificationManager';

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? '#F2F2F2' : null,
    color: '#000000',
    padding: '8px 0 8px 16px',
    fontSize: 14,
    fontWeight: isSelected ? 600 : 300,
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    transform: state.selectProps.menuIsOpen && 'rotate(180deg)',
  }),
};

const tutors = [
  {
    name: 'Hudson Jaslyn',
    points: 5,
    isFavourite: true,
    university: 'Panorama Conservatory',
    location: 'Ohio, US',
    major: 'MEDIA, CULTURE & BRANDING',
    acceptanceRate: 100,
    avatar: 'preset_0',
    gender: 'male',
    introVideo: 'https://player.vimeo.com/video/548217629',
    reviews: [
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
    ],
  },
  {
    name: 'Hudson Jaslyn',
    points: 0.7,
    isFavourite: false,
    university: 'Panorama Conservatory',
    location: 'Ohio, US',
    major: 'MEDIA, CULTURE & BRANDING',
    acceptanceRate: 100,
    avatar: 'preset_0',
    gender: 'female',
    introVideo: 'https://player.vimeo.com/video/548217629',
    reviews: [
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
    ],
  },
  {
    name: 'Hudson Jaslyn',
    points: 3.5,
    isFavourite: false,
    university: 'Panorama Conservatory',
    location: 'Ohio, US',
    major: 'MEDIA, CULTURE & BRANDING',
    acceptanceRate: 100,
    avatar: 'preset_0',
    gender: 'female',
    introVideo: 'https://player.vimeo.com/video/548217629',
    reviews: [
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
    ],
  },
  {
    name: 'Hudson Jaslyn',
    points: 5,
    isFavourite: true,
    university: 'Panorama Conservatory',
    location: 'Ohio, US',
    major: 'MEDIA, CULTURE & BRANDING',
    acceptanceRate: 100,
    avatar: 'preset_0',
    gender: 'male',
    introVideo: 'https://player.vimeo.com/video/548217629',
    reviews: [
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
    ],
  },
  {
    name: 'Hudson Jaslyn',
    points: 4.8,
    isFavourite: false,
    university: 'Panorama Conservatory',
    location: 'Ohio, US',
    major: 'MEDIA, CULTURE & BRANDING',
    acceptanceRate: 100,
    avatar: 'preset_0',
    gender: 'male',
    introVideo: 'https://player.vimeo.com/video/548217629',
    reviews: [
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
      {
        review:
          'Nullam vel neque pulvinar, tristique ipsum sagittis, viverra ligula. Cras eu tortor auctor, vestibulum augue ultricies, efficitur nibh. In ornare maximus leo sit amet lobortis. Fusce quis libero luctus eros convallis finibus laoreet at justo. Nam dui libero, rutrum laoreet sapien nec, lacinia pretium neque. Fusce suscipit libero semper nisl venenatis sodales.',
        points: 4.5,
        avatar: 'preset_1',
        from: 'Carolina T.',
        provided_at: new Date(),
      },
    ],
  },
];

const SelectTutor = (props) => {
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation('translation');
  const [selectedTutor, setSelectedTutor] = useState(-1);
  const majors = [
    { label: t('all'), value: 'all' },
    { label: t('english'), value: 'english' },
    { label: t('korean'), value: 'korean' },
  ];

  const [genderOption, setGenderOption] = useState(genders[0]);
  const [majorOption, setMajorOption] = useState(majors[0]);
  const [filterTutors, setFilterTutors] = useState(tutors);
  const [genderAll, setGenders] = useState(genders);
  const [checkedFavouriteTutors, setCheckedFavouriteTutors] = useState(false);
  const [modalBriefVisible, setModalBriefVisible] = useState(false);

  useEffect(() => {
    let genderAll = [
      { value: 'all', label: t('all') },
      ...genders.map((gender) => ({ ...gender, label: t(gender.label) })),
    ];
    setGenders(genderAll);
    setGenderOption(genderAll[0]);
  }, [dispatch]);

  useEffect(() => {
    updateFilter();
    setSelectedTutor(-1);
  }, [genderOption, majorOption, checkedFavouriteTutors]);

  const updateFilter = () => {
    let filterTutors = tutors;
    if (genderOption.value !== 'all') {
      filterTutors = filterTutors.filter(
        (tutor) => tutor.gender === genderOption.value,
      );
    }
    if (majorOption.value !== 'all') {
      filterTutors = filterTutors.filter(
        (tutor) => tutor.major === majorOption.value,
      );
    }
    if (checkedFavouriteTutors) {
      filterTutors = filterTutors.filter((tutor) => tutor.favorite);
    }
    setFilterTutors(filterTutors);
  };

  const onChangeGender = (e) => {
    setGenderOption(e);
  };

  const onChangeMajor = (e) => {
    setMajorOption(e);
  };

  const onChangeCheckFavouriteTutors = (e) => {
    setCheckedFavouriteTutors(!checkedFavouriteTutors);
  };

  const onShowTutorBrief = (index) => {
    setSelectedTutor(index);
    setModalBriefVisible(true);
  };

  const onDismiss = () => {
    setModalBriefVisible(false);
  };

  const onContinue = () => {
    if (selectedTutor === -1) return;
    props.onContinue(filterTutors[selectedTutor]);
  };

  return (
    <div className="select-tutor">
      <h4 className="main-title">{t('choose_available_tutors')}</h4>
      <div className="divider" />
      <div className="scroll-layout">
        <div className="filter">
          <div>
            {/* <p>{t('placeholder_sortby')}</p> */}
            <div className="btn-step-back" onClick={props.onBack}>
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
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
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
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
            />
            <Checkbox
              label={t('show_favourite_tutors_only')}
              checked={checkedFavouriteTutors}
              onChange={onChangeCheckFavouriteTutors}
            />
          </div>
          <p>{t('show_all_available_tutors', { tutors: 14 })}</p>
        </div>
        <div className="tutors-wrapper">
          {filterTutors.map((tutor, index) => (
            <TutorCard
              key={`tutorcard-${index}`}
              tutor={tutor}
              selected={selectedTutor === index}
              onSelect={() => setSelectedTutor(index)}
              onShowTutorBrief={() => onShowTutorBrief(index)}
            />
          ))}
        </div>
        <div className="btn-continue" onClick={onContinue}>
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
  );
};

export default SelectTutor;
