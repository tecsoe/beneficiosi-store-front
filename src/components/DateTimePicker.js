import { TimePickerComponent } from "@syncfusion/ej2-react-calendars"
import clsx from "clsx";
import { format } from "date-fns";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";


const CustomDateTimePicker = ({ open, selectedDay, onClose }) => {

    const [selectedDayData, setSelectedDayData] = useState(null);

    useEffect(() => {
        setSelectedDayData(selectedDay);
    }, [selectedDay])

    const modalRef = useRef();

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    const handleCancel = () => {
        onClose();
    }

    const handleAccept = () => {
        onClose(selectedDayData)
    }

    const handleChange = (e) => {
        setSelectedDayData((oldSelectedDayData) => {
            return {
                ...oldSelectedDayData,
                [e.target.name]: format(e.target.value, "HH:mm:ss")
            }
        });
    }

    return (
        <div ref={modalRef} onClick={handleCloseModal} className={clsx(["fixed flex top-0 left-0 w-screen z-50 h-screen bg-black bg-opacity-50"], {
            "hidden": !open
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
                        <h1 className="text-center mb-24 text-xl font-bold text-gray-500">
                            Por favor introduce una hora
                        </h1>
                        <div className="m-auto w-full flex justify-between">
                            <div className="w-1/3">
                                <p>Hora Inicio</p>
                                <TimePickerComponent name="startTime" value={selectedDay?.startTime} format="HH:mm:ss" onChange={handleChange} allowEdit={false} floatLabelType="auto" openOnFocus={true} />
                            </div>

                            <div className="w-1/3">
                                Hora de Cierre
                                <TimePickerComponent name="endTime" value={selectedDay?.endTime} format="HH:mm:ss" onChange={handleChange} allowEdit={false} floatLabelType="auto" openOnFocus={true} />
                            </div>
                        </div>
                        <div className="flex px-12 w-full justify-between mt-4">
                            <button onClick={handleCancel} className="bg-main text-white py-2 px-4 rounded transition duration-500 hover:bg-white hover:shadow-xl hover:text-main">
                                Cancelar
                            </button>
                            <button onClick={handleAccept} className="bg-main text-white py-2 px-4 rounded transition duration-500 hover:bg-white hover:shadow-xl hover:text-main">
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CustomDateTimePicker;