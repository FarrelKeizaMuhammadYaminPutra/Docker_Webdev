import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="tw-mt-2 tw-space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="tw-flex tw-items-center tw-text-xs">
          {item.met ? (
            <Check className="tw-size-4 tw-text-green-500 tw-mr-2" />
          ) : (
            <X className="tw-size-4 tw-text-gray-500 tw-mr-2" />
          )}
          <span className={item.met ? "tw-text-green-500" : "tw-text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };
  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return "tw-bg-red-500";
    if (strength === 1) return "tw-bg-red-400";
    if (strength === 2) return "tw-bg-yellow-500";
    if (strength === 3) return "tw-bg-yellow-400";
    return "tw-bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="tw-mt-2">
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-1">
        <span className="tw-text-xs tw-text-gray-400">Password strength</span>
        <span className="tw-text-xs tw-text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>

      <div className="tw-flex tw-space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`tw-h-1 tw-w-1/4 tw-rounded-full tw-transition-colors tw-duration-300 
              ${index < strength ? getColor(strength) : "tw-bg-gray-600"}
            `}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};
export default PasswordStrengthMeter;
