import { useState } from "react";
import { useEffect } from "react";
import Button from "../Button";
import CustomInput from "../CustomInput";
import { IoCloseSharp, IoInformationCircleSharp, IoTrashOutline } from "react-icons/io5";

const isBetween = (value, values) => {
    for (const range of values) {
        if (value >= range.from && value <= range.to) {
            return true;
        }
    }
    return false;
}

const ThirdStep = ({ show, deliveryType, onSubmit, goBack }) => {

    const [ranges, setRanges] = useState([]);
    const [newRange, setNewRange] = useState({ weightFrom: 0, weightTo: 0, volumeFrom: 0, volumeTo: 0 })

    const [deliveryRanges, setDeliveryRanges] = useState([]);
    const [newDeliveryRange, setNewDeliveryRange] = useState({ minProducts: 0, maxProducts: 0 });

    const [errorsForm, setErrorsForm] = useState({ weightFrom: null, weightTo: null, volumeFrom: null, volumeTo: null });

    const [deliveryErrorsForm, setDeliveryErrorsForm] = useState({ minProducts: null, maxProducts: null });

    const handleChange = (e) => {
        setNewRange((oldNewRange) => {
            return {
                ...oldNewRange,
                [e.target.name]: Number(e.target.value)
            }
        })
    }

    useEffect(() => {
        console.log(deliveryType);
    }, [deliveryType])

    useEffect(() => {
        const productsRanges = deliveryRanges.map((range) => {
            return {
                from: range.minProducts,
                to: range.maxProducts
            }
        });

        setDeliveryErrorsForm({
            minProducts: isBetween(newDeliveryRange.minProducts, productsRanges) ? "El valor no puede estar entre rangos anteriores." : null,
            maxProducts: isBetween(newDeliveryRange.maxProducts, productsRanges) ? "El valor no puede estar entre rangos anteriores." : null,
        });
    }, [newDeliveryRange, deliveryRanges]);

    useEffect(() => {
        const weightRanges = ranges.map((range) => {
            return {
                from: range.weightFrom,
                to: range.weightTo
            }
        });

        const volumeRanges = ranges.map((range) => {
            return {
                from: range.volumeFrom,
                to: range.volumeTo
            }
        });

        setErrorsForm({
            weightFrom: isBetween(newRange.weightFrom, weightRanges) ? "El peso desde no puede estar dentro de otro rango cargado anteriormente." : null,
            weightTo: isBetween(newRange.weightTo, weightRanges) ? "El peso hasta no puede estar dentro de otro rango cargado anteriormente." : null,
            volumeFrom: isBetween(newRange.volumeFrom, volumeRanges) ? "El volumen desde no puede estar dentro de otro rango cargado anteriormente." : null,
            volumeTo: isBetween(newRange.volumeTo, volumeRanges) ? "El volumen hasta no puede estar dentro de otro rango cargado anteriormente." : null,
        });
    }, [newRange, ranges])

    const handleSubmit = (e) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors] != null) {
                alert("Hay un error en el campo: " + errors);
                return;
            }
        }

        if (newRange.weightTo === 0 || newRange.volumeTo === 0) {
            alert("Los campos hasta no pueden ser 0");
            return;
        }

        setRanges((oldRanges) => {
            return [...oldRanges, newRange]
        })
    }

    const handleSubmitDelivery = (e) => {
        e.preventDefault();

        for (let errors in deliveryErrorsForm) {
            if (deliveryErrorsForm[errors] != null) {
                alert("Hay un error en el campo: " + errors);
                return;
            }
        }

        setDeliveryRanges((oldDeliveryRanges) => {
            return [...oldDeliveryRanges, newDeliveryRange]
        });
    }

    const handleNext = () => {

        if (deliveryType === "dmt-001") {
            if (ranges.length === 0) {
                alert("Tiene que haber al menos un rango.")
                return;
            }
            onSubmit({ thirdStepData: ranges });
        }

        if (deliveryType === "dmt-002") {
            if (deliveryRanges.length === 0) {
                alert("Tiene que haber al menos un rango.")
                return;
            }
            onSubmit({ thirdStepData: deliveryRanges });
        }
    }

    const handleChangeDeliveryRange = (e) => {
        setNewDeliveryRange((oldNewDeliveryRange) => {
            return {
                ...oldNewDeliveryRange,
                [e.target.name]: Number(e.target.value)
            }
        });
    }

    const handleRemoveDeliveryRange = (range) => {
        const newDeliveryRanges = deliveryRanges.filter(ranges2 => ranges2 !== range);
        setDeliveryRanges(newDeliveryRanges);
    }

    const handleRemoveRange = (range) => {
        const newRanges = ranges.filter(ranges2 => ranges2 !== range);
        setRanges(newRanges);
    }

    return (
        <div hidden={!show}>
            {
                deliveryType ?
                    <div>
                        {deliveryType === "dmt-002" ?
                            <div>
                                <div className="flex items-start mb-8">
                                    <IoInformationCircleSharp className="text-main text-3xl" />
                                    <p>
                                        <b>Nota:</b> por favor agrega los rangos minimo y maximos de productos por la cuales va a aumentar el costo del envio.
                                    </p>
                                </div>
                                <ul className="w-1/3">
                                    {
                                        deliveryRanges.map((range, i) => {
                                            return (
                                                <li key={i} className="mb-4 flex items-center justify-between">
                                                    <p className="w-2/3 border-b">
                                                        {range.minProducts} - {range.maxProducts}
                                                    </p>
                                                    <Button onClick={() => { handleRemoveDeliveryRange(range) }}>
                                                        <IoTrashOutline />
                                                    </Button>
                                                </li>
                                            )
                                        })
                                    }
                                    <li>
                                        <form onSubmit={handleSubmitDelivery}>
                                            <p className="text-gray-500 text-xl font-bold">Cantidad Maxima:</p>
                                            <div className="flex justify-between mt-2">
                                                <div className="w-4/12">
                                                    <CustomInput
                                                        autoFocus
                                                        value={newDeliveryRange.minProducts}
                                                        name="minProducts"
                                                        type="number"
                                                        placeholder="Cantidad minima"
                                                        onChange={handleChangeDeliveryRange}
                                                    />
                                                    {
                                                        deliveryErrorsForm.minProducts ?
                                                            <p className="text-red-500">
                                                                {deliveryErrorsForm.minProducts}
                                                            </p>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <div className="w-4/12">
                                                    <CustomInput
                                                        value={newDeliveryRange.maxProducts}
                                                        name="maxProducts"
                                                        type="number"
                                                        onChange={handleChangeDeliveryRange}
                                                        placeholder="Cantidad maxima"
                                                    />
                                                    {
                                                        deliveryErrorsForm.maxProducts ?
                                                            <p className="text-red-500">
                                                                {deliveryErrorsForm.maxProducts}
                                                            </p>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <Button className="h-10" type="submit">
                                                    Agregar
                                                </Button>
                                            </div>
                                        </form>
                                    </li>
                                </ul>
                            </div>
                            :
                            deliveryType === "dmt-001" ?
                                <div>
                                    <div className="flex items-start mb-8">
                                        <IoInformationCircleSharp className="text-main text-3xl" />
                                        <p>
                                            <b>Nota:</b> por favor añade los rangos de peso y volumen estos serviran para calcular <br />
                                            el costo de envio de los productos con esta empresa.
                                        </p>
                                    </div>
                                    <ul>
                                        <li className="flex justify-between items-center p-2 my-2 rounded transition duration-500">
                                            <p className="w-5/12 text-center font-bold text-gray-500">Peso (Kg)</p>
                                            <p className="w-5/12 text-center font-bold text-gray-500">Volumen (M3)</p>
                                        </li>
                                        <li className="flex justify-between items-center p-2 my-2 rounded transition duration-500">
                                            <p className="w-2/12 text-center text-gray-500 font-bold">Desde</p>
                                            <p className="w-2/12 text-center text-gray-500 font-bold">Hasta</p>
                                            <p className="w-2/12 text-center text-gray-500 font-bold">Desde</p>
                                            <p className="w-2/12 text-center text-gray-500 font-bold">Hasta</p>
                                        </li>
                                        {
                                            ranges.map((range, i) => {
                                                return (
                                                    <li key={i} className="flex relative justify-between items-center p-2 my-2 rounded transition duration-500">
                                                        <p className="w-2/12 text-center">{range.weightFrom}</p>
                                                        <p className="w-2/12 text-center">{range.weightTo}</p>
                                                        <p className="w-2/12 text-center">{range.volumeFrom}</p>
                                                        <p className="w-2/12 text-center">{range.volumeTo}</p>
                                                        <Button className="px-2 py-2 absolute right-0" type="button" onClick={() => { handleRemoveRange(range) }}>
                                                            <IoCloseSharp />
                                                        </Button>
                                                    </li>
                                                )
                                            })
                                        }
                                        <li className="p-2 my-2">
                                            <form onSubmit={handleSubmit}>
                                                <div className="flex justify-between items-center">
                                                    <div className="w-2/12">
                                                        <CustomInput autoFocus onChange={handleChange} value={newRange.weightFrom} name="weightFrom" type="number" placeholder="Desde" />
                                                        {
                                                            errorsForm.weightFrom ?
                                                                <p className="text-red-500">{errorsForm.weightFrom}</p>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                    <div className="w-2/12">
                                                        <CustomInput onChange={handleChange} value={newRange.weightTo} name="weightTo" type="number" placeholder="Hasta" />
                                                        {
                                                            errorsForm.weightTo ?
                                                                <p className="text-red-500">{errorsForm.weightTo}</p>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                    <div className="w-2/12">
                                                        <CustomInput onChange={handleChange} value={newRange.volumeFrom} name="volumeFrom" type="number" placeholder="Desde" />
                                                        {
                                                            errorsForm.volumeFrom ?
                                                                <p className="text-red-500">{errorsForm.volumeFrom}</p>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                    <div className="w-2/12">
                                                        <CustomInput onChange={handleChange} value={newRange.volumeTo} name="volumeTo" type="number" placeholder="Hasta" />
                                                        {
                                                            errorsForm.volumeTo ?
                                                                <p className="text-red-500">{errorsForm.volumeTo}</p>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                </div>
                                                <div className="text-right mt-4">
                                                    <Button type="submit" className="w-1/12">
                                                        Agregar
                                                    </Button>
                                                </div>
                                            </form>
                                        </li>
                                    </ul>
                                </div>
                                :
                                <div>
                                    Debe seleccionar el tipo de delivery en el paso nro 1.
                                </div>
                        }
                        <div className="text-right mt-8">
                            <Button onClick={goBack} className="mx-4">
                                Volver atras
                            </Button>
                            <Button onClick={handleNext} className="mx-4">
                                Siguiente paso
                            </Button>
                        </div>
                    </div>
                    :
                    <div className="text-center text-red-500">
                        Debe seleccionar el tipo de delivery en el paso nro 1.
                    </div>
            }
        </div >
    )
}

export default ThirdStep;