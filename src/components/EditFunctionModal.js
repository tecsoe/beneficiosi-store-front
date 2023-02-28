import { useEffect, useRef, useState } from "react";
import { IoCloseCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import reactDom from "react-dom";
import FunctionZone from "./FunctionZone";
import Button from "./Button";
import useAxios from "../hooks/useAxios";
import { useAuth } from "../contexts/AuthContext";



const EditFunctionModal = ({ onClose, functionShow, show, showId }) => {

    const { setCustomAlert } = useAuth();

    const modalRef = useRef();

    const [functionShowData, setFunctionShowData] = useState(null);

    const [showAlert, setShowAlert] = useState({ show: false, message: '' });

    const [{ data: updateData, error: updateError, loading: updateLoading }, updateShow] = useAxios({ url: `/shows/${showId}/shows/${functionShow?.id}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (updateError) {
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }
    }, [updateError]);

    useEffect(() => {
        if (updateData) {
            setShowAlert?.({ show: true, message: 'Se ha actualizado exitosamente.' });
            setTimeout(() => {
                setShowAlert?.({ show: false, message: '' });
            }, [3000])
        }
    }, [updateData])

    useEffect(() => {
        setFunctionShowData(functionShow);
    }, [functionShow])

    useEffect(() => {
        console.log(functionShowData);
    }, [functionShowData])

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose?.();
        }
    }

    const handleClose = () => {
        onClose?.();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(functionShowData);
        await updateShow({
            data: {
                date: functionShowData?.date,
                showToZones: functionShowData?.showToZones?.map((zone) => { return { id: zone?.id, price: zone?.price, availableSeats: zone?.availableSeats } })
            }
        });
    }

    const handleChange = (e) => {
        if (e.target.parentName) {
            setFunctionShowData((oldFunctionShowData) => {
                const updatedArray = [...oldFunctionShowData[e.target.parentName]];
                const updatedRange = updatedArray[e.target.index];
                updatedArray.splice(e.target.index, 1, { ...updatedRange, [e.target.name]: e.target.value });
                return {
                    ...oldFunctionShowData,
                    [e.target.parentName]: updatedArray
                }
            });
            return;
        }
    }

    if (!show) {
        return null;
    }

    return reactDom.createPortal(
        <div ref={modalRef} onClick={handleCloseModal} className="fixed flex top-0 left-0 w-screen z-50 h-screen bg-black bg-opacity-50" style={{ padding: "0 100px" }}>
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
                    <div>
                        {
                            showAlert?.show &&
                            <div className="text-center mb-4 animate__animated animate__fadeInUp">
                                <IoCheckmarkCircleOutline className="text-green-500 m-auto text-xl" />
                                <p>{showAlert?.message}</p>
                            </div>
                        }
                        <h2 className="text-center text-gray-500 text-2xl">
                            Zonas
                        </h2>
                        <p className="text-center mb-4">Por favor agregue la disponibilidad de asientos por zona y el costo de cada una.</p>
                        <div className="flex justify-center space-x-4 flex-wrap items-center">
                            {
                                functionShowData?.showToZones?.map((zone, i) => {
                                    return (
                                        <FunctionZone name="showToZones" index={i} onChange={handleChange} zone={zone} key={i} />
                                    )
                                })
                            }
                        </div>
                        <div className="text-right mt-8 flex items-center space-x-8 justify-end">
                            <Button onClick={() => { onClose() }} type="button">
                                Cancelar
                            </Button>
                            {
                                updateLoading ?
                                    <div className="text-center text-gray-500 text-xl">
                                        Cargando...
                                    </div>
                                    :
                                    <Button>
                                        Aceptar
                                    </Button>
                            }
                        </div>
                    </div>
                </form>
            </div >
        </div >,
        document.getElementById("portal")
    )
}

export default EditFunctionModal;