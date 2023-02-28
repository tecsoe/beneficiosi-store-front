import clsx from "clsx";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { isRequired, validate } from "../helpers/formsValidations";
import CustomInput from "./CustomInput";

const AnswerFormModal = ({ question, show, onClose }) => {

    const modalRef = useRef();

    const [errorsForm, setErrorsForm] = useState(null);

    const [response, setResponse] = useState("");

    useEffect(() => {
        setErrorsForm(validate(response, [
            { validator: isRequired, errorMessage: "La respuesta no puede estar vacia." },
        ]))
    }, [response])

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const handleCancel = () => {
        onClose(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm != null) {
                alert(errorsForm);
                return;
            }
        }
        onClose(response);
    }

    return (
        <div ref={modalRef} onClick={handleCloseModal} className={clsx(["fixed flex top-0 left-0 w-screen z-50 h-screen bg-black bg-opacity-50"], {
            "hidden": !show
        })}>
            <div className="m-auto bg-white w-1/2 h-1/2 rounded px-24 relative">
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
                <div className="flex w-full h-full">
                    <div className="m-auto w-10/12">
                        <form onSubmit={handleSubmit}>
                            <h1 className="text-center mb-8 text-lg font-bold text-gray-500">
                                Por favor responde la pregunta
                            </h1>
                            <p className="text-center mb-4 text-xl font-bold text-gray-500">
                                {question}
                            </p>
                            <div>
                                <CustomInput value={response} onChange={(e) => { setResponse(e.target.value) }} placeholder="Respuesta..." className="mt-8" />
                                {
                                    errorsForm &&
                                    <p className="text-red-500 m-0">{errorsForm}</p>
                                }
                            </div>
                            <div className="flex px-12 w-full justify-between mt-4">
                                <button type="button" onClick={handleCancel} className="bg-main text-white py-2 px-4 rounded transition duration-500 hover:bg-white hover:shadow-xl hover:text-main">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-main text-white py-2 px-4 rounded transition duration-500 hover:bg-white hover:shadow-xl hover:text-main">
                                    Aceptar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnswerFormModal;