import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/Form/Button/Button';

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
          <div className="flex gap-7">
            <Button theme="outline" onClick={save}>
              {t('save', { ns: 'common' })}
            </Button>

            <Button theme="outline" onClick={toggleEdit}>
              {t('cancel', { ns: 'common' })}
            </Button>
          </div>
        ) : (
          <Button theme="outline" onClick={toggleEdit}>
            {t('edit', { ns: 'common' })}
          </Button>
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
