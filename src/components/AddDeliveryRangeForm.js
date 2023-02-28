import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import CustomInput from "./CustomInput";

const AddDeliveryRangeForm = ({ deliveryMethodId, onCreate }) => {
    const { setCustomAlert, setLoading } = useAuth();

    const [rangeFormData, setRangeFormData] = useState({
        minProducts: 0,
        maxProducts: 1,
        price: 0
    });
    const [{ data: createData, error: createError, loading: createLoading }, createRange] = useAxios({ url: `/delivery-methods/${deliveryMethodId}/delivery-ranges`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading?.({ show: createLoading, message: "Creando rango" });
    }, [createLoading])

    useEffect(() => {
        if (createData) {
            setCustomAlert?.({ show: true, message: "El rango fue creado exitosamente.", severity: 'success' });
            onCreate?.(createData);
        }
    }, [createData])

    useEffect(() => {
        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }
    }, [createError]);

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
        const { ...data } = rangeFormData;
        createRange({ data });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center w-full space-x-4 p-4 rounded">
                <div className="text-center">
                    <p>min</p>
                    <CustomInput
                        type="number"
                        name="minProducts"
                        onChange={handleChange}
                        value={rangeFormData.minProducts} />
                </div>
                <div className="text-center">
                    <p>Max</p>
                    <CustomInput
                        type="number"
                        name="maxProducts"
                        onChange={handleChange}
                        value={rangeFormData.maxProducts} />
                </div>
                <div className="text-center">
                    <p>Costo Inicial</p>
                    <CustomInput
                        type="number"
                        name="price"
                        onChange={handleChange}
                        value={rangeFormData.price} />
                </div>
            </div>
            <div className="text-center my-4 text-gray-500">
                Recuerde insertar valores que no intervengan con los demas rangos.
            </div>
            <div className="text-center space-x-4">
                <Button onClick={onCreate}>
                    Cancelar
                </Button>
                <Button type="submit">
                    Aceptar
                </Button>
            </div>
        </form>
    )
}

export default AddDeliveryRangeForm;