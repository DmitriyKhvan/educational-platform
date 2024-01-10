import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from 'src/components/Form/Button';
import Loader from 'src/components/Loader/Loader';
import { useAuth } from 'src/modules/auth';
import { ACCEPT_NEW_STUDENTS } from 'src/modules/graphql/mutations/acceptNewStudents';
import notify from 'src/utils/notify';

export const AcceptingStudents = () => {
  const [t] = useTranslation('common');
  const { user, refetchUser } = useAuth();
  const [acceptNewStudents, { loading }] = useMutation(ACCEPT_NEW_STUDENTS);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      accept: user.mentor.acceptingStudents,
    },
  });

  const submit = ({ accept }) => {
    acceptNewStudents({
      variables: {
        mentorId: user.mentor.id,
        accept,
      },
      onCompleted: () => {
        refetchUser();
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}
      <div className="container pl-8 pr-6 py-3">
        <h2 className="text-[27px] font-medium leading-[33px] tracking-[-1px]">
          New Student Settings
        </h2>

        <form
          className="flex items-center justify-between mt-5"
          onSubmit={handleSubmit(submit)}
        >
          <div className="form-switch flex items-center">
            <input
              className="form-check-input text-color-purple"
              type="checkbox"
              name="accept"
              {...register('accept')}
            />

            <span className="font-medium">Accept New Students</span>
          </div>

          <Button
            type="submit"
            disabled={user.mentor.acceptingStudents === watch('accept')}
            className="w-[15%]"
          >
            {t('save', { ns: 'common' })}
          </Button>
        </form>
      </div>
    </>
  );
};
