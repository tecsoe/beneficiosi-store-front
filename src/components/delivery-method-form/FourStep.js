import clsx from "clsx";
import { useState } from "react";
import { useEffect } from "react";
import { IoChevronDownOutline, IoChevronUp, IoInformationCircleSharp } from "react-icons/io5";
import Button from "../Button";
import CustomInput from "../CustomInput";

const FourStep = ({ show, zones, ranges, deliveryType, onSubmit, goBack }) => {

    const [showDetails, setShowDetails] = useState(0);

    const [isSubmited, setIsSubmited] = useState(false);

    const [deliveryZoneToRanges, setDeliveryZoneToRanges] = useState([]);

    useEffect(() => {
        if (ranges && zones) {
            const mapZones = zones?.map((zone, i) => {
                return {
                    deliveryZone: {
                        name: zone.name,
                        locationIds: [zone.id],
                        extraPrice: 0
                    },
                    deliveryRanges: ranges.map((range, i) => {
                        return {
                            price: 0,
                            ...range
                        }
                    })
                }

            });
            setDeliveryZoneToRanges(mapZones);
        }
    }, [zones, ranges]);

    const showDetailsZone = (i) => {
        if (showDetails === i) {
            setShowDetails(null);
            return;
        }

        setShowDetails(i);
    }

    const handleChange = (e, i, iRange) => {
        setDeliveryZoneToRanges((oldDeliveryZoneToRanges) => {

            const updatedArray = [...oldDeliveryZoneToRanges];
            const updatedRange = updatedArray[i].deliveryRanges[iRange];

            updatedArray[i].deliveryRanges.splice(iRange, 1, { ...updatedRange, price: Number(e.target.value) })

            return [
                ...updatedArray
            ]
        })
    }

    const handleChangeExtraPrice = (e, i) => {
        setDeliveryZoneToRanges((oldDeliveryZoneToRanges) => {
            const updatedArray = [...oldDeliveryZoneToRanges];
            const updatedRange = updatedArray[i];

            updatedArray.splice(i, 1, { ...updatedRange, deliveryZone: { ...updatedRange.deliveryZone, extraPrice: Number(e.target.value) } });

            return [
                ...updatedArray
            ]
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsSubmited(true);
    }

    const handleConfirmSubmit = () => {
        onSubmit({ deliveryZoneToRanges });
    }

    return (
        <div hidden={!show} className="px-8">

            <div className="flex items-start mb-8">
                <IoInformationCircleSharp className="text-main text-3xl" />
                <p>
                    <b>Nota:</b> por favor agrega el costo de envio para cada una de las zonas y sus rangos.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <ul>
                    {
                        deliveryZoneToRanges?.map((zone, i) => {
                            return (
                                <li key={i} className="border-b py-4">
                                    <div className="flex justify-between items-center text-2xl text-gray-500">
                                        <h1>
                                            {zone.deliveryZone.name}
                                        </h1>
                                        <button type="button" onClick={() => { showDetailsZone(i) }} className="text-main">
                                            {
                                                showDetails === i ?
                                                    <IoChevronUp />
                                                    :
                                                    <IoChevronDownOutline />
                                            }
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 text-lg font-bold mb-2">Precio por excedente</p>
                                        <CustomInput type="number" className="w-1/4" onChange={e => { handleChangeExtraPrice(e, i) }} value={zone.deliveryZone.extraPrice} />
                                    </div>
                                    {
                                        zone.deliveryRanges?.map((range, iRange) => {
                                            return (
                                                <div className={clsx(["animate__animated animate__zoomIn"], {
                                                    "hidden": showDetails !== i,

                                                })} key={iRange} >
                                                    {
                                                        deliveryType === "dmt-002" ?
                                                            <div className="flex items-center space-x-10 my-4">
                                                                <div className="w-1/4">
                                                                    <p className="text-gray-500 text-lg font-bold text-center mb-2">Min</p>
                                                                    <div className="bg-gray-100 rounded-xl p-2">
                                                                        {range.minProducts}
                                                                    </div>
                                                                </div>
                                                                <div className="w-1/4">
                                                                    <p className="text-gray-500 text-lg font-bold text-center mb-2">Max</p>
                                                                    <div className="bg-gray-100 rounded-xl p-2">
                                                                        {range.maxProducts}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500 text-lg font-bold text-center mb-2">Precio</p>
                                                                    <CustomInput type="number" autoFocus={iRange === 0 && i === 0} onChange={e => { handleChange(e, i, iRange) }} value={range.price} />
                                                                </div>
                                                            </div>
                                                            :
                                                            deliveryType === "dmt-001" ?
                                                                <div className="flex items-end space-x-8">
                                                                    <div className="w-10/12">
                                                                        <div className="flex justify-between items-center p-2 my-2 rounded transition duration-500">
                                                                            <p className="w-5/12 text-center font-bold text-gray-500">Peso (Kg)</p>
                                                                            <p className="w-5/12 text-center font-bold text-gray-500">Volumen (M3)</p>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="w-2/12 bg-gray-100 rounded-xl py-2 px-2">
                                                                                {range.weightFrom}kg
                                                                            </div>
                                                                            <div className="w-2/12 bg-gray-100 rounded-xl py-2 px-2">
                                                                                {range.weightTo}kg
                                                                            </div>
                                                                            <div className="w-2/12 bg-gray-100 rounded-xl py-2 px-2">
                                                                                {range.volumeFrom}m3
                                                                            </div>
                                                                            <div className="w-2/12 bg-gray-100 rounded-xl py-2 px-2">
                                                                                {range.volumeTo}m3
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-center font-bold text-gray-500">Precio</p>
                                                                        <CustomInput type="number" autoFocus={iRange === 0 && i === 0} type="number" value={range.price} onChange={e => { handleChange(e, i, iRange) }} />
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div>
                                                                    Por favor Seleccione el tipo de delivery en el paso nro 1
                                                                </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
                {
                    isSubmited ?
                        <div className="text-center mt-8 space-x-8">
                            <p><b>¿Estas Seguro?</b></p>
                            <p className="mb-6">Por favor verifica todos los rangos y que todos los campos precios tienen el valor correcto.</p>
                            <Button type="button" onClick={e => { setIsSubmited(false) }}>
                                No, necesito revisar
                            </Button>
                            <Button onClick={handleConfirmSubmit} type="button">
                                Si, estoy seguro
                            </Button>
                        </div>
                        :
                        <div className="text-right mt-8 space-x-8">
                            <Button onClick={goBack} type="button">
                                Volver atras
                            </Button>

                            <Button type="submit">
                                Aceptar
                            </Button>
                        </div>
                }
            </form>
        </div>
    )
}

export default FourStep;