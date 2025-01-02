import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../../components/FormInput/FormInput';
import { FORM_STYLES } from '../../styles/constants';
import { VALIDATION_RULES } from '../../utils/validation';
import { register as registerUser, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';
import logo from '../../assets/logo.svg';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={FORM_STYLES.wrapper}>
      <div className={FORM_STYLES.innerWrapper}>
        <div className="text-center mb-8">
          <img src={logo} alt="B-Forms Logo" className="mx-auto h-12 w-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Create your account</h2>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-500 text-white rounded">
            {error}
          </div>
        )}

        <div className={FORM_STYLES.container}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Full Name"
              error={errors.name?.message}
              register={register('name', VALIDATION_RULES.name)}
              id="name"
              type="text"
              autoComplete="name"
            />

            <FormInput
              label="Email address"
              error={errors.email?.message}
              register={register('email', VALIDATION_RULES.email)}
              id="email"
              type="email"
              autoComplete="email"
            />

            <FormInput
              label="Password"
              error={errors.password?.message}
              register={register('password', VALIDATION_RULES.password)}
              id="password"
              type="password"
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={loading}
              className={`${FORM_STYLES.button} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <div className={FORM_STYLES.bottomLink}>
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
