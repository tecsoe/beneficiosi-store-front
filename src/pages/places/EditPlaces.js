import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import { IoClose, IoPencil } from "react-icons/io5";
import { useHistory, useParams } from "react-router";
import AddZonePlaceModal from "../../components/AddPlaceZoneModal";
import Button from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import ImgUploadInput from "../../components/ImgUploadInput";
import { useAuth } from "../../contexts/AuthContext";
import { isRequired, validate } from '../../helpers/formsValidations';

const EditPlaces = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const { id } = useParams();

    const history = useHistory();

    const [editZone, setEditZone] = useState(null);

    const [placeData, setPlaceData] = useState({
        name: '',
        zones: [],
        image: ''
    });

    const [imgPreview, setImgPreview] = useState(null);

    const [errorsForm, setErrorsForm] = useState({
        name: null,
        zones: null,
        image: null
    });

    const [show, setShow] = useState(false);

    const [{ data: place, loading: placeLoading, error: placeError }, getPlace] = useAxios({ url: `/places/${id}` }, { useCache: false });

    const [{ data: editData, error: editError }, editPlace] = useAxios({ url: `/places/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ data: updateZoneData, error: updateZoneError }, updateZone] = useAxios({ url: `/places/${id}/zones/${editZone?.id}`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ data: createZoneData, error: createZoneError }, createZone] = useAxios({ url: `/places/${id}/zones`, method: 'POST' }, { manual: true, useCache: false });

    const [{ data: deleteZoneData, error: deleteZoneError }, deleteZone] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        if (place) {
            const { imgPath, ...rest } = place;
            setImgPreview(`${process.env.REACT_APP_API_URL}/${imgPath}`);
            setPlaceData(rest);
        }
    }, [place]);

    useEffect(() => {
        setErrorsForm({
            name: validate(placeData.name, [
                { validator: isRequired, errorMessage: "El nombre no puede estar vacio." },
            ]),
            image: validate(placeData.image, [
                { validator: isRequired, errorMessage: "La imagen es obligatoria." },
            ]),
            zones: placeData?.zones?.length > 0 ? null : 'Debe añadir al menos una zona.'
        });
    }, [placeData]);

    useEffect(() => {
        setLoading({ show: placeLoading, message: 'Cargando' });
    }, [placeLoading]);

    useEffect(() => {
        if (updateZoneData) {
            setLoading({ show: false, message: '' });
            setCustomAlert({ show: true, message: 'Se ha actualizado exitosamente.', severity: 'success' });
            setPlaceData(updateZoneData);
        }

        if (editData) {
            setLoading({ show: false, message: '' });
            setCustomAlert({ show: true, message: 'Se ha actualizado exitosamente.', severity: 'success' });
            setPlaceData(editData);
        }

        if (createZoneData) {
            setLoading({ show: false, message: '' });
            setPlaceData(createZoneData);
            setCustomAlert({ show: true, message: 'Se ha añadido exitosamente.', severity: 'success' });
        }

        if (deleteZoneData) {
            setLoading({ show: false, message: '' });
            setPlaceData(deleteZoneData);
            setCustomAlert({ show: true, message: 'Se ha eliminado exitosamente.', severity: 'success' });
        }
    }, [createZoneData, updateZoneData, editData, deleteZoneData]);

    useEffect(() => {
        if (placeError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${placeError?.response?.status === 400 ? placeError?.response?.data.message[0] : placeError?.response?.data.message}.`, severity: "error" });
        }

        if (createZoneError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createZoneError?.response?.status === 400 ? createZoneError?.response?.data.message[0] : createZoneError?.response?.data.message}.`, severity: "error" });
        }

        if (editError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${editError?.response?.status === 400 ? editError?.response?.data.message[0] : editError?.response?.data.message}.`, severity: "error" });
        }

        if (updateZoneError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateZoneError?.response?.status === 400 ? updateZoneError?.response?.data.message[0] : updateZoneError?.response?.data.message}.`, severity: "error" });
        }

        if (deleteZoneError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteZoneError?.response?.status === 400 ? deleteZoneError?.response?.data.message[0] : deleteZoneError?.response?.data.message}.`, severity: "error" });
        }
    }, [placeError, editError, updateZoneError, createZoneError, deleteZoneError]);

    const handleChange = (e) => {
        setPlaceData((oldPlaceData) => {
            return {
                ...oldPlaceData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        });
    }

    const handleClose = async (e) => {
        if (e) {
            setLoading({ show: true, message: 'Cargando' });
            if (e?.id) {
                const { id, ...rest } = e;
                await updateZone({ data: rest });
            } else {
                await createZone({ data: e });
            }
            setLoading({ show: false, message: '' });
        }

        setShow(false);
        setEditZone(null);
    }

    const handleDelete = async (zone) => {
        setLoading({ show: true, message: 'Eliminando' });
        await deleteZone({ url: `/places/${id}/zones/${zone?.id}` });
        setLoading({ show: false, message: '' });
    }

    const handleEditZone = (zone) => {
        setEditZone(zone);
        setShow(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors] != null) {
                alert(errorsForm[errors]);
                return;
            }
        }

        setLoading({ show: true, message: 'Actualizando' });
        const data = new FormData();

        data.append('name', placeData?.name);

        if (placeData?.image) {
            data.append('image', placeData?.image, placeData?.image?.name);
        }

        await editPlace({ data });

        setLoading({ show: false, message: '' });
    }

    return (
        <div className="p-4">
            <h1 className="text-gray-500 text-2xl mb-2">
                Crear Lugar o Sala
            </h1>

            <div className="bg-white p-4 rounded">
                <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <div className="space-y-2 w-1/2">
                            <label htmlFor="">Nombre de la sala o lugar</label>
                            <CustomInput name="name" onChange={handleChange} value={placeData?.name} placeholder="Nombre del lugar o sala." />
                        </div>
                        <div className="space-y-2 w-1/2 text-center">
                            <label htmlFor="">Mapa del lugar o sala</label>
                            <ImgUploadInput previewImage={imgPreview} change={handleChange} name="image" className="h-48 w-48" description="Mapa del lugar o sala" />
                        </div>
                    </div>
                    <div className="border my-4" />
                    <div className="text-center mt-4 space-y-2">
                        <h2 className="text-gray-500 text-2xl">
                            Zonas
                        </h2>
                        <div className="flex items-center mb-8 flex-wrap">
                            {
                                placeData?.zones?.map((zone, i) => {
                                    return (
                                        <div className="flex items-center space-x-8 shadow-xl p-4 rounded" style={{ margin: '10px 30px' }} key={i}>
                                            <Button type="button" onClick={() => { handleDelete(zone) }}>
                                                <IoClose />
                                            </Button>
                                            <div className="text-center">
                                                <p className="text-main text-xl">Nombre</p>
                                                <p className="text-gray-500 font-bold text-3xl">{zone?.name}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-main text-xl">Cantidad de butacas</p>
                                                <p className="text-gray-500 font-bold text-3xl">{zone?.capacity}</p>
                                            </div>
                                            <Button type="button" color="warning" onClick={() => { handleEditZone(zone) }}>
                                                <IoPencil />
                                            </Button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <br />
                        <Button type="button" onClick={() => { setShow(true) }}>
                            Añadir Zona
                        </Button>
                    </div>

                    <div className="mt-4 text-right">
                        <Button onClick={handleSubmit}>
                            Guardar cambios
                        </Button>
                    </div>
                </form>
            </div>

            <AddZonePlaceModal show={show} onClose={handleClose} zone={editZone} />
        </div>
    )
}

export default EditPlaces;