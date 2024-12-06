const Input = ({ icon: Icon, type, placeholder, value, onChange, ...props }) => {
  return (
    <div className="tw-relative tw-mb-6">
      {/* Icon Container */}
      <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 tw-pointer-events-none">
        <Icon className="tw-w-5 tw-h-5 tw-text-white" /> {/* Adjusted to use width/height properties */}
      </div>
      
      {/* Input Field */}
      <input
        type={type}
        placeholder={placeholder}  // Correctly pass placeholder
        value={value}  // Bind the value to the component's state
        onChange={onChange}  // Handle the change event to update the state
        {...props}  // Spread any other props such as "className"
        className="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-bg-black tw-bg-opacity-5 tw-rounded-lg tw-border tw-border-gray-600 focus:tw-border-gray-200 focus:tw-ring-2 focus:tw-ring-gray-300 tw-text-white tw-placeholder-gray-400 tw-transition tw-duration-200"
      />
    </div>
  );
};

export default Input;

