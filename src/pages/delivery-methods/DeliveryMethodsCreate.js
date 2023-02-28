import clsx from "clsx";
import { useEffect } from "react";
import { useState } from "react";
import { IoInformationCircleSharp, IoLocationSharp, IoOptionsOutline, IoLogoUsd } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import DeliveryMethodForm from "../../components/delivery-method-form/DeliveryMethodForm";
import { useAuth } from "../../contexts/AuthContext";
import useAxios from "../../hooks/useAxios";
import useDeliveryTypes from "../../hooks/useDelyveryTypes";


const DeliveryMethodsCreate = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const history = useHistory();

    const [{ deliveryTypes, error, loading }, getDeliveryTypes] = useDeliveryTypes();

    const [{ data, loading: createLoading, error: createError }, createDeliveryMethod] = useAxios({ url: "/delivery-methods", method: "POST" }, { useCache: false, manual: true });

    const [step, setStep] = useState(1);

    const [deliveryMethodData, setDeliveryMethodData] = useState({ firstStepData: null, secondStepData: null, thirdStepData: null, deliveryZoneToRanges: null });

    useEffect(() => {
        setLoading({ show: loading, message: "Obteniendo datos" });
    }, [loading]);

    useEffect(() => {
        setLoading({ show: createLoading, message: "Creando Metodo de envio" });
    }, [createLoading])

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }

        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }
    }, [error, createError]);

    useEffect(() => {
        if (data) {
            setCustomAlert({ show: true, message: "Se ha creado exitosamente el metodo de envio.", severity: "success" });
            history.push('/configuration/delivery-methods');
        }
    }, [data])

    useEffect(() => {
        console.log(deliveryTypes);
    }, [deliveryTypes])

    const handleSubmitStep = (e) => {
        const { actualStep, ...stepData } = e;
        setDeliveryMethodData((oldDeliveryMethodData) => {
            return {
                ...oldDeliveryMethodData,
                ...stepData
            }
        });
        if (actualStep < 4) {
            setStep(actualStep + 1);
        }

    }

    const handleComplete = async (e) => {
        const data = new FormData();
        const { image, description, name, deliveryMethodTypeCode } = deliveryMethodData.firstStepData;

        data.append("image", image, image.name);
        data.append("name", name);
        data.append("description", description);
        data.append("deliveryMethodTypeCode", deliveryMethodTypeCode);

        console.log(e.deliveryZoneToRanges);

        if (deliveryMethodTypeCode === 'dmt-001') {
            e?.deliveryZoneToRanges?.forEach((value, i) => {
                data.append(`deliveryZoneToRanges[${i}][deliveryZone][name]`, value.deliveryZone.name);
                data.append(`deliveryZoneToRanges[${i}][deliveryZone][extraPrice]`, value.deliveryZone.extraPrice);
                value.deliveryZone.locationIds.forEach((locationId, i2) => {
                    data.append(`deliveryZoneToRanges[${i}][deliveryZone][locationIds][${i2}]`, locationId);
                });
                value.deliveryRanges.forEach((range, i3) => {
                    data.append(`deliveryZoneToRanges[${i}][deliveryRanges][${i3}][price]`, range.price);
                    data.append(`deliveryZoneToRanges[${i}][deliveryRanges][${i3}][volumeFrom]`, range.volumeFrom);
                    data.append(`deliveryZoneToRanges[${i}][deliveryRanges][${i3}][volumeTo]`, range.volumeTo);
                    data.append(`deliveryZoneToRanges[${i}][deliveryRanges][${i3}][weightFrom]`, range.weightFrom);
                    data.append(`deliveryZoneToRanges[${i}][deliveryRanges][${i3}][weightTo]`, range.weightTo);
                })
            });
        }

        if (deliveryMethodTypeCode === 'dmt-002') {
            e?.deliveryZoneToRanges?.forEach((value, i) => {
                data.append(`deliveryZoneToRanges[${i}][deliveryZone][name]`, value.deliveryZone.name);
                data.append(`deliveryZoneToRanges[${i}][deliveryZone][extraPrice]`, value.deliveryZone.extraPrice);
                value.deliveryZone.locationIds.forEach((locationId, i2) => {
                    data.append(`deliveryZoneToRanges[${i}][deliveryZone][locationIds][${i2}]`, locationId);
                });
                value.deliveryRanges.forEach((range, i3) => {
                    data.append(`deliveryZoneToRanges[${i}][deliveryRanges][${i3}][price]`, range.price);
                    data.append(`deliveryZoneToRanges[${i}][deliveryRanges][${i3}][minProducts]`, range.minProducts);
                    data.append(`deliveryZoneToRanges[${i}][deliveryRanges][${i3}][maxProducts]`, range.maxProducts);
                })
            });
        }


        await createDeliveryMethod({
            data
        });
    }

    return (
        <div className="p-8">
            <h1 className="text-gray-500 text-3xl">
                Crear Metodo de envio
            </h1>

            <div className="mt-4">
                <div className="flex w-full">
                    <div className={clsx(["transition duration-500 px-8 py-4 w-full border text-center"], {
                        "bg-white text-gray-500": step !== 1,
                        "bg-main text-white": step === 1,
                    })}>
                        <h1 className="flex items-center">
                            1. Informacion
                            <IoInformationCircleSharp className="ml-2" />
                        </h1>
                    </div>
                    <div className={clsx(["transition duration-500 px-8 py-4 w-full border text-center"], {
                        "bg-white text-gray-500": step !== 2,
                        "bg-main text-white": step === 2,
                    })}>
                        <h1 className="flex items-center">
                            2. Zonas de Envio
                            <IoLocationSharp className="ml-2" />
                        </h1>
                    </div>
                    <div className={clsx(["transition duration-500 px-8 py-4 w-full border text-center"], {
                        "bg-white text-gray-500": step !== 3,
                        "bg-main text-white": step === 3,
                    })}>
                        <h1 className="flex items-center">
                            3. Rangos
                            <IoOptionsOutline className="ml-2" />
                        </h1>
                    </div>
                    <div className={clsx(["transition duration-500 px-8 py-4 w-full border text-center"], {
                        "bg-white text-gray-500": step !== 4,
                        "bg-main text-white": step === 4,
                    })}>
                        <h1 className="flex items-center">
                            4. Costos
                            <IoLogoUsd className="ml-2" />
                        </h1>
                    </div>
                </div>
                <div className="p-4 bg-white w-full">
                    <DeliveryMethodForm
                        deliveryTypes={deliveryTypes}
                        deliveryType={deliveryMethodData?.firstStepData?.deliveryMethodTypeCode}
                        zones={deliveryMethodData?.secondStepData}
                        ranges={deliveryMethodData?.thirdStepData}
                        onSubmitStep={handleSubmitStep}
                        activeStep={step}
                        onCancel={e => setStep(e - 1)}
                        onComplete={handleComplete} />
                </div>
            </div>
        </div>
    )
}


export default DeliveryMethodsCreate;