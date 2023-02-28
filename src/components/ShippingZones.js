import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";
import { IoPencil, IoTrashSharp } from "react-icons/io5";
import EditDeliveryZonesModal from "./EditDeliveryZonesModal";
import { useAuth } from "../contexts/AuthContext";
import CustomModal from "./CustomModal";

const ShippingZones = ({ zones, onUpdate, deliveryMethodCode }) => {

    const { setCustomAlert, setLoading } = useAuth();

    const [selectedZone, setSelectedZone] = useState(null);

    const [zoneToDelete, setZoneToDelete] = useState(null);

    const [open, setOpen] = useState(false);

    const [{ data: deleteData, error: deleteError, loading: deleteLoading }, deleteZone] = useAxios({ url: `/delivery-methods/delivery-zones/${zoneToDelete?.id}`, method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        if (deleteData) {
            setZoneToDelete(null);
            setCustomAlert?.({ show: true, message: "El rango fue eliminado exitosamente.", severity: 'success' });
            onUpdate?.(deleteData);
        }
    }, [deleteData])

    useEffect(() => {
        if (deleteError) {
            setZoneToDelete(null);
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
        }
    }, [deleteError]);

    useEffect(() => {
        setLoading?.({ show: deleteLoading, message: "Eliminando Zona." });
    }, [deleteLoading])

    const handleClose = (e) => {

        setSelectedZone(null);

        if (e) {
            onUpdate(e);
        }
    }

    const handleDelete = (zone) => {
        setZoneToDelete(zone);
        setOpen(true);
    }

    const handleConfirmDelete = async (e) => {
        setOpen(false);

        if (e) {
            deleteZone();
        }
    }

    return (
        <div>
            <h1 className="text-gray-500 text-2xl">
                Zonas de envios
            </h1>
            <div className="space-y-4">
                {
                    zones?.map((deliveryZone, i) => {
                        return (
                            <div key={i} className="bg-white shadow-xl p-4 rounded flex items-center justify-between">
                                <h2 className="text-main">{deliveryZone?.name}</h2>
                                <div className="space-x-4">
                                    <button onClick={() => { setSelectedZone(deliveryZone) }} title="Editar" className="bg-yellow-500 rounded p-2 text-white">
                                        <IoPencil />
                                    </button>
                                    <button onClick={() => { handleDelete(deliveryZone) }} title="Eliminar" className="bg-red-500 rounded p-2 text-white">
                                        <IoTrashSharp />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <CustomModal message={`¿Esta seguro?`} open={open} onClose={handleConfirmDelete} />
            <EditDeliveryZonesModal deliveryMethodCode={deliveryMethodCode} zone={selectedZone} onClose={handleClose} />
        </div>
    )
}

export default ShippingZones;