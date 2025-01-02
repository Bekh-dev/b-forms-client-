import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../../components/FormInput/FormInput';
import { FORM_STYLES } from '../../styles/constants';
import { VALIDATION_RULES } from '../../utils/validation';
import { login, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';
import logo from '../../assets/logo.svg';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className={FORM_STYLES.wrapper}>
      <div className={FORM_STYLES.innerWrapper}>
        <div className="text-center mb-8">
          <img src={logo} alt="B-Forms Logo" className="mx-auto h-12 w-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Sign in to B-Forms</h2>
        </div>
        
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

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm mb-1">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <FormInput
                error={errors.password?.message}
                register={register('password', VALIDATION_RULES.password)}
                id="password"
                type="password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${FORM_STYLES.button} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className={FORM_STYLES.bottomLink}>
          <p>
            New to Forms?{' '}
            <Link to="/register" className="text-sm text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
