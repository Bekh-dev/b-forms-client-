import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import { FORM_STYLES } from '../../styles/constants';
import { VALIDATION_RULES } from '../../utils/validation';
import { authAPI } from '../../services/api/auth';

import Logo from '../../components/Header/logo.svg';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.forgotPassword(data.email);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={FORM_STYLES.wrapper}>
        <div className={FORM_STYLES.innerWrapper}>
          <Link to="/"><img src={Logo} alt="Logo" /></Link>
          <h2 className="text-2xl my-4">Check your email</h2>
          <p className="text-gray-600 mb-4">
            We have sent a password reset link to your email address.
            Please check your inbox and follow the instructions.
          </p>
          <Link to="/login" className="text-blue-500 hover:underline">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={FORM_STYLES.wrapper}>
      <div className={FORM_STYLES.innerWrapper}>
        <Link to="/"><img src={Logo} alt="Logo" /></Link>
        <h2 className="text-2xl my-4">Reset your password</h2>
        <p className="text-gray-600 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {error && (
          <div className="mb-4 p-2 bg-red-500 text-white rounded">
            {error}
          </div>
        )}

        <div className={FORM_STYLES.container}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Email address"
              error={errors.email?.message}
              register={register('email', VALIDATION_RULES.email)}
              id="email"
              type="email"
              autoComplete="email"
            />

            <button
              type="submit"
              disabled={loading}
              className={`${FORM_STYLES.button} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sending...' : 'Send reset link'}
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

export default ForgotPassword;
