import React from "react";

interface Props {
  updateInputValues: (value: string) => void;
  label: string;
  disabled?: boolean;
  size: string;
  placeholder?: string;
  defaultValue?: string;
}

const TextInput: React.FC<Props> = ({
  updateInputValues,
  label,
  disabled = false,
  size,
  placeholder = "",
  defaultValue = "",
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInputValues(e.target.value);
  };

  return (
    <div className={`w-full mx-auto my-6 max-w-${size}`}>
      <div className="flex flex-col">
        <label
          htmlFor="inputComponent"
          className="mb-1 text-sm text-gray-500 dark:text-gray-200"
        >
          {label}
        </label>
        <input
          disabled={disabled}
          required
          type="text"
          id="inputComponent"
          placeholder={placeholder}
          value={defaultValue}
          onChange={handleInputChange}
          className="w-full px-3 py-2 transition border border-gray-300 rounded-md shadow-sm disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-sm dark:bg-gray-900 dark:border-gray-600"
        />
      </div>
    </div>
  );
};

export default TextInput;
