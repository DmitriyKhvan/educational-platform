import Button from '@/components/form/button';
import InputField from '@/components/form/input-field';
import type { MutableRefObject, RefObject } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useTermsPrivacyPolicyLinks } from '../lib/use-terms-privacy-policy-links';

function FormCard({
  inputRef,
  formRef,
}: { inputRef: MutableRefObject<HTMLInputElement | null>; formRef: RefObject<HTMLFormElement> }) {
  const { termsAndConditionUrl, privacyPolicyUrl } = useTermsPrivacyPolicyLinks();

  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'refer']);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    mode: 'onTouched',
  });

  const { ref, ...rest } = register('email', {
    required: t('required_email', { ns: 'common' }),
    pattern: {
      value: /^[a-z0-9_\-.]+@([a-z0-9_-]+\.)+[a-z0-9_-]{2,4}$/,
      message: t('error_invalid_email', { ns: 'common' }),
    },
  });

  const onSubmit = (data: { email: string } | undefined) => {
    localStorage.setItem('referralEmail', data?.email || '');
    navigate('/trial');
  };
  return (
    <section
      ref={formRef}
      className="w-full max-w-[360px] sm:max-w-none sm:w-[412px] p-8 relative border border-color-border-grey rounded-lg shadow-[0px_0px_16px_0px_#00000014]"
    >
      <span className="absolute block bg-[#F3EAFD] text-color-purple px-[15px] py-[10px] rounded-[4px] left-1/2 -translate-x-1/2 -translate-y-[calc(50%+32px)]">
        How it works
      </span>
      <div className="text-center mb-8">
        <h2 className="font-bold text-[24px] md:text-[32px]">
          {t('exclusive_deal', { ns: 'refer' })}
        </h2>
        <p className="text-[64px] md:text-[80px] font-bold">$0</p>
        <span>{t('to_get_started', { ns: 'refer' })}</span>
      </div>
      <div className="space-y-4 mb-8">
        <p className="flex items-center gap-4">
          <span className="bg-color-purple bg-opacity-10 p-[6px] block w-8 h-8 rounded-lg">
            <FaCheck className="text-color-purple text-[20px]" />
          </span>
          {t('exclusive_deal_case_1', { ns: 'refer' })}
        </p>
        <p className="flex items-center gap-4">
          <span className="bg-color-purple bg-opacity-10 p-[6px] block w-8 h-8 rounded-lg">
            <FaCheck className="text-color-purple text-[20px]" />
          </span>
          {t('exclusive_deal_case_2', { ns: 'refer' })}
        </p>
        <p className="flex items-center gap-4">
          <span className="bg-color-purple bg-opacity-10 p-[6px] block w-8 h-8 rounded-lg">
            <FaCheck className="text-color-purple text-[20px]" />
          </span>
          {t('exclusive_deal_case_3', { ns: 'refer' })}
        </p>
      </div>

      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          className="w-full focus:ring-2 focus:shadow-none placeholder:text-[#BBBBC4]"
          placeholder={t('email', { ns: 'common' })}
          {...rest}
          name="email"
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
        />
        {errors?.email && <p className="text-red-400 font-bold mt-1">{errors?.email.message}</p>}
        {/* <Button
          type="submit"
          className="w-full h-[64px] my-4 focus:ring-2 focus:shadow-none focus:ring-white"
        >
          {t('start_now_btn', { ns: 'refer' })}
        </Button> */}

        <a href=" https://calendly.com/d/cpxs-8vj-hgc/nao-now?utm_source=dashboard&utm_medium=referral&utm_campaign=refer_a_friend">
          <Button
            type="button"
            className="w-full h-[64px] my-4 focus:ring-2 focus:shadow-none focus:ring-white"
          >
            {t('start_now_btn', { ns: 'refer' })}
          </Button>
        </a>

        <span className="text-center block text-sm">
          {t('terms_policy_start', { ns: 'refer' })} <br />
          <a
            target="_blank"
            rel="noreferrer"
            href={termsAndConditionUrl}
            className="border-b border-color-purple text-color-purple whitespace-nowrap font-medium"
          >
            {t('terms_of_use', { ns: 'refer' })}
          </a>{' '}
          {t('terms_policy_and', { ns: 'refer' })}{' '}
          <a
            href={privacyPolicyUrl}
            target="_blank"
            rel="noreferrer"
            className="border-b border-color-purple text-color-purple whitespace-nowrap font-medium"
          >
            {t('privacy_policy', { ns: 'refer' })}
          </a>
          {t('terms_policy_end', { ns: 'refer' })}.
        </span>
      </form>
    </section>
  );
}

export default FormCard;
