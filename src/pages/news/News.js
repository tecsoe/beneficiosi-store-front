import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import { IoClose, IoCreate } from "react-icons/io5";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import Pagination from "../../components/Pagination";
import { useAuth } from "../../contexts/AuthContext";
import useNews from "../../hooks/useNews";
import CustomModal from "../../components/CustomModal";

const News = () => {

    const { user, setLoading, setCustomAlert } = useAuth();

    const [open, setOpen] = useState(false);
    const [newToDelete, setNewToDelete] = useState(null);

    const [filters, setFilters] = useState({
        page: 1,
        id: '',
        title: '',
        storeId: user?.storeId
    });

    const [{ news, error: newsError, loading: newsLoading, numberOfPages }, getNews] = useNews({
        params: {
            ...filters
        }
    });

    const [{ data: deleteData, error: deleteError }, deleteNew] = useAxios({ url: `/news/${newToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading?.({ show: newsLoading, message: 'Obteniendo información' });
    }, [newsLoading]);

    useEffect(() => {
        if (deleteData !== undefined) {
            setCustomAlert({ show: true, message: "El post fue eliminado exitosamente.", severity: "success" });
            getNews();
            setNewToDelete(null);
        }
    }, [deleteData]);

    useEffect(() => {
        if (newsError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${newsError?.response?.status === 400 ? newsError?.response?.data.message[0] : newsError?.response?.data.message}.`, severity: "error" });
        }

        if (deleteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
            setNewToDelete(null);
        }
    }, [newsError, deleteError]);

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleDelete = (newPost) => {
        setNewToDelete(newPost);
        setOpen(true);
    }

    const handleConfirmDelete = async (e) => {
        setOpen(false);

        if (e) {
            setLoading({ show: true, message: "Eliminando Post" });
            await deleteNew();
            setLoading({ show: false, message: "" });
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-gray-500 text-2xl mb-4">Post de noticias</h1>
            <div className="text-right">
                <Button to={`news/create`}>
                    Agregar nuevo
                </Button>
            </div>

            <div className="bg-white p-4 items-center w-full rounded mt-4">
                <div className="flex items-center space-x-4">
                    <div className="w-1/4 text-center">
                        <label htmlFor="">
                            ID
                        </label>
                        <CustomInput
                            name="id"
                            onChange={handleChange}
                            placeholder="ID"
                            value={filters?.id}

                        />
                    </div>
                    <div className="w-1/4 text-center">
                        <label htmlFor="">
                            Titulo
                        </label>
                        <CustomInput
                            name="title"
                            onChange={handleChange}
                            placeholder="Titulo"
                            value={filters?.title}

                        />
                    </div>
                    <div className="w-1/4 text-center">
                        <p>Imagen</p>
                    </div>
                    <div className="w-1/4 text-center">
                    </div>
                </div>

                {
                    newsError ?
                        <div className="text-center text-red-500">
                            <p>Ha ocurrido un error</p>
                            <Button onClick={() => { getNews({ params: { ...filters } }) }}>
                                Reintentar
                            </Button>
                        </div>
                        :
                        news?.length > 0 ?
                            news?.map((newPost, i) => {
                                return (
                                    <div key={i} className="flex my-4 items-center space-x-4">
                                        <div className="w-1/4 text-center">
                                            {newPost?.id}
                                        </div>
                                        <div className="w-1/4 text-center">
                                            {newPost?.title}
                                        </div>
                                        <div className="w-1/4 text-center">
                                            {newPost?.imgPath ?
                                                <img className="w-24 m-auto" src={`${process.env.REACT_APP_API_URL}/${newPost?.imgPath}`} alt="" />
                                                :
                                                <p>No posee Imagen</p>
                                            }
                                        </div>
                                        <div className="w-1/4 text-center flex items-center justify-center space-x-4">
                                            <Link to={`news/${newPost?.id}/edit`}>
                                                <IoCreate
                                                    className="text-xl text-yellow-500"
                                                    title="Editar"
                                                />
                                            </Link>
                                            <IoClose
                                                onClick={() => { handleDelete(newPost) }}
                                                className="text-xl text-red-500 cursor-pointer"
                                                title="Eliminar"
                                            />
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className="mt-8 text-center text-red-500">
                                No hay post de noticias.
                            </div>

                }
            </div>
            <br />
            <Pagination pages={numberOfPages} activePage={filters.page} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />
            <CustomModal message={`Desea eliminar el Post ${newToDelete?.title}`} open={open} onClose={handleConfirmDelete} />
        </div>
    )
}

export default News;