import React from "react";
import { useField, useFormikContext } from "formik";

function CheckboxGroup({ name, label, children }) {
  const { values, setFieldValue } = useFormikContext();
  const [field] = useField(name);
  const selectedValues = values[name] ?? [];

  const handleCheckboxChange = (value) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    setFieldValue(name, updatedValues);
  };

  return (
    <div>
      <label className="text-base font-semibold text-gray-900">{label}</label>
      <div className="mt-1">
        {React.Children.map(children, (child) => (
          <>
            {React.cloneElement(child, {
              name,
              checked: selectedValues.includes(child.props.value),
              onChange: () => handleCheckboxChange(child.props.value),
            })}
          </>
        ))}
      </div>
    </div>
  );
}

function CheckboxOption({ children, ...props }) {
  // Remove any non-DOM props if needed
  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
      />
      <label className="ml-2 text-sm font-medium text-gray-900">
        {children}
      </label>
    </div>
  );
}

export { CheckboxGroup, CheckboxOption };
