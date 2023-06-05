import useMultistepForm from '../../components/onboarding/useMultistepForm';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import LoginForm from '../../components/onboarding/LoginForm';
import SelectForm from '../../components/onboarding/SelectForm';
import { useForm } from 'react-hook-form';
import Logo from '../../assets/images/logo.png';
import CredentialsForm from '../../components/onboarding/CredentialsForm';

export default function Onboarding() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [parent] = useAutoAnimate();

  const { step, currentStepIndex, steps, next, back, isFirst, isLast } =
    useMultistepForm([
      <LoginForm register={register} errors={errors} key="login" />,
      <SelectForm register={register} errors={errors} key="select" />,
      <CredentialsForm register={register} errors={errors} key="credentials" />,
    ]);

  const onSubmit = (data) => {
    console.log(currentStepIndex);
    if (!isLast) return next();
    console.log(data);
    alert(data);
  };

  return (
    <>
      <div className="max-w-2xl px-4 m-auto flex flex-col justify-center items-center min-h-screen gap-4">
        <img className="w-64 mb-8" src={Logo} alt="naonow-logo" />
        <form
          ref={parent}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full min-h-[16rem] justify-center"
        >
          {step}
          <div className="flex flex-row justify-start self-start gap-4 mt-8">
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
          className={`h-2 bg-purple-800 duration-300 ease-in-out z-10`}
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        ></span>
      </div>
    </>
  );
}
