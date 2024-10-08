import { type ForwardedRef, type ReactNode, forwardRef } from 'react';

interface InputWithErrorProps {
  errorsField?: {
    message?: string;
    languageLevelId?: string;
    lessonTopicId?: string;
    lessonTypeId?: string;
    name?: string;
    rating?: string;
  };

  children: ReactNode;
}

const InputWithError = forwardRef(function InputWithError(
  { errorsField, children }: InputWithErrorProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div ref={ref}>
      {children}
      {errorsField && <p className="text-[#df1b41] mt-1">{errorsField.message}</p>}
      {/* {JSON.stringify(errorsField, null, 2)} */}
    </div>
  );
});

export default InputWithError;
