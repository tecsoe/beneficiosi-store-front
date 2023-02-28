import clsx from "clsx";
import { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";


const CustomModal = ({ open, onClose, message }) => {

    const modalRef = useRef();

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const handleCancel = () => {
        onClose(false);
    }

    const handleAccept = () => {
        onClose(true)
    }

    return (
        <div ref={modalRef} onClick={handleCloseModal} className={clsx(["fixed flex top-0 left-0 w-screen z-50 h-screen bg-black bg-opacity-50"], {
            "hidden": !open
        })}>
            <div className="m-auto bg-white w-1/2 h-1/2 rounded px-24 relative">
                <IoCloseCircleOutline
                    onClick={handleCancel}
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
                <div className="flex w-full h-full">
                    <div className="m-auto w-10/12">
                        <h1 className="text-center mb-24 text-xl font-bold text-gray-500">
                            {message}
                        </h1>
                        <div className="flex px-12 w-full justify-between mt-4">
                            <button onClick={handleCancel} className="bg-main text-white py-2 px-4 rounded transition duration-500 hover:bg-white hover:shadow-xl hover:text-main">
                                Cancelar
                            </button>
                            <button onClick={handleAccept} className="bg-main text-white py-2 px-4 rounded transition duration-500 hover:bg-white hover:shadow-xl hover:text-main">
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CustomModal;