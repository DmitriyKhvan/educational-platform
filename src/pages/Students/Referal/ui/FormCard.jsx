import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Button from 'src/components/Form/Button';
import InputField from 'src/components/Form/InputField';

function FormCard({ inputRef }) {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const { ref, ...rest } = register('email', {
    required: t('required_email'),
    pattern: {
      value: /^[a-z0-9_\-.]+@([a-z0-9_-]+\.)+[a-z0-9_-]{2,4}$/,
      message: t('error_invalid_email'),
    },
  });

  const onSubmit = (data) => {
    localStorage.setItem('referralEmail', data?.email || '');
    navigate('/trial');
  };
  return (
    <section className="w-[412px] p-8 relative border border-color-border-grey rounded-lg shadow-[0px_0px_16px_0px_#00000014]">
      <span className="absolute block bg-[#F3EAFD] text-color-purple px-[15px] py-[10px] rounded-[4px] left-1/2 -translate-x-1/2 -translate-y-[calc(50%+32px)]">
        How it works
      </span>
      <div className="text-center mb-8">
        <h2 className="font-bold text-[32px]">
          Exclusive deal for friends of Nao Now
        </h2>
        <p className="text-[80px] font-bold">$0</p>
        <span>to get started</span>
      </div>
      <div className="space-y-4 mb-8">
        <p className="flex items-center gap-4">
          <span className="bg-color-purple bg-opacity-10 p-[6px] block w-8 h-8 rounded-lg">
            <FaCheck className="text-color-purple text-[20px]" />
          </span>
          FREE trial and 15% off first package
        </p>
        <p className="flex items-center gap-4">
          <span className="bg-color-purple bg-opacity-10 p-[6px] block w-8 h-8 rounded-lg">
            <FaCheck className="text-color-purple text-[20px]" />
          </span>
          Access to top native English speakers
        </p>
        <p className="flex items-center gap-4">
          <span className="bg-color-purple bg-opacity-10 p-[6px] block w-8 h-8 rounded-lg">
            <FaCheck className="text-color-purple text-[20px]" />
          </span>
          Speaking-focused curriculum
        </p>
      </div>

      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          className="w-full focus:ring-2 focus:shadow-none placeholder:text-[#BBBBC4]"
          placeholder="Enter your email"
          {...rest}
          name="email"
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
        />
        {errors?.email && (
          <p className="text-red-400 font-bold mt-1">{errors?.email.message}</p>
        )}
        <Button
          type="submit"
          className="w-full h-[64px] my-4 focus:ring-2 focus:shadow-none focus:ring-white"
        >
          Start now with a FREE TRIAL
        </Button>
        <span className="text-center block text-sm">
          By getting started, you agree to our <br />
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.naonow.com/terms-and-conditions"
            className="border-b border-color-purple text-color-purple whitespace-nowrap font-medium"
          >
            Terms of Use
          </a>{' '}
          and{' '}
          <a
            href="https://www.naonow.com/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="border-b border-color-purple text-color-purple whitespace-nowrap font-medium"
          >
            Privacy Policy
          </a>
          .
        </span>
      </form>
    </section>
  );
}

export default FormCard;
