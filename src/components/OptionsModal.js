import clsx from "clsx";
import { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import reactDom from "react-dom";

const OptionsModal = ({ open, onClose, title, values }) => {

    const modalRef = useRef();

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return reactDom.createPortal(
        <div ref={modalRef} onClick={handleCloseModal} className={clsx(["fixed flex top-0 left-0 w-screen z-50 h-screen bg-black bg-opacity-50"], {
            "hidden": !open
        })}>
            <div className="m-auto bg-white rounded space-y-2 p-8 relative">
                <IoCloseCircleOutline
                    onClick={handleClose}
                    className="
                        absolute 
                        -top-4 
                        -right-4
                        text-main
                        text-4xl
                        cursor-pointer
                        rounded-full
                        transition
                        duration-300 hover:text-white hover:bg-main" />
                <h1 className="text-center text-xl font-bold text-gray-500">
                    {title}
                </h1>
                {values?.map((value, i) => (
                    <div
                        className="capitalize flex space-x-4 transition duration-300 p-2 cursor-pointer hover:shadow-xl"
                        onClick={() => handleListItemClick(value)}
                        key={i}
                    >
                        {
                            value?.color &&
                            <div className="rounded-full" style={{ backgroundColor: value?.color, height: 30, width: 30 }} />
                        }
                        <p>{value?.name}</p>
                    </div>
                ))}
            </div>
        </div >,
        document.getElementById("portal")
    )
}

export default OptionsModal;