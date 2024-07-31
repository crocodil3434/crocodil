import React from 'react';
import { useField } from 'formik';

function RadioGroup({ label, name, children }) {
  // Use Formik's useField hook to handle form state and events
  const [field, , helpers] = useField(name);

  return (
    <div>
      <label className="text-base font-semibold text-gray-900">{label}</label>
      {React.Children.map(children, child => {
        return React.cloneElement(child, {
          name: name,
          checked: child.props.value === field.value,
          onChange: () => helpers.setValue(child.props.value),
        });
      })}
    </div>
  );
}

function RadioOption({ children, value, ...props }) {
  // Restrict props to ensure no invalid HTML attributes are passed to the input element
  const validProps = { ...props, value };
  return (
    <div className="flex items-center">
      <label className="gap-1 text-sm font-medium leading-6 text-gray-900 flex items-center">
      <input
        type="radio"
        {...validProps}
        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
      />
        {children}
      </label>
    </div>
  );
}

export { RadioGroup, RadioOption };
