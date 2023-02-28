import clsx from "clsx";
import { useState } from "react";
import { IoCaretDownOutline } from "react-icons/io5";

const CheapHelp = ({ className, dialogClassName, icon, dialogColor, color, message, ...rest }) => {

    const [showHelp, setShowHelp] = useState(false);

    return (
        <span onClick={() => { setShowHelp((oldShowHelp) => !oldShowHelp) }} className={clsx([`text-xl cursor-pointer absolute right-0 top-0 rounded-full ${className}`], {
            "bg-main hover:text-main hover:bg-white text-white": color === "main" | !color,
            "bg-white text-main hover:text-white hover:bg-main": color === "light",
            "bg-yellow-500 text-white hover:text-white hover:bg-yellow-700": color === "warning",
            "bg-black text-white hover:text-white hover:bg-gray-700": color === "dark",
            "bg-green-500 text-white hover:text-white hover:bg-green-700": color === "success",
        })}>
            {
                showHelp &&
                <div style={{ left: -7, top: message?.length > 40 ? -87 : -65, minWidth: 300 }} className={clsx([`text-sm p-4 absolute shadow-xl animate__animated animate__fadeIn ${dialogClassName}`], {
                    "bg-main text-white": dialogColor === "main" | !dialogColor,
                    "bg-white text-main": dialogColor === "light",
                    "bg-yellow-500 text-white": dialogColor === "warning",
                    "bg-black text-white": dialogColor === "dark",
                    "bg-green-500 text-white": dialogColor === "success",
                })}>
                    {message}
                    <IoCaretDownOutline className={clsx([`text-4xl absolute ${dialogClassName}`], {
                        "text-main": dialogColor === "main" | !dialogColor,
                        "text-white": dialogColor === "light",
                        "text-yellow-500 ": dialogColor === "warning",
                        "text-black": dialogColor === "dark",
                        "text-green-500": dialogColor === "success",
                    })} style={{ left: 0, bottom: -20 }} />
                </div>
            }
            {icon}

        </span>
    )

}

export default CheapHelp;
