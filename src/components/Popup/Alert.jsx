import Swal from 'sweetalert2';

const Alert = (
  title,
  message,
  type,
  onConfirm,
  onCancel,
  confirmButtonText,
  cancelButtonText,
  successMsg1,
  successMsg2,
  successMsg3,
  customButtons,
  showCancel = true,
) => {
  Swal.fire({
    title: title,
    text: message,
    icon: type,
    showCancelButton: showCancel,
    confirmButtonColor: '#6133af',
    cancelButtonColor: '#d33',
    cancelButtonText: cancelButtonText,
    confirmButtonText: confirmButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(successMsg1, successMsg2, successMsg3);
      onConfirm();
    } else {
      onCancel();
    }
  });
};

export default Alert;
