import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useTags from "../hooks/useTags";
import Checkbox from "./Checkbox";

const TagsList = ({ onChange, values, name }) => {

    const { user } = useAuth();

    const [filters, setFilters] = useState({
        page: 1,
        storeCategoryIds: user?.storeCategory?.id
    });

    const observer = useRef();

    const [actualTags, setActualTags] = useState([]);

    const [{ tags, loading: loadingTags, error: errorTags, numberOfPages }, getTags] = useTags({ params: { ...filters } });


    const lastTag = useCallback((tag) => {
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
        if (tag) observer?.current?.observe?.(tag)
    }, [numberOfPages, filters.page]);

    useEffect(() => {
        setActualTags((oldActualTags) => {
            return [...oldActualTags, ...tags];
        });
    }, [tags])

    return (
        <div>
            {
                loadingTags && actualTags?.length === 0 ?
                    <div className="text-center text-gray-500">
                        Obteniendo etiquetas
                    </div>
                    :
                    errorTags ?
                        <div className="text-red-500 text-center">
                            <p>Ha ocurrido un error.</p>
                            <button className="bg-main text-white" onClick={() => { getTags() }}>
                                Reintentar
                            </button>
                        </div>
                        :
                        <>
                            <ul style={{ maxHeight: '300px' }} className="custom-scrollbar overflow-y-auto text-gray-800 space-y-2">
                                {actualTags?.map((tag, i) => <li key={tag.id} ref={i + 1 === actualTags?.length ? lastTag : null}>
                                    <Checkbox
                                        onChange={onChange}
                                        name={name}
                                        value={tag.id}
                                        checked={values?.includes(tag.id)}
                                        id={`${tag.name}-${tag.id}`}
                                        label={tag.name}
                                    />
                                </li>)}
                                {
                                    loadingTags ?
                                        <div className="text-center text-gray-500">
                                            Obteniendo etiquetas
                                        </div>
                                        : null
                                }
                            </ul>
                        </>
            }
        </div>
    )
}

export default TagsList;