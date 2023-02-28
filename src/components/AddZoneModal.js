import { useCallback, useEffect, useRef, useState } from "react";
import { IoCheckbox, IoCloseCircleOutline } from "react-icons/io5";
import reactDom from "react-dom";
import { useAuth } from "../contexts/AuthContext";
import useLocations from "../hooks/useLocations";
import CustomInput from "./CustomInput";
import useAxios from "../hooks/useAxios";
import Button from "./Button";


const AddZoneModal = ({ onClose, deliveryMethodZones, show, deliveryMethodId }) => {

    const modalRef = useRef();

    const { setLoading, setCustomAlert } = useAuth();

    const [selectedLocation, setSelectedLocation] = useState(null);

    const [currentLocations, setCurrentLocations] = useState([]);

    const [filters, setFilters] = useState({
        name: '',
        page: 1,
        excludesIds: ''
    });

    const [{ locations, error: locationsError, loading: locationsLoading, numberOfPages }, getLocations] = useLocations({
        options: {
            useCache: false,
            manual: true
        }
    });

    const [{ data: addZoneData, error: addZoneError }, addZone] = useAxios({ url: `/delivery-methods/${deliveryMethodId}/delivery-zones`, method: 'POST' }, { manual: true, useCache: false });

    const observer = useRef();

    const lastLocationsRef = useCallback((location) => {
        if (observer?.current) observer?.current?.disconnect?.();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && filters.page < numberOfPages) {
                handleChange({ target: { name: 'page', value: filters.page + 1 } })
            }
        })
        if (location) observer?.current?.observe?.(location)
    }, [numberOfPages, filters.page]);

    useEffect(() => {
        if (addZoneError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${addZoneError?.response?.status === 400 ? addZoneError?.response?.data.message[0] : addZoneError?.response?.data.message}.`, severity: "error" });
        }
    }, [addZoneError]);

    useEffect(() => {
        if (addZoneData) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `La zona ha sido añadida exitosamente.`, severity: "success" });
            onClose(addZoneData);
        }
    }, [addZoneData])

    useEffect(() => {
        setCurrentLocations((oldCurrentLocations) => [...oldCurrentLocations, ...locations])
    }, [locations])

    useEffect(() => {
        if (deliveryMethodZones?.length > 0) {
            getLocations({
                params: {
                    ...filters
                }
            })
        }
    }, [filters])

    useEffect(() => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                excludesIds: deliveryMethodZones?.join(',')
            }
        })
    }, [deliveryMethodZones])

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose?.();
        }
    }

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            if (e.target.name !== "page") {
                setCurrentLocations([]);
                return {
                    ...oldFilters,
                    [e.target.name]: e.target.value,
                    page: 1
                }
            }
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleClose = () => {
        onClose?.();
    };

    const handleLocation = (location) => {
        setSelectedLocation(
            {
                name: location.name,
                extraPrice: 1000,
                locationIds: [location.id]
            }
        )
    }

    const handleSubmit = async () => {
        if (!selectedLocation) {
            alert('Debe seleccionar una ubicación.')
        }
        setLoading({ show: true, message: 'Añadiendo zona' });
        await addZone({ data: selectedLocation });
        setLoading({ show: false, message: '' });

    }

    if (!show) {
        return null;
    }

    return reactDom.createPortal(
        <div ref={modalRef} onClick={handleCloseModal} className="fixed flex top-0 left-0 w-screen z-50 h-screen bg-black bg-opacity-50">
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
                <h1 className="text-center text-gray-500 text-xl">
                    Seleccione la zona
                </h1>
                <CustomInput
                    name="name"
                    onChange={handleChange}
                    value={filters.name}
                    placeholder="Nombre" />
                <div>
                    {
                        locationsError ?
                            <div className="text-red-500 text-center">
                                Ha ocurrido un error
                            </div>
                            :
                            locationsLoading ?
                                <div className="text-center text-gray-500">
                                    Obteniendo información
                                </div>
                                :
                                <div style={{ maxHeight: '50vh', minWidth: '40vw', overflowY: 'auto' }} className="custom-scrollbar">
                                    {
                                        currentLocations.length > 0 ?
                                            <ul>
                                                <li className="flex justify-between">
                                                    <p className="w-5/12 font-bold text-gray-500">Nombre</p>
                                                    <p className="w-5/12 font-bold text-gray-500">Pertenece a:</p>
                                                </li>
                                                {currentLocations.map((location, i) => {
                                                    return (
                                                        <li
                                                            ref={i + 1 === locations.length ? lastLocationsRef : null}
                                                            onClick={() => { handleLocation(location) }}
                                                            key={i}
                                                            className="flex justify-between items-center p-2 my-2 rounded cursor-pointer transition duration-500 hover:shadow-xl">
                                                            {
                                                                selectedLocation?.locationIds?.[0] === location.id ?
                                                                    <IoCheckbox className="text-green-500 w-1/12" />
                                                                    :
                                                                    null
                                                            }
                                                            <p className="w-5/12">{location.name}</p>
                                                            <p className="w-5/12">
                                                                {
                                                                    location.parent ?
                                                                        location.parent.name
                                                                        :
                                                                        <b>No pertenece a ninguna localidad.</b>
                                                                }
                                                            </p>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            :
                                            <div className="text-center text-red-500">
                                                No hay Ciudades o Provincias
                                            </div>
                                    }
                                </div>
                    }
                </div>
                <div className="mt-4 text-center space-x-4">
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        Agregar
                    </Button>
                </div>
            </div>
        </div >,
        document.getElementById("portal")
    )
}

export default AddZoneModal;