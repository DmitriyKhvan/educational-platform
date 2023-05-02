import React, { useEffect, useState } from 'react';

import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import CustomTable from '../../components/CustomTable';
import { useTranslation } from 'react-i18next';
import Stars from '../../components/Stars';
import { Avatar } from '../../components/Avatar';
import { fetchTutors, getUserById } from '../../actions/admin';
import { getAbbrName, getAvatarName } from '../../constants/global';

import Loader from 'react-spinners/ClipLoader';
import { ModalUserInfo } from './ModalUserInfo';
import Profile from '../../newPages/profile/SwitchProfile';
import ConfirmationModal from '../../components/ConfirmationModal';
import '../../assets/styles/admin.scss';
import { deleteTutor } from '../../actions/tutor';
import TutorApi from '../../api/TutorApi';

const options = [
  { value: 'name', label: 'name_az' },
  { value: 'tutor_rating', label: 'tutor_rating' },
  { value: 'total_hours', label: 'total_hours_taught' },
  { value: 'last_lesson_date', label: 'last_lesson_date' },
];

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? '#F2F2F2' : null,
    color: '#000000',
    padding: '8px 0 8px 16px',
    fontSize: 14,
    fontWeight: isSelected ? 600 : 300,
    width: '300px',
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    transform: state.selectProps.menuIsOpen && 'rotate(180deg)',
  }),
};

const TutorList = () => {
  const [t, i18n] = useTranslation('translation');

  const columns = [
    {
      title: t('tutor_name'),
      dataKey: 'name',
      width: 20,
      render: (text, record) => (
        <div className="with-avatar">
          <Avatar
            avatar={record.avatar}
            name={getAvatarName(record.first_name, record.last_name)}
          />
          <p>{getAbbrName(record.first_name, record.last_name)}</p>
        </div>
      ),
    },
    {
      title: t('rating'),
      dataKey: 'average_review',
      width: 20,
      render: (rating, record) => <Stars points={rating} />,
    },
    {
      title: t('total_hours_taught'),
      dataKey: t('total_lesson_minutes'),
      width: 20,
      render: (total_hours) => (
        <span>
          {total_hours ? total_hours / 60 : 0} {t('hrs')}
        </span>
      ),
    },
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
          <a href="#" onClick={() => setSelectedUser(record)}>
            {t('view_profile')}
          </a>
          <a href="#" onClick={() => setDeleteForUser(record)}>
            {t('delete')}
          </a>
        </div>
      ),
    },
  ];

  const [selectedOption, setSelectedOption] = useState(
    options.map((opt) => ({ ...opt, label: t(opt.label) }))[0],
  );
  const { tutors, loading } = useSelector((state) => state.admin);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [subname, setSubname] = useState('');
  const [hasmore, setHasmore] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteForUser, setDeleteForUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.admin.user);

  const dispatch = useDispatch();

  useEffect(async () => {
    if (dispatch) {
      if (offset === -1) setOffset(0);
      else fetchData();
    }
  }, [dispatch, offset]);

  useEffect(() => {
    if (selectedUser && selectedUser.user_id) {
      dispatch(getUserById(selectedUser.user_id));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (user && selectedUser) {
      setIsShowModal(true);
    }
  }, [user]);

  const fetchData = async () => {
    const res = await dispatch(
      fetchTutors({
        tutor_name: subname,
        limit,
        offset,
        sort: selectedOption.value,
      }),
    );
    if (res.payload.tutors.length === limit) {
      setHasmore(true);
    } else {
      setHasmore(false);
    }
  };

  const handleChange = (option) => {
    setSelectedOption(option);
    setOffset(-1);
  };

  const deleteUser = async () => {
    try {
      setIsLoading(true);
      const res = await TutorApi.delete(deleteForUser.id);
      fetchData();
    } catch (e) {}
    setIsLoading(false);
    setDeleteForUser(null);

    // dispatch(deleteTutor(deleteForUser?.id));
    // setDeleteForUser(null);
  };

  return (
    <Layout>
      <div className="tutor-list-layout">
        <div className="page-header">
          <h4 className="main-title">{t('tutor_list')}</h4>
          <div className="controls">
            <div className="search">
              <input
                type="text"
                placeholder={t('search_tutor')}
                value={subname}
                onChange={(e) => {
                  setSubname(e.target.value);
                  setOffset(-1);
                }}
              />
            </div>
            <Select
              value={selectedOption}
              onChange={handleChange}
              options={options.map((opt) => ({ ...opt, label: t(opt.label) }))}
              styles={customStyles}
              placeholder={t('placeholder_sortby')}
              classNamePrefix="custom-select"
              className="custom-select"
              name="sortBy"
              rules={{ required: t('error_select_an_option') }}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
              isSearchable={false}
            />
          </div>
        </div>
        <div className="divider" />
        <div className="scroll-layout">
          {tutors.length > 0 && (
            <CustomTable data={tutors} columns={columns} enableSeeAll={false} />
          )}
          {loading && (
            <div className="text-align-center">
              <Loader
                className="align-center"
                type="Audio"
                color="#00BFFF"
                height={50}
                width={50}
              />
            </div>
          )}
          {hasmore && !loading && (
            <div
              className="see-more-all-btn"
              onClick={() => {
                setOffset(offset + limit);
              }}
            >
              {t('see_more')}
            </div>
          )}
        </div>
      </div>
      {isShowModal && (
        <ModalUserInfo
          title="Tutor Profile"
          visible={isShowModal}
          onDismiss={() => {
            setIsShowModal(false);
            setSelectedUser(null);
          }}
        >
          <div className="scroll-layout">
            <Profile user={user} isAdmin={true} />
          </div>
        </ModalUserInfo>
      )}
      <ConfirmationModal
        visible={!!deleteForUser}
        onSuccess={deleteUser}
        onCancel={() => {
          setDeleteForUser(null);
        }}
        description="delete_tutor"
      />
    </Layout>
  );
};

export default TutorList;
