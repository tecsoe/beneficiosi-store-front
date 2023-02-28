import clsx from "clsx";
import { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import reactDom from "react-dom";
import { useState } from "react";
import CustomInput from "./CustomInput";
import Button from "./Button";

const SubjectErrorModal = ({ open, onClose, title }) => {

    const modalRef = useRef();

    const [subject, setSubject] = useState("");

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!subject) {
            alert("El motivo no puede estar vacio.");
            return;
        }

        onClose(subject)
    }

    return reactDom.createPortal(
        <div ref={modalRef} onClick={handleCloseModal} className={clsx(["fixed flex top-0 left-0 w-screen z-50 h-screen bg-black bg-opacity-50"], {
            "hidden": !open
        })}>
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
                <h1 className="text-center text-xl font-bold text-gray-500">
                    {title}
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="subject">Motivo</label>
                            <CustomInput
                                placeholder="Motivo del error"
                                id="subject"
                                name="subject"
                                onChange={(e) => { setSubject(e.target.value) }}
                                value={subject} />
                        </div>
                    </div>
                    <div className="text-center space-x-4 mt-4">
                        <Button type="button" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Aceptar
                        </Button>
                    </div>
                </form>
            </div>
        </div >,
        document.getElementById("portal")
    )
}

export default SubjectErrorModal;