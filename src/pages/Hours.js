import { useEffect } from "react";
import { useState } from "react";
import { IoTimeOutline } from "react-icons/io5";
import CustomDateTimePicker from "../components/DateTimePicker";
import { useAuth } from "../contexts/AuthContext";
import useAxios from "../hooks/useAxios";
import useHours from "../hooks/useHours";

const weekDays = [
    {
        name: 'Lunes',
        startAt: null,
        endAt: null,
        active: true
    },
    {
        name: 'martes',
        startAt: null,
        endAt: null,
        active: true
    },
    {
        name: 'Miercoles',
        startAt: null,
        endAt: null,
        active: true
    },
    {
        name: 'Jueves',
        startAt: null,
        endAt: null,
        active: true
    },
    {
        name: 'Viernes',
        startAt: null,
        endAt: null,
        active: true
    },
    {
        name: 'Sabado',
        startAt: null,
        endAt: null,
        active: true
    },
    {
        name: 'Domingo',
        startAt: null,
        endAt: null,
        active: true
    },
];

const Hours = () => {

    const { setLoading, setCustomAlert } = useAuth()

    const [weekDaysValues, setWeekDaysValues] = useState(weekDays);

    const [realyDayToUpdate, setRealyDayToUpdate] = useState(null);

    const [{ data: updateData, loading: updateLoading, error: updateError }, updateDay] = useAxios({ url: `/store-hours/${realyDayToUpdate?.day}`, method: "PUT" }, { useCache: false, manual: true });

    const [show, setShow] = useState(false);

    const [selectedDay, setSelectedDay] = useState(null);

    const [{ hours, loading, error }, getHours] = useHours();

    useEffect(() => {
        if (realyDayToUpdate) {
            setLoading({ show: true, message: "Acualizando horarios" });
            updateDay({ data: realyDayToUpdate }).then(() => {
                setLoading({ show: false, message: "" });
                getHours().then(() => {
                    setCustomAlert({ show: true, message: "los Horarios han sido actualizados.", severity: "success" });
                });
            });
        }
    }, [realyDayToUpdate])


    useEffect(() => {
        if (hours.lenght > 0) {
            setWeekDaysValues(hours);
        }
    }, [hours])

    useEffect(() => {
        setLoading({ show: loading, message: "Obteniendo datos" });
    }, [loading])

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
        }

        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError.response?.status === 400 ? updateError.response?.data.message[0] : updateError.response?.data.message}.`, severity: "error" });
        }
    }, [error, updateError]);


    const showModalHours = (day) => {
        setSelectedDay(day);
        setShow(true);
    }

    const handleActiveDay = (day) => {
        setRealyDayToUpdate({
            ...day,
            isWorkingDay: !day.isWorkingDay
        });
    }

    const handleClose = (e) => {
        setShow(false)
        setSelectedDay(null);
        if (e) {
            console.log(e);
            setRealyDayToUpdate(e);
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoTimeOutline />
                <p>Horarios</p>
            </div>

            <div className="bg-white rounded p-4">
                <div>
                    <div className="flex flex-wrap text-center items-center w-2/3 space-x-4 text-gray-600 font-bold mb-4">
                        <div className="w-2/12">
                        </div>
                        <div className="w-3/12">
                            <p>Hora Inicio</p>
                        </div>
                        <div className="w-3/12">
                            <p>Hora de Cierre</p>
                        </div>
                        <div className="w-3/12">
                            <p>Laborable</p>
                        </div>
                    </div>
                    {
                        hours.length > 0 ?
                            <div>
                                {
                                    hours.map((day, i) => {
                                        return (
                                            <div key={i} className="flex relative items-center space-x-4 w-2/3 p-2 text-gray-600 text-center mb-4">
                                                {
                                                    day.isWorkingDay ?
                                                        null
                                                        :
                                                        <div className="absolute top-0 left-0 w-9/12 h-full bg-black rounded bg-opacity-50">

                                                        </div>
                                                }
                                                <div className="w-2/12 font-bold">
                                                    {day.day}
                                                </div>
                                                <div className="w-3/12">
                                                    <div className="
                                        text-center 
                                        max-w-full 
                                        rounded-full 
                                        p-5 
                                        border-none
                                        bg-gray-200
                                        transition
                                        duration-500
                                        cursor-pointer
                                        hover:bg-white
                                        hover:shadow-xl" onClick={day.isWorkingDay ? () => { showModalHours(day) } : null}>
                                                        {day.startTime}
                                                    </div>
                                                </div>
                                                <div className="w-3/12">
                                                    <div className="text-center max-w-full rounded-full p-5 border-none bg-gray-200 transition duration-500 cursor-pointer hover:bg-white hover:shadow-xl" onClick={day.isWorkingDay ? () => { showModalHours(day) } : null}>
                                                        {day.endTime}
                                                    </div>
                                                </div>
                                                <div className="w-3/12">
                                                    <input checked={day.isWorkingDay} onChange={() => { handleActiveDay(day) }} type="checkbox" className="text-main focus:ring-main rounded-full p-2 border-none bg-gray-200 transition duration-500 cursor-pointer hover:bg-main" />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            :
                            <div className="text-center text-main">
                                Por favor recargue la pagina para mostrar los horarios.
                            </div>
                    }
                </div>
                <CustomDateTimePicker open={show} selectedDay={selectedDay} onClose={handleClose} />
            </div>
        </div>
    )
}

export default Hours;