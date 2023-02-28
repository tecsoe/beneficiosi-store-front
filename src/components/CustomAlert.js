import clsx from "clsx";
import { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

const CustomAlert = ({ severity, message, show, duration, onClose }) => {

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        onClose();
      }, duration);
    }
  }, [show])

  return (
    <div className={clsx(["fixed z-50 w-1/4 p-4 left-4 bottom-4 rounded justify-between items-center text-white shadow-2xl animate__animated animate__fadeInUp flex"], {
      'bg-main': !severity,
      'bg-red-500': severity == "error",
      'bg-green-500': severity == "success",
      'bg-orange-500': severity == "info",
      "hidden": !show
    })}
    >
      <div className="w-10/12">
        {message}
      </div>
      <div className="w-1/12">
        <button className="text-xl" onClick={onClose}>
          <IoCloseOutline />
        </button>
      </div>
    </div>
  )
}

export default CustomAlert;