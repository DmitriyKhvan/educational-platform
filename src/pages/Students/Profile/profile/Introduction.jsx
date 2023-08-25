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
    <div className="edit_summary mt-8">
      <header className="flex items-center justify-between mb-5">
        <h2 className="m-0 text-xl font-medium text-color-dark-purple">
          {t('summary')}
        </h2>
        {isEdit ? (
          <div>
            <button
              className="bg-white p-[10px] leading-4 cursor-pointer font-semibold text-color-dark-purple border border-solid border-color-border-grey rounded-md"
              onClick={save}
            >
              {t('save', { ns: 'common' })}
            </button>
            <button
              className="bg-white p-[10px] leading-4 cursor-pointer font-semibold text-color-dark-purple border border-solid border-color-border-grey rounded-md"
              onClick={toggleEdit}
            >
              {t('cancel', { ns: 'common' })}
            </button>
          </div>
        ) : (
          <button
            className="bg-white p-[10px] leading-4 cursor-pointer font-semibold text-color-dark-purple border border-solid border-color-border-grey rounded-md"
            onClick={toggleEdit}
          >
            {t('edit', { ns: 'common' })}
          </button>
        )}
      </header>

      {isEdit ? (
        <textarea
          onChange={(e) => setText(e.target.value)}
          className="h-60 border border-solid border-color-border-grey p-5 leading-6"
          defaultValue={text}
        ></textarea>
      ) : !text ? (
        <button
          className="underline decoration-dotted cursor-pointer"
          onClick={toggleEdit}
        >
          Add introduction about yourself
        </button>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
}
