import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../modules/auth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const history = useHistory()
  const [t] = useTranslation('translation')
  const [token, setToken] = useState()
  const location = useLocation();
  const params = new URLSearchParams(window.location.search);
  const queryToken = params.get('token');
  const queryEmail = params.get("email");

  const { newPassword, refetchUser } = useAuth();
  const notify = () => toast("Password has been reset!");


  const {
    register,
    handleSubmit
  } = useForm({
    mode:"onBlur",
  }); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setToken(urlParams.get('token'))
  }, [token])

  const [error, setError] = useState('')

  const handleResetPassword = async ({password, confirmPassword}) => {
    if (!password) {
      setError(t('error_field_not_empty'))
      return false
    }

    if (password !== confirmPassword) {
      setError(t('confirm_password_error'))
      return false
    }

    if(password === confirmPassword) {
      const { data } = await newPassword(queryEmail , queryToken, password);

      if(data) {
        notify()
      }
    }

    await refetchUser()
  }

  return (
    <AuthLayout>
      <div className='auth-login'>
        <p className='title text-center mb-3'>{t('reset_password')}</p>
        <form onSubmit={handleSubmit(handleResetPassword)} className='form-section'>
          <div className='mb-3'>
            <div className='form-item-inner'>
              <label htmlFor='password' className='form-label'>
                <strong>{t('new_password')}</strong>
              </label>
              <input
                className='form-control'
                type='password'
                id='password'
                name='password'
                {...register("password")}
              />
            </div>
          </div>

          <div className='form-item-inner'>
            <label htmlFor='confirmPassword' className='form-label'>
              <strong>{t('confirm_new_password')}</strong>
            </label>
            <input
              className='form-control'
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              {...register("confirmPassword")}
            />
          </div>
          {error && <p className='error-msg'>{error}</p>}

          <div className='d-grid gap-2 pt-4'>
            <button
              className='btn btn-primary btn-lg p-3'
              type='submit'
            >
              Reset
              {/* {loading ? (
                <ClipLoader loading={loading} size={20} color='white' />
              ) : (
                t('reset_password')
              )} */}
            </button>
          </div>
          <p className='mt-5'>
            {t('already_have_account')}{' '}
            <a href='/' className='forgot-password'>
              {t('sign_in')}
            </a>
          </p>
        </form>
      </div>

      <ToastContainer />
    </AuthLayout>
  )
}

export default ResetPassword
