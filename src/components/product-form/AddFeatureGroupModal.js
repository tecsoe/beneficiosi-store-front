import clsx from "clsx";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { isRequired, validate } from "../../helpers/formsValidations";
import Button from "../Button";
import CustomInput from "../CustomInput";

const AddFeatureGroupModal = ({ show, onClose }) => {

    const modalRef = useRef();

    const [errorsForm, setErrorsForm] = useState({ name: null });

    const [newFeatureGroupData, setNewFeatureGroupData] = useState({ isMultiSelectable: true, name: "", features: [] });

    useEffect(() => {
        setErrorsForm({
            name: validate(newFeatureGroupData.name, [
                { validator: isRequired, errorMessage: "El nombre es Obligatorio." },
            ]),
        })
    }, [newFeatureGroupData])

    useEffect(() => {
        setNewFeatureGroupData({ isMultiSelectable: true, name: "", features: [] });
    }, [onClose])

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const handleCancel = () => {
        onClose();
    }

    const handleAccept = (e) => {
        e?.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors] != null) {
                alert(errorsForm[errors]);
                return;
            }
        }

        onClose(newFeatureGroupData)
    }

    const handleChange = (e) => {
        setNewFeatureGroupData((oldFeatureGroupData) => {
            return {
                ...oldFeatureGroupData,
                [e.target.name]: e.target.type === "checkbox" ? !oldFeatureGroupData[e.target.name] : e.target.value
            }
        })
    }


    return (
        <div ref={modalRef} onClick={handleCloseModal} className={clsx(["fixed flex top-0 left-0 h-screen z-50 w-screen bg-black bg-opacity-50"], {
            "hidden": !show
        })}>
            <div className="m-auto relative h-1/2 w-1/2 bg-white rounded px-5   ">
                <IoCloseCircleOutline
                    onClick={handleCancel}
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
                <h1 className="text-center my-4 text-xl text-gray-500 font-bold">
                    Añadir Nuevo Grupo
                </h1>

                <form onSubmit={handleAccept}>

                    <div className="my-8">
                        <h1 className="mb-2">Nombre del Grupo</h1>
                        <CustomInput name="name" placeholder="Nombre" value={newFeatureGroupData.name} onChange={handleChange} />
                        {
                            errorsForm.name ?
                                <p className="mt-2 text-red-500">{errorsForm.name}</p>
                                :
                                null
                        }
                    </div>
                    <div className="w-1/2 flex items-center space-x-6">
                        <p>¿Seleccion Multiple?</p>
                        <input className="text-main focus:ring-main" type="checkbox" name="isMultiSelectable" checked={newFeatureGroupData.isMultiSelectable} value={newFeatureGroupData.isMultiSelectable} onChange={handleChange} />
                    </div>

                    <div className="text-right mt-12 space-x-4">
                        <Button type="button">
                            Cancelar
                        </Button>
                        <Button>
                            Aceptar
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddFeatureGroupModal;