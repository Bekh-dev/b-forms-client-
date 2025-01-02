import { useForm } from 'react-hook-form';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import { FORM_STYLES } from '../../styles/constants';
import { VALIDATION_RULES } from '../../utils/validation';
import { authAPI } from '../../services/api/auth';

import Logo from '../../components/Header/logo.svg';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.resetPassword(token, data.password);
      // Успешно сбросили пароль, перенаправляем на страницу входа
      navigate('/login', { 
        replace: true,
        state: { message: 'Your password has been successfully reset. Please sign in with your new password.' }
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={FORM_STYLES.wrapper}>
      <div className={FORM_STYLES.innerWrapper}>
        <Link to="/"><img src={Logo} alt="Logo" /></Link>
        <h2 className="text-2xl my-4">Reset your password</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-500 text-white rounded">
            {error}
          </div>
        )}

        <div className={FORM_STYLES.container}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="New Password"
              error={errors.password?.message}
              register={register('password', VALIDATION_RULES.password)}
              id="password"
              type="password"
              autoComplete="new-password"
            />
            
            <FormInput
              label="Confirm New Password"
              error={errors.confirmPassword?.message}
              register={register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => 
                  value === watch('password') || 'Passwords do not match'
              })}
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={loading}
              className={`${FORM_STYLES.button} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>

        <div className={FORM_STYLES.bottomLink}>
          <p>
            Remember your password?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
