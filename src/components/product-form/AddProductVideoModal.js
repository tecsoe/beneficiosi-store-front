import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import reactDom from "react-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { isRequired, validate } from "../../helpers/formsValidations";
import Button from "../Button";
import CustomInput from "../CustomInput";

const initialData = () => ({
    name: { value: "", isDirty: false },
    url: { value: "", isDirty: false }
});

const AddProductVideoModal = ({ show, onClose }) => {
    const modalRef = useRef();

    const [errorsForm, setErrorsForm] = useState({ name: null, url: null });

    const [videoFormData, setVideoFormData] = useState(initialData());
    
    useEffect(() => {
        setErrorsForm({
            name: validate(videoFormData.name.value, [
                { validator: isRequired, errorMessage: "El nombre es obligatorio." },
            ]),
            url: validate(videoFormData.url.value, [
                { validator: isRequired, errorMessage: "La url es obligatoria." },
            ]),
        })
    }, [videoFormData]);
    
    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const handleCancel = () => {
        onClose();
    }

    const handleChange = (e) => {
        setVideoFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: { value: e.target.value, isDirty: true },
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        for (let error in errorsForm) {
            if (errorsForm[error] != null) {
                alert(errorsForm[error]);
                return;
            }
        }

        const formData = Object.keys(videoFormData).reduce((result, key) => Object.assign(result, {
            [key]: videoFormData[key].value,
        }), {});


        setVideoFormData(initialData());
        onClose(formData);
    }
    
    return reactDom.createPortal(
        <div ref={modalRef} onClick={handleCloseModal} className={clsx(["fixed flex top-0 left-0 h-screen z-50 w-screen bg-black bg-opacity-50"], { hidden: !show })}>
            <div className="m-auto relative h-1/2 w-1/2 bg-white rounded">
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
                        duration-300 hover:text-white hover:bg-main
                    "
                />

                <div className="overflow-y-auto overflow-x-hidden h-full px-5">
                    <h2 className="text-center my-4 text-xl text-gray-500 font-bold">
                        Añadir Nuevo Video
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="my-8">
                            <label htmlFor="name" className="mb-2">Nombre del Video</label>
                            <CustomInput
                                id="name"
                                name="name"
                                placeholder="Nombre"
                                value={videoFormData.name.value}
                                onChange={handleChange}
                            />
                            {errorsForm.name && videoFormData.name.isDirty && <small className="mt-2 text-red-500">{errorsForm.name}</small>}
                        </div>

                        <div className="my-8">
                            <label htmlFor="url" className="mb-2">Url del Video</label>
                            <CustomInput
                                id="url"
                                name="url"
                                placeholder="Url"
                                value={videoFormData.url.value}
                                onChange={handleChange}
                            />
                            {errorsForm.url && videoFormData.url.isDirty && <small className="mt-2 text-red-500">{errorsForm.url}</small>}
                        </div>
                        
                        <div className="text-right mt-12 space-x-4">
                            <Button type="button" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button>
                                Aceptar
                            </Button>
                        </div>
                    </form>
                </div>

            </div>
        </div>,
        document.getElementById("portal")
    );    
}

export default AddProductVideoModal;