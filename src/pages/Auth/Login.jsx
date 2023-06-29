import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import NotificationManager from '../../components/NotificationManager';
import { useAuth } from '../../modules/auth';
import AuthLayout from '../../components/AuthLayout';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [t] = useTranslation('common');
  const { login, isLoading } = useAuth();
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const errorMessage = {
    email: {
      required: t('required_email'),
      invalid: t('error_invalid_email'),
    },
    password: {
      required: t('required_password'),
    },
  };
  const [formDataError, setFormDataError] = useState({
    email: '',
    password: '',
  });

  const error = useSelector((state) => state.auth.error);

  const validateInput = (value, stateName) => {
    if (!value) {
      setFormDataError((formDataError) => ({
        ...formDataError,
        [stateName]: errorMessage[stateName].required,
      }));
      return false;
    } else {
      if (stateName === 'email') {
        const emailValid = validateEmail(value);
        if (!emailValid) {
          setFormDataError((formDataError) => ({
            ...formDataError,
            [stateName]: errorMessage[stateName].invalid,
          }));
          return false;
        } else {
          setFormDataError((formDataError) => ({
            ...formDataError,
            [stateName]: '',
          }));
          return true;
        }
      } else {
        setFormDataError((formDataError) => ({
          ...formDataError,
          [stateName]: '',
        }));
        return true;
      }
    }
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const onChange = (value, stateName) => {
    validateInput(value, stateName);
    setFormData({ ...formData, [stateName]: value });
  };

  const handleLogin = async () => {
    const validationResult = Object.keys(formData).map((key) => {
      return validateInput(formData[key], key);
    });

    const isInvalid = validationResult.filter((r) => !r).length > 0;

    if (isInvalid) {
      return;
    }

    const { errors } = await login(formData.email, formData.password);

    if (errors) {
      NotificationManager.error(t('login_failed'), t);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-login">
        <div className="text-center">
          <h1 className="title text-center">{t('login')}</h1>
        </div>
        <form className="form-section">
          <div className="mb-4">
            <div className="form-item-inner">
              <label htmlFor="email" className="form-label"></label>
              <div className="label">{t('email')}</div>
              <input
                className="form-control"
                type="email"
                id="email"
                name="email"
                placeholder="name@email.com"
                value={formData.email}
                autoComplete="username"
                onChange={(e) => onChange(e.target.value, 'email')}
              />
            </div>
            {formDataError.email && (
              <p className="error-msg">{formDataError.email}</p>
            )}
          </div>
          <div className="mb-4">
            <div className="form-item-inner">
              <label htmlFor="password" className="form-label"></label>
              <div className="label">{t('password')}</div>
              <input
                className="form-control"
                type={isShowPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="at least 8 characters"
                value={formData.password}
                autoComplete="current-password"
                onChange={(e) => onChange(e.target.value, 'password')}
              />
              <div className="flex mt-3 gap-2">
                <input
                  type="checkbox"
                  onChange={(e) => setIsShowPassword(e.target.checked)}
                  id="show-password"
                />
                <label style={{ userSelect: 'none' }} htmlFor="show-password">
                  Show Password
                </label>
              </div>
            </div>
            {formDataError.password && (
              <p className="error-msg">{formDataError.password}</p>
            )}
          </div>
          <div className="mb-4 forget">
            <Link to="/forgot-password" className="forgot-password">
              {t('forgot_password')}
            </Link>
          </div>

          {error && <p className="system-error-msg">{error}</p>}
          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-primary btn-lg p-3"
              onClick={handleLogin}
            >
              {isLoading ? (
                <ClipLoader loading={isLoading} size={20} color="white" />
              ) : (
                t('sign_in')
              )}
            </button>
          </div>
          {/* <div className='registered'>
            <p className='mt-5'>
              <a href='/signup' className='forgot-password'>
                {t('not_registered')}
              </a>
            </p>
          </div> */}
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
