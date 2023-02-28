import clsx from "clsx";
import { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import reactDom from "react-dom";
import { useState } from "react";
import CustomInput from "./CustomInput";
import Button from "./Button";

const DeliveryNoteModal = ({ open, onClose, deliveryMethod }) => {

    const modalRef = useRef();

    const [deliveryNote, setDeliveryNote] = useState({
        url: "",
        trackingNumber: "",
    });

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const handleClose = () => {
        onClose();
    };

    const handleChange = (e) => {
        setDeliveryNote((oldDeliveryNote) => {
            return {
                ...oldDeliveryNote,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onClose({ code: deliveryMethod.code, ...deliveryNote })
    }

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
                    Por favor ingresa los siguiente dastos antes de actualizar
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="tracking">Numero de tracking</label>
                            <CustomInput
                                placeholder="Numero de traking"
                                id="tracking"
                                name="trackingNumber"
                                onChange={handleChange}
                                value={deliveryNote.trackingNumber} />
                        </div>
                        <div>
                            <label htmlFor="url">Url de seguimiento</label>
                            <CustomInput
                                placeholder="Url de segumiento"
                                id="url"
                                name="url"
                                onChange={handleChange}
                                value={deliveryNote.url} />
                        </div>
                    </div>
                    <div className="text-center space-x-4 mt-4">
                        <Button type="button" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Aceptar
                        </Button>
                    </div>
                </form>
            </div>
        </div >,
        document.getElementById("portal")
    )
}

export default DeliveryNoteModal;