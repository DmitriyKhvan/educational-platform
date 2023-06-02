import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Label = ({ label, drilldownView, onDrillDown }) => {
  const [t] = useTranslation('common');
  if (!drilldownView) {
    return <span>{t(label.replace(/[^A-Za-z]+/g, ''))}</span>;
  }

  return <a onClick={onDrillDown}>{t(label)}</a>;
};

Label.propTypes = {
  label: PropTypes.node,
  date: PropTypes.instanceOf(Date),
  drilldownView: PropTypes.string,
  onDrillDown: PropTypes.func,
  isOffRange: PropTypes.bool,
};

const DateHeader = () => {
  return (
    <>
      <span className="rbc-btn-group">
        <button type="button">오늘</button>
        <button type="button">지난달</button>
        <button type="button">다음달</button>
      </span>
      <span className="rbc-toolbar-label">ssspril 2023</span>
      <span className="rbc-btn-group">
        <button type="button" className="rbc-active">
          월
        </button>
        <button type="button" className="">
          주
        </button>
        <button type="button" className="">
          일
        </button>
      </span>
    </>
    // <div className='custom-week-header'>
    //   <div className='dh-item header-right'>
    //     <Label {...{ label, drilldownView, onDrillDown }} />
    //   </div>
    // </div>
  );
};

DateHeader.propTypes = {
  label: PropTypes.node,
  date: PropTypes.instanceOf(Date),
  drilldownView: PropTypes.string,
  onDrillDown: PropTypes.func,
  isOffRange: PropTypes.bool,
};

export default DateHeader;
