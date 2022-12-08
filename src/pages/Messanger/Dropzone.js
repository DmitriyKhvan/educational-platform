import React from 'react'
import { useForm } from 'react-hook-form';
import AttachmentIcon from '../../assets/images/Attachment icon.png';

const DropzoneMessage = () => {
  const [isChangeInput, setChangeInput] = React.useState(false)

  const {
    handleSubmit,
    register
  } = useForm()

  const onSubmit = (data) => {
    console.log(data)
    setChangeInput(false)
  }

  

  return (
    <div className="input_area">
      <img src={AttachmentIcon} alt=""/>

      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea  
          className={isChangeInput && "activeInput"}
          placeholder={isChangeInput ? "Message being written...." : 'Student message'}
          {...register("message")}
          onClick={() => setChangeInput(true)}
        />

        <button type='submit'>Send</button>
      </form>
    </div>
  )
}

export default DropzoneMessage;
