import { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import reactDom from "react-dom";
import { useAuth } from "../contexts/AuthContext";
import AddShippingRangeForm from "./AddShippingRangeForm";
import AddDeliveryRangeForm from "./AddDeliveryRangeForm";


const AddRangeModal = ({ onClose, deliveryMethodCode, show, deliveryMethodId }) => {

    const modalRef = useRef();

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose?.();
        }
    }

    const handleClose = () => {
        onClose?.();
    };

    const handleCreate = (e) => {
        if (e) {
            return onClose?.(e);
        }

        onClose?.();
    }

    if (!show) {
        return null;
    }

    return reactDom.createPortal(
        <div ref={modalRef} onClick={handleCloseModal} className="fixed flex top-0 left-0 w-screen z-50 h-screen bg-black bg-opacity-50">
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
                <h1 className="text-center text-gray-500 text-xl">
                    Por favor ingrese los datos del rango
                </h1>
                {
                    deliveryMethodCode === 'dmt-001' ?
                        <AddShippingRangeForm deliveryMethodId={deliveryMethodId} onCreate={handleCreate} />
                        :
                        <AddDeliveryRangeForm deliveryMethodId={deliveryMethodId} onCreate={handleCreate} />
                }
            </div>
        </div >,
        document.getElementById("portal")
    )
}

export default AddRangeModal;