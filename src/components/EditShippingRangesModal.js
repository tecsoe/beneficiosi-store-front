import { useEffect, useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import reactDom from "react-dom";
import CustomInput from "./CustomInput";
import Button from "./Button";
import useAxios from "../hooks/useAxios";
import { useAuth } from "../contexts/AuthContext";

const EditShippingRangesModal = ({ onClose, range }) => {

    const modalRef = useRef();

    const { setCustomAlert, setLoading } = useAuth();

    const [rangeFormData, setRangeFormData] = useState({
        id: '',
        position: '',
        volumeFrom: "",
        volumeTo: "",
        weightFrom: '',
        weightTo: ''
    });

    const [{ data: updateData, error: updateError, loading: updateLoading }, updateRange] = useAxios({ url: `/delivery-methods/shipping-ranges/${rangeFormData?.id}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading?.({ show: updateLoading, message: "Actualizando rango." });
    }, [updateLoading])

    useEffect(() => {
        if (updateData) {
            setCustomAlert?.({ show: true, message: "El rango fue actualizado exitosamente.", severity: 'success' });
            onClose?.(updateData);
        }
    }, [updateData])

    useEffect(() => {
        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }
    }, [updateError]);

    useEffect(() => {
        if (range) {
            setRangeFormData(range);
        }
    }, [range]);

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose?.();
        }
    }

    const handleClose = () => {
        onClose?.();
    };

    const handleChange = (e) => {
        setRangeFormData((oldRangeFormData) => {
            return {
                ...oldRangeFormData,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { id, ...data } = rangeFormData;
        updateRange({ data });
    }

    if (!range) {
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
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center w-full space-x-4 p-4 rounded">
                        <div className="text-center">
                            <p>Desde (Kg)</p>
                            <CustomInput
                                type="number"
                                name="weightFrom"
                                onChange={handleChange}
                                value={rangeFormData.weightFrom} />
                        </div>
                        <div className="text-center">
                            <p>Hasta (Kg)</p>
                            <CustomInput
                                type="number"
                                name="weightTo"
                                onChange={handleChange}
                                value={rangeFormData.weightTo} />
                        </div>
                        <div className="text-center">
                            <p>Desde (M3)</p>
                            <CustomInput
                                type="number"
                                name="volumeFrom"
                                onChange={handleChange}
                                value={rangeFormData.volumeFrom} />
                        </div>
                        <div className="text-center">
                            <p>Hasta (M3)</p>
                            <CustomInput
                                type="number"
                                name="volumeTo"
                                onChange={handleChange}
                                value={rangeFormData.volumeTo} />
                        </div>
                    </div>
                    <div className="text-center my-4 text-gray-500">
                        Recuerde insertar valores que no intervengan con los demas rangos.
                    </div>
                    <div className="text-center space-x-4">
                        <Button onClick={handleClose}>
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
export default EditShippingRangesModal;