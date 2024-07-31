import React from "react";

function SelectOption({ value, children, ...props }) {
  return (
    <option key={value} value={value} {...props}>
      {children}
    </option>
  );
}

function SelectInput({ label, children, ...props }) {
  return (
    <div>
      <label
        htmlFor="location"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <select
      {...props}
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        {children}
      </select>
    </div>
  );
}

export { SelectOption, SelectInput };
