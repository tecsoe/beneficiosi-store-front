const Checkbox = ({ id, label, checked, onChange, value, ...rest }) => {
  const finalId = id ?? Math.random().toString(36).substring(7);

  return <label
    htmlFor={finalId}
    className="inline-flex items-center space-x-2 cursor-pointer"
  >
    <input
      {...rest}
      id={finalId}
      value={value}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="rounded-full bg-gray-100 text-main border-none focus:border-none focus:ring-white cursor-pointer"
    />
    {label && <span>{label}</span>}
  </label>;
};

export default Checkbox;