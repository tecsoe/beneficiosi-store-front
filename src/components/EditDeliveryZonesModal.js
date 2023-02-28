import { useEffect, useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import reactDom from "react-dom";
import ShippingRangesRow from "./ShippingRangesRow";
import CustomInput from "./CustomInput";
import Button from "./Button";
import useAxios from "../hooks/useAxios";
import { useAuth } from "../contexts/AuthContext";
import DeliveryRangesRow from "./DeliveryRangesRow";

const EditDeliveryZonesModal = ({ onClose, zone, deliveryMethodCode }) => {

    const modalRef = useRef();

    const { setCustomAlert, setLoading } = useAuth();

    const [extraPrice, setExtraPrice] = useState(0);

    const [{ data: updateData, error: updateError, loading: updateLoading }, updateZone] = useAxios({ url: `/delivery-methods/delivery-zones/${zone?.id}`, method: "PUT" }, { manual: true, useCache: false });

    useEffect(() => {
        if (zone) {
            setExtraPrice(zone?.extraPrice);
        }
    }, [zone]);

    useEffect(() => {
        setLoading?.({ show: updateLoading, message: "Actualizando precio." });
    }, [updateLoading])

    useEffect(() => {
        if (updateData) {
            setCustomAlert?.({ show: true, message: "El precio fue actualizado exitosamente.", severity: 'success' });
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
        if (zone) {
            setExtraPrice(Number(zone?.extraPrice))
        }
    }, [zone])

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose?.();
        }
    }

    const handleClose = () => {
        onClose?.();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!extraPrice) {
            alert('El costo no puede estar vacio');
            return;
        }
        updateZone({
            data: {
                extraPrice
            }
        })

    }

    if (!zone) {
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

                <div>
                    <h1>
                        {zone?.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Cambie el precio y luego pulse el boton de actualizar para realizar los cambios.
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between">
                        <div className="w-2/3">
                            Precio por excedente
                            <CustomInput value={extraPrice} type="number" onChange={(e) => { setExtraPrice(e.target.value) }} />
                        </div>
                        <div className="w-1/3 text-right">
                            <Button type="submit">
                                Cambiar Precio
                            </Button>
                        </div>
                    </div>
                </form>

                <h1 className="text-center text-gray-500 text-2xl">Rangos</h1>
                <div className="space-y-4">
                    {
                        zone?.deliveryZoneToShippingRanges?.map((ranges, i) => {
                            return (
                                <ShippingRangesRow onUpdate={(data) => { onClose(data) }} range={ranges} key={i} />
                            )
                        })
                    }

                    {
                        zone?.deliveryZoneToDeliveryRanges?.map((ranges, i) => {
                            return (
                                <DeliveryRangesRow onUpdate={(data) => { onClose(data) }} range={ranges} key={i} />
                            )
                        })
                    }
                </div>
            </div>
        </div >,
        document.getElementById("portal")
    )
}

export default EditDeliveryZonesModal;