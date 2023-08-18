import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Introduction({ text: baseText, onChange }) {
  const [t] = useTranslation(['profile', 'common', 'lessons']);
  const [isEdit, setIsEdit] = useState(false);
  const [text, setText] = useState(baseText);

  useEffect(() => setText(baseText), [baseText]);

  const toggleEdit = () => setIsEdit((isEdit) => !isEdit);

  const save = () => {
    toggleEdit();
    if (typeof onChange === 'function') onChange(text);
  };

  return (
    <div className="edit_summary">
      <header>
        <h2>{t('summary')}</h2>
        {isEdit ? (
          <div>
            <button onClick={save}>
              {t('save', { ns: 'common' })}
            </button>
            <button onClick={toggleEdit}>
              {t('cancel', { ns: 'common' })}
            </button>
          </div>
        ) : (
          <button onClick={toggleEdit}>
            {t('edit', { ns: 'common' })}
          </button>
        )}
      </header>

      {isEdit ? (
        <textarea
          onChange={(e) => setText(e.target.value)}
          className="edit_summary_textarea"
          defaultValue={text}
        ></textarea>
      ) : !text ? (
        <button className='underline decoration-dotted cursor-pointer' onClick={toggleEdit}>
          Add introduction about yourself
        </button>
      ) : (
        <p>{text}</p>
      )}
    </div>
  )
}
