import { useCallback, useEffect, useRef, useState } from "react";
import { IoCheckbox, IoCloseCircleOutline } from "react-icons/io5";
import reactDom from "react-dom";
import { useAuth } from "../contexts/AuthContext";
import useLocations from "../hooks/useLocations";
import CustomInput from "./CustomInput";
import useAxios from "../hooks/useAxios";
import Button from "./Button";


const AddZonePlaceModal = ({ onClose, show, zone }) => {

    const modalRef = useRef();

    const [zoneData, setZoneData] = useState({
        name: '',
        capacity: 0
    });

    useEffect(() => {
        if (zone) {
            setZoneData(zone);
        } else {
            setZoneData({
                name: '',
                capacity: 0
            });
        }
    }, [zone])

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose?.();
        }
    }

    const handleChange = (e) => {
        setZoneData((oldZoneData) => {
            return {
                ...oldZoneData,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onClose?.(zoneData);
    }


    const handleClose = () => {
        onClose?.();
    };

    if (!show) {
        return null;
    }

    return reactDom.createPortal(
        <div ref={modalRef} onClick={handleCloseModal} className="fixed flex top-0 left-0 w-screen z-50 h-screen bg-black bg-opacity-50">
            <div className="m-auto bg-white rounded space-y-4 p-8 relative">
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
                    Crear Zona
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Nombre de la zona</label>
                        <CustomInput
                            name="name"
                            onChange={handleChange}
                            value={zoneData.name}
                            placeholder="Nombre" />
                    </div>
                    <div>
                        <label>Cantidad de butacas</label>
                        <CustomInput
                            name="capacity"
                            onChange={handleChange}
                            value={zoneData.capacity}
                            type="number"
                            placeholder="Cantidad de butacas" />
                    </div>

                    <div className="mt-4 text-center space-x-4">
                        <Button type="button" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button onClick={() => { onClose?.(zoneData) }}>
                            Aceptar
                        </Button>
                    </div>
                </form>
            </div>
        </div >,
        document.getElementById("portal")
    )
}

export default AddZonePlaceModal;