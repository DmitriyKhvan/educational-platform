import Button from '@/components/form/button';
import { MyDialog } from '@/components/my-dialog';
import { BsFillExclamationTriangleFill } from 'react-icons/bs';
// import Button from "src/components/Form/Button";
// import { MyDialog } from "src/components/MyDialog";

function CloseConfirmationModal({ open, setOpen, onCloseClick }) {
  return (
    <MyDialog
      open={open}
      setOpen={setOpen}
      // button={button}
      // hideCloseBtn={hideCloseBtn}
      overlayClassname="z-50"
      className="z-50 text-center"
    >
      <span className="flex mb-4 justify-center items-center mx-auto w-10 h-10 bg-color-red bg-opacity-10 rounded-lg">
        <BsFillExclamationTriangleFill className="text-color-red text-xl" width={20} height={20} />
      </span>
      <h2 className="text-[22px] mb-4 font-bold">Changes won’t be applied</h2>
      <p className="max-w-[336px] mb-6">
        If you will close a popup changes that you’ve made on booking won’t be applied.
      </p>
      {/* Are you sure to close? */}
      <Button
        onClick={() => {
          setOpen(false);
        }}
        className="w-full mb-3 h-14"
      >
        Back to popup
      </Button>
      <Button
        onClick={() => {
          onCloseClick();
        }}
        className="w-full h-14"
        theme="gray"
      >
        Close
      </Button>
    </MyDialog>
  );
}

export default CloseConfirmationModal;
