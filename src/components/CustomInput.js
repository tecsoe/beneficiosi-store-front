const CustomInput = ({ name, onChange, value, type, placeholder, className, ...rest }) => {
    return (
        <input
            {...rest}
            name={name}
            onChange={onChange}
            value={value}
            type={type}
            placeholder={placeholder}
            className={`p-2 focus:border-none focus:ring-white focus:outline-none w-full rounded-xl bg-gray-100 border-none transition duration-500 focus:shadow-xl focus:bg-white ${className}`} />
    )
}


export default CustomInput;