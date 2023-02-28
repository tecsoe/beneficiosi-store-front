import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import { IoSadOutline } from "react-icons/io5";
import Button from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import ImgUploadInput from "../../components/ImgUploadInput";
import RenderListStoresCategories from "../../components/RenderListStoresCategories";
import { useAuth } from "../../contexts/AuthContext";
import useCategoriesStores from "../../hooks/useCategoriesStores";
import TagsList from "../../components/TagsList";
import { DatePickerComponent, TimePickerComponent } from "@syncfusion/ej2-react-calendars"
import PlacesList from "../../components/PlacesList";
import { format } from "date-fns";
import EditFunctionModal from "../../components/EditFunctionModal";
import CustomModal from "../../components/CustomModal";
import { useHistory } from "react-router";

const CreateMovies = () => {

    const history = useHistory();

    const { user, setLoading, setCustomAlert } = useAuth();

    const [showData, setShowData] = useState({
        name: '',
        categoryIds: [],
        tagIds: [],
        trailer: '',
        description: '',
    });

    const [eventsDates, setEventsDates] = useState({
        placeId: [],
        date: '',
        startHour: ''
    });

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDetailToEdit, setShowDetailToEdit] = useState(null);

    const [open, setOpen] = useState(false);

    const [showToDelete, setShowToDelete] = useState(null);

    const [shows, setShows] = useState([]);

    const [bannerImage, setBannerImage] = useState(null);

    const [postImage, setPostImage] = useState(null);

    const [{ categoriesStores, error: categoriesStoresError, loading }, getCategoriesStores] = useCategoriesStores({ params: { parentOnly: true, storeId: user?.storeId, perPage: 9999999999999 }, options: { useCache: false } });

    const [{ data: createData, error: createError, loading: createLoading }, createShow] = useAxios({ url: `/shows`, method: 'POST' }, { useCache: false, manual: true });

    const [{ data: addShowData, error: addShowError }, addShow] = useAxios({ url: `/shows/${createData?.id}/shows`, method: 'POST' }, { useCache: false, manual: true });

    const [{ data: deleteData, error: deleteError }, deleteFunctionShow] = useAxios({ url: `/shows/${createData?.id}/shows/${showToDelete?.id}`, method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        if (deleteData !== undefined) {
            setCustomAlert?.({ show: true, message: `Se ha eliminado exitosamente.`, severity: "success" });
            setShows([...deleteData?.shows])
            setLoading?.({ show: false, message: "" });
        }
    }, [deleteData]);

    useEffect(() => {
        if (addShowData) {
            setLoading?.({ show: false, message: '' });
            setCustomAlert?.({ show: true, message: 'Se ha añadido exitosamente', severity: 'success' });
            setShows((oldShows) => {
                return [addShowData, ...oldShows]
            });
        }
    }, [addShowData]);

    useEffect(() => {
        if (createData) {
            setLoading?.({ show: false, message: '' });
            setShowData((oldShowData) => {
                return {
                    ...oldShowData,
                    id: createData?.id
                }
            })
            setCustomAlert?.({ show: true, message: `Se ha creado exitosamente.`, severity: "success" });
            history.push(`/shows/${createData?.id}/edit`);
        }
    }, [createData]);

    useEffect(() => {
        if (categoriesStoresError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${categoriesStoresError?.response?.status === 400 ? categoriesStoresError?.response?.data.message[0] : categoriesStoresError?.response?.data.message}.`, severity: "error" });
        }

        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }

        if (addShowError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${addShowError?.response?.status === 400 ? addShowError?.response?.data.message[0] : addShowError?.response?.data.message}.`, severity: "error" });
        }
    }, [createError, categoriesStoresError, addShowError]);

    const handleChange = (e) => {
        if (e.target.type === "checkbox") {
            const value = showData[e.target.name].includes(Number(e.target.value));
            if (value) {
                const newValues = showData[e.target.name].filter(n => n !== Number(e.target.value));
                setShowData((oldShowData) => {
                    return {
                        ...oldShowData,
                        [e.target.name]: newValues
                    }
                });
            } else {
                setShowData((oldShowData) => {
                    return {
                        ...oldShowData,
                        [e.target.name]: [Number(e.target.value), ...oldShowData[e.target.name]]
                    }
                });
            }

            return;
        }


        setShowData((oldProductData) => {
            return {
                ...oldProductData,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        if (!postImage) {
            alert('El post es obligatorio.');
            return;
        } else {
            data.append('images', postImage, postImage.name);
        }

        if (!bannerImage) {
            alert('El banner es obligatorio.');
            return;
        } else {
            data.append('images', bannerImage, bannerImage.name);
        }

        const { tagIds, categoryIds, ...rest } = showData;

        for (let key in rest) {
            if (!rest[key]) {
                alert(`El campo ${key} es obligatorio.`);
                return;
            } else {
                data.append(key, rest[key]);
            }
        }

        tagIds.forEach((tagId, i) => {
            data.append(`tagIds[${i}]`, tagId);
        });

        categoryIds.forEach((categoryId, i) => {
            data.append(`categoryIds[${i}]`, categoryId);
        });
        setLoading?.({ show: true, message: 'Creando' });
        await createShow({ data });
        setLoading?.({ show: false, message: '' });

    }


    const handleEventsDatesChange = (e) => {
        if (e.target.name === 'placeId') {
            setEventsDates((oldEventsDates) => {
                return {
                    ...oldEventsDates,
                    placeId: [Number(e.target.value)]
                }
            });
            return;
        }

        setEventsDates((oldEventsDates) => {
            return {
                ...oldEventsDates,
                [e.target.name]: e.target.value
            }
        });

        console.log(e);
    }

    useEffect(() => {
        console.log(eventsDates);
    }, [eventsDates])

    const handleAddEvent = async () => {
        if (!eventsDates?.date) {
            alert('Debe ingresar la fecha.');
            return;
        }

        if (!eventsDates?.startHour) {
            alert('Debe ingresar la hora de inicio.');
            return;
        }

        if (eventsDates?.placeId?.length === 0) {
            alert('Debe seleccionar un lugar.');
            return;
        }

        setLoading?.({ show: true, message: 'Creando' });
        await addShow({
            data: {
                placeId: eventsDates?.placeId[0],
                date: `${format(eventsDates?.date, 'yyyy-MM-dd')} ${format(eventsDates?.startHour, 'HH:mm:ss')}`
            }
        });
        setLoading?.({ show: false, message: '' });
    }

    const handleFuntionShow = (showDetail) => {
        setShowDetailToEdit(showDetail);
        setShowEditModal(true);
    }

    const handleClose = () => {
        setShowEditModal(false);
        setShowDetailToEdit(null);
    }

    const handleDeleteShowFuntion = (showDetail) => {
        setShowToDelete(showDetail);
        setOpen(true);
    }

    const handleConfirmDelete = async (e) => {
        setOpen(false);

        if (e) {
            setLoading({ show: true, message: "Eliminando Función" });
            await deleteFunctionShow();
            setLoading({ show: false, message: "" });
        }
    }

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-gray-500 text-2xl font-bold">Crear - Show / Peliculas / Evento</h2>

            <div className="bg-white p-4 rounded">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between">
                        <div className="w-1/3 space-y-2">
                            <label htmlFor="name">Nombre</label>
                            <CustomInput placeholder="Nombre..." name="name" id="name" onChange={handleChange} value={showData?.name} />
                        </div>
                        <div className="w-1/2 flex justify-between">
                            <ImgUploadInput className="h-40 mx-4" change={(e) => { setPostImage(e?.target?.files?.[0]) }} style={{ width: 250 }} description="Post" />
                            <ImgUploadInput change={(e) => { setBannerImage(e?.target?.files?.[0]) }} className="h-40 mx-4" description="Banner" />
                        </div>
                    </div>
                    <br />
                    <div className="space-y-2">
                        <label htmlFor="video">Url: Video presentación / Trailer</label>
                        <CustomInput placeholder="Url del video..." name="trailer" id="video" onChange={handleChange} value={showData?.trailer} />
                    </div>
                    <br />
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <h1 className="text-xl text-gray-500">Selecciona las Categorias</h1>
                            {
                                categoriesStores?.length > 0 ?
                                    <RenderListStoresCategories name="categoryIds" value={showData?.categoryIds} onChange={handleChange} categories={categoriesStores} className="mt-4 w-1/4" />
                                    :
                                    <div className="text-center text-red-500 text-xl">
                                        <IoSadOutline className="m-auto text-4xl" />
                                        <p>No se Encontraron categorias en tu tienda.</p>
                                        <Button target="_blank" type="button" to={"/catalog/categories/create"}>
                                            Cargar Categoria
                                        </Button>
                                    </div>
                            }
                        </div>
                        <div className="w-1/2">
                            <h1 className="text-xl text-gray-500">Selecciona las Etiquetas</h1>
                            <TagsList values={showData?.tagIds} onChange={handleChange} name="tagIds" />
                        </div>
                    </div>
                    <br />
                    <div className="space-y-2">
                        <label htmlFor="name">Descripción</label>
                        <textarea
                            name="description"
                            value={showData?.description}
                            onChange={handleChange}
                            placeholder="Descripción..."
                            rows="5"
                            className="border-none w-full bg-gray-200 rounded-xl transition duration-500 focus:shadow-xl focus:bg-white focus:ring-white"
                        />
                    </div>

                    <div className="text-right mt-4">
                        <Button>Crear</Button>
                    </div>
                </form>

                <div className="border my-4" />
                {
                    createData && showData?.id ?
                        <div>
                            <h1 className="text-gray-500 text-2xl mb-4">Funciones</h1>
                            <div className="flex space-x-12">
                                <div className="flex space-x-8 w-1/2">
                                    <div className="w-1/2">
                                        <label>Fecha</label>
                                        <DatePickerComponent
                                            onChange={handleEventsDatesChange}
                                            value={eventsDates?.date}
                                            name="date"
                                            allowEdit={false}
                                            floatLabelType="auto"
                                            openOnFocus={true}
                                            format="dd/MM/yyyy" />
                                    </div>
                                    <div className="w-1/2">
                                        <label>Hora de inicio</label>
                                        <TimePickerComponent
                                            onChange={handleEventsDatesChange}
                                            name="startHour"
                                            value={eventsDates?.startHour}
                                            allowEdit={false}
                                            floatLabelType="auto"
                                            openOnFocus={true}
                                            format="HH:mm:ss" />
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="">Seleccione El lugar</label>
                                    <PlacesList values={eventsDates?.placeId} name="placeId" onChange={handleEventsDatesChange} />
                                </div>
                            </div>
                            <div className="text-right my-6">
                                <Button onClick={handleAddEvent}>
                                    Agregar
                                </Button>
                            </div>
                            {
                                shows?.length > 0 ?
                                    shows?.map((showdetail, i) => {
                                        return (
                                            <div key={i} className="border-b mb-2 justify-between flex items-center">
                                                <span>Funcion del dia: {format(new Date(showdetail?.date), 'dd/MM/yyyy HH:mm:ss')} En <b>{showdetail?.place?.name}</b></span>
                                                <div className="flex items-center space-x-4">
                                                    <button onClick={() => { handleFuntionShow(showdetail) }}>Editar</button>
                                                    <button onClick={() => { handleDeleteShowFuntion(showdetail) }}>Eliminar</button>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className="text-center text-red-500">
                                        No hay Funciones.
                                    </div>
                            }
                        </div>
                        :
                        <div className="text-center">
                            Al crear el <b>evento / show / pelicula</b>, podrá asignarle las fechas en las cuales se lleve a cabo.
                        </div>
                }
            </div>
            <EditFunctionModal
                show={showEditModal}
                functionShow={showDetailToEdit}
                showId={createData?.id}
                onClose={handleClose} />

            <CustomModal
                message={`Desea eliminar la funcion del dia: ${showToDelete?.date && format(new Date(showToDelete?.date), 'dd/MM/yyyy HH:mm:ss')} En ${showToDelete?.place?.name}`}
                open={open}
                onClose={handleConfirmDelete} />
        </div>
    )
}

export default CreateMovies;