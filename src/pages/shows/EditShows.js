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
import { useParams } from "react-router";
import EditFunctionModal from "../../components/EditFunctionModal";
import CustomModal from "../../components/CustomModal";

const EditShows = () => {

    const { id } = useParams();

    const { user, setLoading, setCustomAlert } = useAuth();

    const [imagesPreview, setImagesPreview] = useState([]);

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDetailToEdit, setShowDetailToEdit] = useState(null);

    const [open, setOpen] = useState(false);

    const [showToDelete, setShowToDelete] = useState(null);

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

    const [shows, setShows] = useState([]);

    const [bannerImage, setBannerImage] = useState(null);

    const [postImage, setPostImage] = useState(null);

    const [{ data: show, error: showError, loading: showLoading }, getShow] = useAxios({ url: `/shows/${id}` }, { useCache: false });

    const [{ categoriesStores, error: categoriesStoresError }, getCategoriesStores] = useCategoriesStores({ params: { parentOnly: true, storeId: user?.storeId, perPage: 9999999999999 }, options: { useCache: false } });

    const [{ data: updateData, error: updateError }, updateShow] = useAxios({ url: `/shows/${id}`, method: 'PUT' }, { useCache: false, manual: true });

    const [{ data: addShowData, error: addShowError }, addShow] = useAxios({ url: `/shows/${id}/shows`, method: 'POST' }, { useCache: false, manual: true });

    const [{ data: deleteData, error: deleteError }, deleteFunctionShow] = useAxios({ url: `/shows/${id}/shows/${showToDelete?.id}`, method: 'DELETE' }, { manual: true, useCache: false });

    const [{ data: updateImageData, error: updateImageError }, updateImage] = useAxios({ url: `/products/${id}/images`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        if (show) {
            setShowData({
                name: show?.name,
                categoryIds: show?.categories?.map((category) => category?.id),
                tagIds: show?.tags?.map((tag) => tag?.id),
                description: show?.description,
                trailer: show?.showDetails?.trailer
            })
            setImagesPreview(show?.productImages);
            setShows((oldShows) => {
                return [...show?.shows, ...oldShows]
            })
        }
    }, [show])

    useEffect(() => {
        if (updateImageData) {
            setLoading?.({ show: false, message: '' });
            setCustomAlert?.({ show: true, message: 'La imagen ha sido actualizada exitosamente.', severity: 'success' });
        }
    }, [updateImageData])

    useEffect(() => {
        setLoading({ show: showLoading, message: 'Obteniendo información' })
    }, [showLoading])

    useEffect(() => {
        if (addShowData) {
            setLoading?.({ show: false, message: '' });
            setCustomAlert?.({ show: true, message: 'Se ha añadido exitosamente', severity: 'success' });
            setShows((oldShows) => {
                return [addShowData, ...oldShows]
            });
            setShowDetailToEdit(addShowData);
            setShowEditModal(true);
        }
    }, [addShowData])

    useEffect(() => {
        if (updateData) {
            setLoading?.({ show: false, message: '' });
            setCustomAlert?.({ show: true, message: `Se ha actualizado exitosamente.`, severity: "success" });
        }
    }, [updateData]);

    useEffect(() => {
        if (categoriesStoresError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${categoriesStoresError?.response?.status === 400 ? categoriesStoresError?.response?.data.message[0] : categoriesStoresError?.response?.data.message}.`, severity: "error" });
        }

        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }

        if (addShowError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${addShowError?.response?.status === 400 ? addShowError?.response?.data.message[0] : addShowError?.response?.data.message}.`, severity: "error" });
        }

        if (showError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${showError?.response?.status === 400 ? showError?.response?.data.message[0] : showError?.response?.data.message}.`, severity: "error" });
        }

        if (deleteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
        }

        if (updateImageError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateImageError?.response?.status === 400 ? updateImageError?.response?.data.message[0] : updateImageError?.response?.data.message}.`, severity: "error" });
        }
    }, [updateError, categoriesStoresError, addShowError, showError, deleteError, updateImageError]);

    useEffect(() => {
        if (deleteData !== undefined) {
            setCustomAlert?.({ show: true, message: `Se ha eliminado exitosamente.`, severity: "success" });
            setShowData({
                name: deleteData?.name,
                categoryIds: deleteData?.categories?.map((category) => category?.id),
                tagIds: deleteData?.tags?.map((tag) => tag?.id),
                description: deleteData?.description,
                trailer: deleteData?.deleteDataDetails?.trailer
            })
            setImagesPreview(deleteData?.productImages);
            console.log(deleteData);
            setShows([...deleteData?.shows])
            setLoading?.({ show: false, message: "" });
        }
    }, [deleteData]);

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
        await updateShow({ data: { tagIds, categoryIds, name: showData?.name, trailer: showData?.trailer } });
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
    }

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

    const handleImageChange = async (e) => {
        const data = new FormData();

        data.append('image', e.image, e.image.name);
        data.append('position', e.position);

        setLoading({ show: true, message: 'Actualizando imagen.' });
        await updateImage({ data });
        setLoading({ show: false, message: '' });
    }

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-gray-500 text-2xl font-bold">Editar - Show / Peliculas / Evento</h2>

            <div className="bg-white p-4 rounded">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between">
                        <div className="w-1/3 space-y-2">
                            <label htmlFor="name">Nombre</label>
                            <CustomInput placeholder="Nombre..." name="name" id="name" onChange={handleChange} value={showData?.name} />
                        </div>
                        <div className="w-1/2 flex justify-between">
                            <ImgUploadInput previewImage={`${process.env.REACT_APP_API_URL}/${imagesPreview?.[0]?.path}`} className="h-40 mx-4" change={(e) => { handleImageChange({ image: e?.target?.files?.[0], position: 0 }) }} style={{ width: 250 }} description="Post" />
                            <ImgUploadInput previewImage={`${process.env.REACT_APP_API_URL}/${imagesPreview?.[1]?.path}`} change={(e) => { handleImageChange({ image: e?.target?.files?.[0], position: 1 }) }} className="h-40 mx-4" description="Banner" />
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
                        <Button>Actualizar</Button>
                    </div>
                </form>

                <div className="border my-4" />
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
                            <label htmlFor="">Seleccione la sala</label>
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
            </div>
            <EditFunctionModal
                show={showEditModal}
                functionShow={showDetailToEdit}
                showId={id}
                onClose={handleClose} />

            <CustomModal
                message={`Desea eliminar la funcion del dia: ${showToDelete?.date && format(new Date(showToDelete?.date), 'dd/MM/yyyy HH:mm:ss')} En ${showToDelete?.place?.name}`}
                open={open}
                onClose={handleConfirmDelete} />
        </div>
    )
}

export default EditShows;