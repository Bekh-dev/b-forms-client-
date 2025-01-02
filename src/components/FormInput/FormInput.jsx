import ErrorMessage from '../ErrorMessage/ErrorMessage';

const FormInput = ({ label, error, register, className = '', ...props }) => {
  return (
    <div className={className}>
      <label htmlFor={props.id} className='block text-sm mb-1'>
        {label}
      </label>
      <div className='mt-2'>
        <input
          className='w-full px-3 py-2 bg-gray-900 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          {...register}
          {...props}
        />
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};

export default FormInput;
