import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AttachmentIcon from '../../assets/images/Attachment icon.png';

const DropzoneMessage = ({ onSend }) => {
  const [isChangeInput, setChangeInput] = useState(false);
  const { handleSubmit, register, setValue } = useForm();

  const onSubmit = (data) => {
    onSend(data.message);
    setValue('message', '');
    setChangeInput(false);
  };

  return (
    <div className="input_area">
      <img src={AttachmentIcon} alt="" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          className={isChangeInput ? 'activeInput' : ''}
          placeholder={
            isChangeInput ? 'Message being written....' : 'Student message'
          }
          {...register('message')}
          onClick={() => setChangeInput(true)}
          // onBlur={() => setChangeInput(false)}
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default DropzoneMessage;
