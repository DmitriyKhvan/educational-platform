import { useState } from 'react';
import Layout from '../../../layouts/DashboardLayout';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { useTranslation } from 'react-i18next';
import SelectLessonType from './SelectLessonType';
import SelectTimeOfLesson from './SelectTimeOfLesson';
import LessonConfirmation from './LessonConfirmationDeprecated';
import { useHistory } from 'react-router';
import ModalConfirmLesson from './ModalConfirmLesson';

const ScheduleLessonSteps = () => {
  const history = useHistory();
  const [t] = useTranslation('translation');

  const [tabs, setTabs] = useState([]);

  const [tabIndex, setTabIndex] = useState(1);

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  useState(() => {
    setTabs([
      'select_lesson_type',
      'select_tutor',
      'select_lesson_time',
      'overview_confirmation',
    ]);
  }, [history]);

  const onContinue = (data) => {
    if (tabIndex === 1) {
      setSelectedLesson(data);
      setTabIndex(tabIndex + 1);
    } else if (tabIndex === 2) {
      setSelectedTutor(data);
      setTabIndex(tabIndex + 1);
    } else if (tabIndex === 3) {
      setSelectedTime(data);
      setTabIndex(tabIndex + 1);
    } else if (tabIndex === 4) {
      setVisibleConfirm(true);
    }
  };

  const onBack = () => {
    setTabIndex(tabIndex - 1);
  };

  return (
    <Layout>
      <div className="make-appointment-layout">
        <div className="tab-bar">
          {tabs.map((tab, index) => (
            <div
              key={`tab-${index}`}
              className={tabIndex > index ? 'active' : ''}
            >
              <div>
                <span>{index + 1}</span>
                <span>{t(tab)}</span>
              </div>
            </div>
          ))}
        </div>
        {tabIndex === 1 && (
          <SelectLessonType
            onContinue={onContinue}
            onBack={onBack}
            selectedTime={setSelectedTime}
          />
        )}
        {tabIndex === 2 && (
          <SelectTimeOfLesson onContinue={onContinue} onBack={onBack} />
        )}
        {tabIndex === 3 && (
          <SelectTimeOfLesson
            onContinue={onContinue}
            onBack={onBack}
            selectedTutor={selectedTutor}
          />
        )}
        {/* Overview & Confirmation */}
        {tabIndex === 4 && (
          <LessonConfirmation
            onContinue={onContinue}
            onBack={onBack}
            tutor={selectedTutor}
            time={selectedTime}
            lesson={selectedLesson}
          />
        )}
      </div>
      <ModalConfirmLesson
        visible={visibleConfirm}
        onDismiss={() => setVisibleConfirm(false)}
      />
    </Layout>
  );
};

export default ScheduleLessonSteps;
