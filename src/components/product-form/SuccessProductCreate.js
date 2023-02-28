import clsx from "clsx";
import { useRef } from "react";
import { IoCheckmarkCircle, IoCloseCircleOutline, IoEye } from "react-icons/io5";
import reactDom from "react-dom";
import Button from "../Button";


const SuccessProductCreate = ({ isEdit, title, show, product, onClose }) => {

    const modalRef = useRef();

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose("close");
        }
    }

    const handleCancel = () => {
        onClose("close");
    }


    return reactDom.createPortal(
        <div ref={modalRef} onClick={handleCloseModal} className={clsx(["fixed flex top-0 left-0 h-screen z-50 w-screen bg-black bg-opacity-50"], {
            "hidden": !show
        })}>
            <div style={{ minHeight: "50%", minWidth: '50%' }} className="m-auto relative bg-white rounded px-5   ">
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

                <IoCheckmarkCircle className="m-auto text-[150px] text-main" />

                <h1 className="text-center my-4 text-xl text-gray-500 font-bold">
                    {title ?
                        title
                        :
                        "El Producto ha sido Añadido exitosamente"}
                </h1>

                <div className="md:py-0 py-4 space-y-4 md:space-y-0 mt-20 md:flex md:items-center md:justify-between text-center">
                    <Button className="flex items-center m-auto md:m-0" onClick={e => { onClose("close") }}>
                        Cerrar
                    </Button>
                    {
                        !isEdit && <Button color="success" onClick={e => { onClose("add") }}>
                            Añadir otro producto
                        </Button>
                    }
                    <a
                        target="_blank"
                        style={{ width: "fit-content" }}
                        className="m-auto md:m-0 bg-main hover:text-main flex items-center hover:bg-white text-white focus:border-none items-center focus:ring-none focus:outline-none px-5 py-2 rounded transition duration-500 hover:shadow-xl"
                        href={`${process.env.REACT_APP_HOST}products/${product?.slug}`}>
                        <IoEye />
                        Ver producto
                    </a>
                </div>
            </div>
        </div>
        ,
        document.getElementById("portal")
    )
}

export default SuccessProductCreate;