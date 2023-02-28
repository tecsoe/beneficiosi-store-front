import { useCallback, useEffect, useRef, useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import useStoreFeatures from "../hooks/useStoreFeatures";
import Button from "./Button";
import CustomInput from "./CustomInput";

const FeatureStoresList = ({ storeCategory, onChange, className, values }) => {

    const { user } = useAuth();

    const [{ storeFeatures, total, numberOfPages, error, loading }, getFeatureStores] = useStoreFeatures();

    const [showMyFeatureStores, setShowMyFeatureStores] = useState(false);

    const [actualFeatureStores, setActualFeatureStores] = useState([]);

    const [filters, setFilters] = useState({ name: "", page: 1 });

    const observer = useRef();

    const lastFeatureStoreRef = useCallback((featureStore) => {
        if (loading) return
        if (observer?.current) observer?.current?.disconnect?.();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && filters.page < numberOfPages) {
                handleFilterChange({ target: { name: "page", value: filters.page + 1 } });
            }
        })
        if (featureStore) observer?.current?.observe?.(featureStore)
    }, [loading, numberOfPages, filters]);

    useEffect(() => {
        setActualFeatureStores([]);
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                page: 1,
            }
        })
    }, [showMyFeatureStores])

    useEffect(() => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                storeCategoryIds: storeCategory
            }
        })
    }, [storeCategory])

    useEffect(() => {
        setActualFeatureStores((oldFeatureStores) => {
            return [...oldFeatureStores, ...storeFeatures];
        })
    }, [storeFeatures]);

    useEffect(() => {
        getFeatureStores({ params: { ...filters } });
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters((oldFilters) => {
            if (e.target.name !== "page") {
                setActualFeatureStores([]);
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

    return (
        <div className="bg-white my-8 p-4">
            <div className="flex justify-between">
                <h3>Filtros:</h3>
                <p>Resultados: {actualFeatureStores.length}</p>
            </div>
            <div className="flex items-center space-x-4 my-2">
                <CustomInput name="name" onChange={handleFilterChange} value={filters.name} placeholder="Nombre" />
            </div>
            <div className={`overflow-y-auto px-4 custom-scrollbar w-full ${className}`}>
                {
                    error ?
                        <div className="text-red-500 text-center">
                            Ha ocurrido un error:  <span onClick={() => { getFeatureStores() }}>¿desea reintentar?</span>
                        </div>
                        :
                        actualFeatureStores.length > 0 ?
                            <div>
                                <h1 className="text-center mt-4 font-bold">Selecciona las caracteristicas que posea tu tienda</h1>
                                <div className="flex flex-wrap space-x-4 items-center mt-4 animate__animated animate__fadeInUp">
                                    {
                                        actualFeatureStores?.map((featureStore, i) => {
                                            return (
                                                <div
                                                    ref={i + 1 === actualFeatureStores.length ? lastFeatureStoreRef : null}
                                                    key={i}
                                                    className="space-x-4">
                                                    <input
                                                        checked={values?.includes(featureStore?.id)}
                                                        type="checkbox"
                                                        onChange={onChange}
                                                        value={featureStore?.id}
                                                        name="featureStores"
                                                        id={`feature-${featureStore?.id}`} />
                                                    <label htmlFor={`feature-${featureStore?.id}`}>
                                                        {featureStore?.name}
                                                    </label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            :
                            <div className="text-center text-red-500">
                                No hay caracteristicas.
                            </div>
                }
                {
                    total === actualFeatureStores.length &&
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
        </div>
    )
}

export default FeatureStoresList;