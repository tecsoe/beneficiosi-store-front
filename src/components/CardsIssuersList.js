import { useCallback, useEffect, useRef, useState } from "react";
import useCardsIssuers from "../hooks/useCardsIssuers";
import CustomInput from "./CustomInput";

const CardsIssuersList = ({ onChange, name, className, values }) => {

    const [{ cardsIssuers, total, numberOfPages, error, loading }, getCardsIssuers] = useCardsIssuers();

    const [actualCardsIssuers, setActualCardsIssuers] = useState([]);

    const [filters, setFilters] = useState({ name: "", page: 1, cardIssuerTypeId: 1 });

    const observer = useRef();

    const lastCardIssuerRef = useCallback((cardsIssuer) => {
        if (loading) return
        if (observer?.current) observer?.current?.disconnect?.();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && filters.page < numberOfPages) {
                handleFilterChange({ target: { name: "page", value: filters.page + 1 } });
            }
        })
        if (cardsIssuer) observer?.current?.observe?.(cardsIssuer)
    }, [loading, numberOfPages, filters]);



    useEffect(() => {
        setActualCardsIssuers((oldCardsIssuers) => {
            return [...oldCardsIssuers, ...cardsIssuers];
        })
    }, [cardsIssuers])

    useEffect(() => {
        getCardsIssuers({ params: { ...filters } });
    }, [filters])

    const handleFilterChange = (e) => {
        setFilters((oldFilters) => {
            if (e.target.name !== "page") {
                setActualCardsIssuers([]);
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

    const handleChange = (e) => {
        onChange(e);
    }

    return (
        <>
            <div className="flex justify-between">
                <h3>Filtros:</h3>
                <p>Resultados: {actualCardsIssuers.length}</p>
            </div>
            <div className="flex items-center space-x-4 my-2">
                <CustomInput name="name" onChange={handleFilterChange} value={filters.name} placeholder="Nombre" />
            </div>
            <div style={{ maxHeight: "50vh" }} className={`overflow-y-auto px-4 custom-scrollbar w-full ${className}`}>
                {
                    error ?
                        <div className="text-red-500 text-center">
                            Ha ocurrido un error:  <span onClick={() => { getCardsIssuers() }}>¿desea reintentar?</span>
                        </div>
                        :
                        actualCardsIssuers.length > 0 ?
                            <div className="space-y-4 mt-4 animate__animated animate__fadeInUp">
                                {
                                    actualCardsIssuers?.map((cardsIssuer, i) => {
                                        return (
                                            <div ref={i + 1 === actualCardsIssuers.length ? lastCardIssuerRef : null} key={i} className="space-x-4 w-full">
                                                <input
                                                    id={`cardsIssuer-${cardsIssuer?.id}`}
                                                    name={name}
                                                    value={cardsIssuer?.id}
                                                    onChange={handleChange}
                                                    type="checkbox"
                                                    checked={values?.includes?.(cardsIssuer?.id)}
                                                    className="text-main focus:ring-main cursor-pointer"
                                                />
                                                <label className="space-x-2 w-full cursor-pointer" htmlFor={`cardsIssuer-${cardsIssuer?.id}`}>
                                                    {cardsIssuer?.imgPath &&
                                                        <img className="w-10 h-10 rounded inline" src={`${process.env.REACT_APP_API_URL}/${cardsIssuer?.imgPath}`} alt="" />
                                                    }
                                                    <span>{cardsIssuer?.name}</span>
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            :
                            <div className="text-center text-red-500">
                                No hay Bancos.
                            </div>
                }
                {
                    total === actualCardsIssuers.length &&
                    <div className="text-center text-gray-500 text-xl">
                        No hay mas resultados
                    </div>
                }
                {
                    loading &&
                    <div className="text-center text-gray-500 text-xl">
                        Cargando...
                    </div>

                }
            </div>
        </>
    )
}

export default CardsIssuersList;