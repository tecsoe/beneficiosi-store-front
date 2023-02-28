import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";
import { IoPencil, IoTrashSharp } from "react-icons/io5";
import CustomModal from "./CustomModal";
import { useAuth } from "../contexts/AuthContext";
import EditShippingRangesModal from "./EditShippingRangesModal";

const ShippingRanges = ({ ranges, deliveryMethodId, onUpdate }) => {

    const { setCustomAlert, setLoading } = useAuth();

    const [selectedRange, setSelectedRange] = useState(null);

    const [open, setOpen] = useState(false);
    const [rangeToDelete, setRangeToDelete] = useState(null);

    const [{ data: deleteData, error: deleteError, loading: deleteLoading }, deleteRange] = useAxios({ url: `/delivery-methods/shipping-ranges/${rangeToDelete?.id}`, method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        if (deleteData) {
            setRangeToDelete(null);
            setCustomAlert?.({ show: true, message: "El rango fue eliminado exitosamente.", severity: 'success' });
            onUpdate?.(deleteData);
        }
    }, [deleteData])

    useEffect(() => {
        if (deleteError) {
            setRangeToDelete(null);
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
        }
    }, [deleteError]);

    useEffect(() => {
        setLoading?.({ show: deleteLoading, message: "Eliminando rango." });
    }, [deleteLoading])

    const handleCloseRangeModal = (e) => {
        setSelectedRange(null);
        if (e) {
            onUpdate(e);
        }
    }

    const handleDelete = (range) => {
        setRangeToDelete(range);
        setOpen(true);
    }

    const handleConfirmDelete = async (e) => {
        setOpen(false);

        if (e) {
            deleteRange();
        }
    }

    return (
        <div>
            <h1 className="text-gray-500 text-2xl">
                Rangos
            </h1>
            <p className="text-sm">Estos son los rangos de envio de esta empresa de envios.</p>
            <div className="space-y-4">
                {
                    ranges?.map((ranges, i) => {
                        return (
                            <div key={i} className="flex justify-between items-center bg-white shadow-xl p-4 rounded">
                                <div className="text-center">
                                    <p>Desde (Kg)</p>
                                    <p>{ranges?.shippingRange?.weightFrom}</p>
                                </div>
                                <div className="text-center">
                                    <p>Hasta (Kg)</p>
                                    <p>{ranges?.shippingRange?.weightTo}</p>
                                </div>
                                <div className="text-center">
                                    <p>Desde (M3)</p>
                                    <p>{ranges?.shippingRange?.volumeFrom}</p>
                                </div>
                                <div className="text-center">
                                    <p>Hasta (M3)</p>
                                    <p>{ranges?.shippingRange?.volumeTo}</p>
                                </div>
                                <div className="space-x-4">
                                    <button onClick={() => { setSelectedRange({ ...ranges.shippingRange, deliveryMethodId: deliveryMethodId }) }} title="Editar" className="bg-yellow-500 rounded p-2 text-white">
                                        <IoPencil />
                                    </button>
                                    <button onClick={() => { handleDelete(ranges?.shippingRange) }} title="Eliminar" className="bg-red-500 rounded p-2 text-white">
                                        <IoTrashSharp />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <CustomModal message={`¿Esta seguro?`} open={open} onClose={handleConfirmDelete} />
            <EditShippingRangesModal range={selectedRange} onClose={handleCloseRangeModal} />
        </div>
    )
}

export default ShippingRanges;