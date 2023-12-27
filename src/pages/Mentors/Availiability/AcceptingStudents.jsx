import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import Button from 'src/components/Form/Button';
import { useAuth } from 'src/modules/auth';
import { ACCEPT_NEW_STUDENTS } from 'src/modules/graphql/mutations/acceptNewStudents';

export const AcceptingStudents = () => {
  const { user } = useAuth();
  const [acceptNewStudents] = useMutation(ACCEPT_NEW_STUDENTS);

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm();

  const submit = ({ accept }) => {
    acceptNewStudents({
      variables: {
        mentorId: user.mentor.id,
        accept,
      },
    });
  };

  return (
    <div className="px-8 py-3">
      <h2 className="text-[27px] font-medium leading-[33px] tracking-[-1px]">
        New Student Settings
      </h2>

      <form
        className="flex items-center justify-between mt-5"
        onSubmit={handleSubmit(submit)}
      >
        <div className="form-switch flex items-center">
          <input
            className="form-check-input"
            type="checkbox"
            name="accept"
            {...register('accept')}
          />

          <span className="font-medium">Accept New Students</span>
        </div>

        <Button type="submit" disabled={!isDirty} className="w-[15%]">
          Save
        </Button>
      </form>
    </div>
  );
};
