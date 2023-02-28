import { useState } from "react";
import { useEffect } from "react";
import useLocations from "../../hooks/useLocations";
import CustomInput from "../CustomInput";
import { IoCheckbox } from "react-icons/io5";
import Button from "../Button";


const SecondStep = ({ show, onSubmit, goBack }) => {

    const [{ locations, total, error, loading }, getLocations] = useLocations();

    const [filters, setFilters] = useState({ name: "" })

    const [selectedLocations, setSelectedLocations] = useState([]);

    const toggleSelected = (location) => {
        const value = selectedLocations.find((location2) => location2.id === location.id);
        if (value) {
            const newSelectedLocations = selectedLocations.filter(selectedLocation => selectedLocation !== location);
            setSelectedLocations(newSelectedLocations);
        } else {
            setSelectedLocations((oldSelectedLocations) => {
                return [...oldSelectedLocations, location];
            })
        }
    }

    useEffect(() => {
        getLocations({ params: filters });
    }, [filters])

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedLocations.length === 0) {
            alert("Tienes que seleccionar al menos una zona.")
            return;
        }

        onSubmit({ secondStepData: selectedLocations });
    }

    return (
        <div hidden={!show} className="p-4">
            <form onSubmit={handleSubmit}>
                <div className="flex w-full justify-between">
                    <div className="w-5/12">
                        <h1 className="text-lg mb-4 text-center">
                            Listado de Ciudades y Provincias
                        </h1>

                        <CustomInput
                            placeholder="Buscar..."
                            className="mb-4"
                            value={filters.name}
                            onChange={handleChange}
                            name="name"
                        />
                        {
                            loading ?
                                <div className="mt-8">
                                    <div className="spinner">
                                        <div className="double-bounce1 bg-main"></div>
                                        <div className="double-bounce2 bg-main"></div>
                                    </div>
                                    <div className="text-gray-700 text-2xl text-center">Obteniendo Ciudades...</div>
                                </div>
                                :
                                <div>
                                    {
                                        locations.length > 0 ?
                                            <ul>
                                                <li className="flex justify-between">
                                                    <p className="w-5/12 font-bold text-xl text-gray-500">Nombre</p>
                                                    <p className="w-5/12 font-bold text-xl text-gray-500">Pertenece a:</p>
                                                </li>
                                                {locations.map((location, i) => {
                                                    return (
                                                        <li onClick={() => { toggleSelected(location) }} key={i} className="flex justify-between items-center p-2 my-2 rounded cursor-pointer transition duration-500 hover:shadow-xl">
                                                            {
                                                                selectedLocations.find((location2) => location2.id === location.id) ?
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
                    <div className="w-5/12">
                        <h1 className="text-lg mb-4 text-center">
                            Listado de Ciudades y Provincias Seleccionados
                        </h1>
                        <div>
                            {
                                selectedLocations.length > 0 ?
                                    <ul>
                                        <li className="flex justify-between">
                                            <p className="w-5/12 font-bold text-xl text-gray-500">Nombre</p>
                                            <p className="w-5/12 font-bold text-xl text-gray-500">Pertenece a:</p>
                                        </li>
                                        {selectedLocations.map((location, i) => {
                                            return (
                                                <li onClick={() => { toggleSelected(location) }} key={i} className="flex justify-between items-center p-2 my-2 rounded cursor-pointer transition duration-500 hover:shadow-xl">
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
                                        No has seleccionado ciudades o provincias
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <Button type="button" onClick={goBack} className="mx-4">
                        Volver Atras
                    </Button>
                    <Button className="mx-4" type="submit">
                        Siguiente Paso
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default SecondStep;