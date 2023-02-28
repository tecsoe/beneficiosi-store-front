import { useEffect, useState } from "react";
import Button from "../Button";
import CustomInput from "../CustomInput";
import ImgUploadInput from "../ImgUploadInput";
import { IoInformationCircleSharp } from "react-icons/io5";
import { isRequired, validate } from "../../helpers/formsValidations";

const FirstStep = ({ show, onSubmit, deliveryTypes }) => {

    const [firstStepData, setFirstStepData] = useState({ name: "", deliveryMethodTypeCode: "dmt-001", image: null, description: "Metodo de Envio." });

    const [errorsForm, setErrorsForm] = useState({ name: null, deliveryMethodTypeCode: null, image: null, description: null });

    const handleChange = (e) => {
        setFirstStepData((oldFirstStepData) => {
            return {
                ...oldFirstStepData,
                [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
            }
        })
    }

    useEffect(() => {
        setErrorsForm({
            name: validate(firstStepData.name, [
                { validator: isRequired, errorMessage: "El nombre es obligatorio." },
            ]),
            deliveryMethodTypeCode: validate(firstStepData.deliveryMethodTypeCode, [
                { validator: isRequired, errorMessage: "El tipo es Obligatorio." },
            ]),
            image: validate(firstStepData.image, [
                { validator: isRequired, errorMessage: "La imagen es obligatoria." },
            ]),
            description: validate(firstStepData.description, [
                { validator: isRequired, errorMessage: "La descripcion debe ser obligatoria." },
            ]),
        })
    }, [firstStepData])

    const handleSubmit = (e) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors] != null) {
                alert(`Hay un error en el campo: ${errors}`);
                return;
            }
        }
        onSubmit({ firstStepData });
    }

    return (
        <div hidden={!show}>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between">
                    <div className="w-5/12">
                        <label className="mb-2" htmlFor="name">Nombre de la empresa:</label>
                        <CustomInput
                            onChange={handleChange}
                            className="mt-2"
                            name="name"
                            placeholder="Nombre"
                            id="name"></CustomInput>
                        {
                            errorsForm.name ?
                                <p className="text-main">{errorsForm.name}</p>
                                :
                                null
                        }
                    </div>
                    <div className="w-5/12">
                        <label className="mb-2" htmlFor="name">Tipos de envios:</label>
                        <select
                            onChange={handleChange}
                            value={firstStepData.deliveryMethodTypeCode}
                            className="mt-2 capitalize focus:bg-white focus:ring-white focus:shadow-xl w-full rounded-xl border-none bg-gray-100"
                            name="deliveryMethodTypeCode"
                            id="type">
                            {
                                deliveryTypes.map((deliveryType, i) => {
                                    return (
                                        <option className="capitalize" key={i} value={deliveryType.code}>{deliveryType.name}</option>
                                    )
                                })
                            }
                        </select>
                        <div className="mt-2 flex">
                            <p>
                                <IoInformationCircleSharp className="text-main text-xl inline" />
                                <b>Nota:</b> Al seleccionar <b>delivery</b> cambiaran los rangos por el maximo de productos a cada zona.
                                En cambio si se selecciona envios los rangos serán <b>peso y volumen.</b>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="my-8 flex items-center">
                    <div className="w-1/2">
                        <label className="text-left my-2">
                            Descripción:
                        </label>
                        <textarea
                            placeholder="Descripción"
                            className="w-full my-2 rounded bg-gray-100 border-none transition duration-500 focus:bg-white focus:shadow-xl focus:ring-white focus:outline-none"
                            name="description"
                            value={firstStepData.description}
                            onChange={handleChange}
                            rows="5">
                        </textarea>
                        {
                            errorsForm.description ?
                                <p className="text-main">{errorsForm.description}</p>
                                :
                                null
                        }
                    </div>
                    <div className="w-1/2 text-center">
                        <ImgUploadInput className="mt-4 h-48 w-48" description="Logo de la empresa" change={handleChange} name="image" />
                        {
                            errorsForm.image ?
                                <p className="text-main">{errorsForm.image}</p>
                                :
                                null
                        }
                    </div>
                </div>
                <div className="text-right mt-4">
                    <Button type="submit">
                        Siguiente Paso
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default FirstStep;