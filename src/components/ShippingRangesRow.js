import CustomInput from "./CustomInput";
import Button from "./Button";
import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import { useAuth } from "../contexts/AuthContext";

const ShippingRangesRow = ({ range, onUpdate }) => {

    const { setLoading, setCustomAlert } = useAuth();

    const [rangePrice, setRangePrice] = useState(0);

    const [{ data: updateData, error: updateError, loading: updateLoading }, updateRange] = useAxios({ url: `/delivery-methods/zone-to-shipping-ranges/${range?.id}`, method: "PUT" }, { manual: true, useCache: false });

    useEffect(() => {
        if (range) {
            setRangePrice(range?.price);
        }
    }, [range]);

    useEffect(() => {
        setLoading?.({ show: updateLoading, message: "Actualizando precio." });
    }, [updateLoading])

    useEffect(() => {
        if (updateData) {
            setCustomAlert?.({ show: true, message: "El precio fue actualizado exitosamente.", severity: 'success' });
            onUpdate?.(updateData);
        }
    }, [updateData])

    useEffect(() => {
        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }
    }, [updateError]);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(rangePrice);
        if (!rangePrice) {
            alert('El precio no puede estar vacio');
            return;
        }

        updateRange({
            data: {
                price: rangePrice
            }
        })

    }

    if (!range) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-4">
                <div className="text-center text-main">
                    <p>{range?.shippingRange?.weightFrom}Kg - {range?.shippingRange?.weightTo}Kg</p>
                </div>
                <div className="text-center">
                    <p>Ó</p>
                </div>
                <div className="text-center text-main">
                    <p>{range?.shippingRange?.volumeFrom}M3 - {range?.shippingRange?.volumeTo}M3</p>
                </div>
                <div className="flex items-center space-x-2">
                    <p className="text-2xl text-gray-500">$</p>
                    <CustomInput value={rangePrice} onChange={(e) => { setRangePrice(e.target.value) }} type="number" />
                </div>
                <div>
                    <Button type="submit">
                        Cambiar precio
                    </Button>
                </div>
            </div>
        </form>
    )
}
export default ShippingRangesRow;