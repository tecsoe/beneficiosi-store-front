import clsx from "clsx"
import { Link } from "react-router-dom";

const Button = ({ children, className, color, to, target, ...rest }) => {
    return (
        <button {...rest} className={clsx([`focus:border-none items-center focus:ring-none focus:outline-none px-5 py-2 rounded transition duration-500 hover:shadow-xl ${className}`], {
            "bg-main hover:text-main hover:bg-white text-white": color === "main" | !color,
            "bg-white text-main hover:text-white hover:bg-main": color === "light",
            "bg-yellow-500 text-white hover:text-white hover:bg-yellow-700": color === "warning",
            "bg-black text-white hover:text-white hover:bg-gray-700": color === "dark",
            "bg-green-500 text-white hover:text-white hover:bg-green-700": color === "success",
        })}>
            {to ?
                <Link to={to} target={target} className="decoration-none flex">
                    {children}
                </Link>
                :
                <div className="flex">
                    {children}
                </div>
            }
        </button >
    )
}

export default Button;