import React from "react";

interface Props {
  updateInputValues: (value: string) => void;
  id?: string;
  label: string;
  disabled?: boolean;
  size: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

const TextInput: React.FC<Props> = ({
  id,
  updateInputValues,
  label,
  disabled = false,
  size,
  placeholder = "",
  defaultValue = "",
  required = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInputValues(e.target.value);
  };

  return (
    <div className={`w-full mx-auto my-6 max-w-${size}`}>
      <div className="flex flex-col">
        <label
          id={id}
          htmlFor="inputComponent"
          className="mb-1 text-sm text-gray-200"
        >
          {label}
        </label>
        <input
          disabled={disabled}
          required={required}
          type="text"
          id="inputComponent"
          placeholder={placeholder}
          value={defaultValue}
          onChange={handleInputChange}
          className="w-full px-3 py-2 transition border rounded-md shadow-sm disabled:bg-white disabled:cursor-not-allowed disabled:text-gray-500 placeholder:text-sm bg-gray-900 border-gray-700"
        />
      </div>
    </div>
  );
};

export default TextInput;
