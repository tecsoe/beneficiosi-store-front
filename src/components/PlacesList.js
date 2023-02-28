import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import usePlaces from "../hooks/usePlaces";
import Checkbox from "./Checkbox";

const PlacesList = ({ onChange, values, name }) => {

    const { user } = useAuth();

    const [filters, setFilters] = useState({
        id: "",
        name: "",
        capacity: "",
        page: 1,
        storeId: user?.storeId
    });

    const observer = useRef();

    const [actualPlaces, setActualPlaces] = useState([]);

    const [{ places, loading: loadingPlaces, error: errorPlaces, numberOfPages }, getPlaces] = usePlaces({ params: { ...filters } });


    const lastPlace = useCallback((place) => {
        if (observer?.current) observer?.current?.disconnect?.();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && numberOfPages > filters.page) {
                setFilters((oldFilters) => {
                    return {
                        ...oldFilters,
                        page: oldFilters.page + 1
                    }
                })
            }
        })
        if (place) observer?.current?.observe?.(place)
    }, [numberOfPages, filters.page]);

    useEffect(() => {
        setActualPlaces((oldActualPlaces) => {
            return [...oldActualPlaces, ...places];
        });
    }, [places])

    return (
        <div>
            {
                loadingPlaces && actualPlaces?.length === 0 ?
                    <div className="text-center text-gray-500">
                        Obteniendo Lugares
                    </div>
                    :
                    errorPlaces ?
                        <div className="text-red-500 text-center">
                            <p>Ha ocurrido un error.</p>
                            <button className="bg-main text-white" onClick={() => { getPlaces() }}>
                                Reintentar
                            </button>
                        </div>
                        :
                        <>
                            <ul style={{ maxHeight: '300px' }} className="custom-scrollbar overflow-y-auto text-gray-800 space-y-2">
                                {actualPlaces?.map((place, i) => <li key={place.id} ref={i + 1 === actualPlaces?.length ? lastPlace : null}>
                                    <Checkbox
                                        onChange={onChange}
                                        name={name}
                                        value={place.id}
                                        checked={values?.includes(place.id)}
                                        id={`${place?.name}-${place?.id}`}
                                        label={place?.name}
                                    />
                                </li>)}
                                {
                                    loadingPlaces ?
                                        <div className="text-center text-gray-500">
                                            Obteniendo Lugares
                                        </div>
                                        : null
                                }
                            </ul>
                        </>
            }
        </div>
    )
}

export default PlacesList;