import useMultistepForm from '../../components/onboarding/useMultistepForm';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import LoginForm from '../../components/onboarding/LoginForm';
import SelectForm from '../../components/onboarding/SelectForm';
import { useForm } from 'react-hook-form';
import Logo from '../../assets/images/logo.png';
import CredentialsForm from '../../components/onboarding/CredentialsForm';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../../modules/auth/graphql';
import { useHistory } from 'react-router-dom';

export default function Onboarding() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const history = useHistory();

  const [parent] = useAutoAnimate();

  const [signUp] = useMutation(SIGN_UP, {
    onCompleted: () => {
      history.push({
        pathname: '/',
        search: '?redirect=purchase?package=1',
      });
    },
  });

  const { step, currentStepIndex, steps, next, back, isFirst, isLast } =
    useMultistepForm([
      <LoginForm register={register} errors={errors} key="login" />,
      <SelectForm register={register} errors={errors} key="select" />,
      <CredentialsForm register={register} errors={errors} key="credentials" />,
    ]);

  const onSubmit = (data) => {
    if (!isLast) return next();

    signUp({
      variables: data,
    });
  };

  return (
    <main className="flex flex-col relative items-center">
      <img
        className="w-48 md:w-64 my-[8vh] md:my-[12.5vh]"
        src={Logo}
        alt="naonow-logo"
      />
      <div className="max-w-2xl gap-4 w-full px-4">
        <form
          ref={parent}
          onSubmit={handleSubmit(onSubmit)}
          className="w-full block py-8"
        >
          {step}
          <div className="self-start mt-8 flex flex-row gap-4">
            <button
              className="py-2 px-4 bg-purple-800 text-white rounded-md font-bold disabled:bg-opacity-50 disabled:text-gray-200 disabled:cursor-not-allowed duration-200 hover:opacity-75 active:brightness-75 active:scale-95"
              type="button"
              onClick={() => {
                back();
              }}
              disabled={isFirst}
            >
              Back
            </button>
            <input
              className="py-2 px-4 bg-purple-800 text-white rounded-md font-bold duration-200 transition-transform hover:opacity-75 active:brightness-75 active:scale-95"
              type="submit"
              value={isLast ? 'Finish' : 'Next'}
            />
          </div>
        </form>
      </div>
      <div className="absolute flex top-0 w-full bg-purple-200">
        <span
          className={`h-2 bg-purple-800 duration-500 ease-in-out z-10`}
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        ></span>
      </div>
    </main>
  );
}
