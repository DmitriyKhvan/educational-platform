import React from 'react';
import Select from 'react-select';
import CustomTable from '../../components/CustomTable';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components/Avatar';
import { getAbbrName, getAvatarName } from '../../constants/global';

const options = [
  { value: 'name', label: 'student_name' },
  { value: 'level', label: 'level' },
  { value: 'last_lesson_date', label: 'lesson_date' },
  { value: 'last_lesson_number', label: 'lesson_number' },
];

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

const Students = ({ students, title, sort, setSort }) => {
  const [t, i18n] = useTranslation('translation');

  const columns = [
    {
      title: t('student_name'),
      dataKey: 'studentName',
      width: 30,
      render: (text, record) => (
        <div className="with-avatar">
          <Avatar
            avatar={record.img}
            name={getAvatarName(record.first_name, record.last_name)}
          />
          <p>{getAbbrName(record.first_name, record.last_name)}</p>
        </div>
      ),
    },
    {
      title: t('level'),
      dataKey: 'level',
      width: 30,
    },
    // {
    //   title: t('lesson'),
    //   dataKey: 'last_lesson',
    //   width: 30,
    // },
    {
      title: t('last_lesson_date'),
      dataKey: 'last_lessontime',
      width: 30,
    },
    {
      title: '',
      dataKey: 'actions',
      width: 10,
      render: (item, record) => (
        <div className="actions">
          <Link
            to={{
              pathname: `/tutor/students/${record.id}`,
              state: { student: record },
            }}
          >
            {t('view_detail')}
          </Link>
        </div>
      ),
    },
  ];

  const handleChange = (option) => {
    setSort(option);
    // setSelectedOption(option);
    // switch (option) {
    //   case 'studentName':
    //     students.sort(function (a, b) {
    //       return a['studentName'].localeCompare(b['studentName']);
    //     });
    //     break;
    //   case 'lessonNumber':
    //     students.sort(function (a, b) {
    //       return a['lessonNumber'] - b['studentName'];
    //     });
    //     break;
    //   case 'lessonDate':
    //     students.sort(function (a, b) {
    //       return new Date(a['lessonDate']) - new Date(b['lessonDate']);
    //     });
    //     break;
    // }
    // setStudents(students);
  };

  return (
    <>
      <div className="page-header">
        <h4 className="main-title">{title}</h4>
        <Select
          value={sort}
          onChange={handleChange}
          options={options.map((opt) => ({ ...opt, label: t(opt.label) }))}
          styles={customStyles}
          placeholder="Sort By"
          classNamePrefix="custom-select"
          className="custom-select"
          name="sortBy"
          rules={{ required: t('error_select_an_option') }}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.label}
        />
      </div>
      <div className="divider" />
      {students && (
        <CustomTable data={students} columns={columns} type="student" />
      )}
    </>
  );
};

export default Students;
