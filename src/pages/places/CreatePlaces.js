import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useHistory } from "react-router";
import AddZonePlaceModal from "../../components/AddPlaceZoneModal";
import Button from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import ImgUploadInput from "../../components/ImgUploadInput";
import { useAuth } from "../../contexts/AuthContext";
import { isRequired, validate } from '../../helpers/formsValidations';

const CreatePlaces = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const history = useHistory();

    const [placeData, setPlaceData] = useState({
        name: '',
        zones: [],
        image: ''
    });

    const [errorsForm, setErrorsForm] = useState({
        name: null,
        zones: null,
        image: null
    });

    const [show, setShow] = useState(false);

    const [{ data: createData, loading: createLoading, error: createError }, createPlace] = useAxios({ url: `/places`, method: 'POST' }, { manual: true, useCache: false });

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
        setLoading({ show: createLoading, message: 'Cargando' });
    }, [createLoading]);

    useEffect(() => {
        if (createData) {
            setCustomAlert({ show: true, message: 'Se ha creado exitosamente.', severity: 'success' });
            history?.push('/places');
        }
    }, [createData]);

    useEffect(() => {
        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }
    }, [createError]);

    const handleChange = (e) => {
        console.log(e);
        setPlaceData((oldPlaceData) => {
            return {
                ...oldPlaceData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        });
    }

    const handleClose = (e) => {
        if (e) {
            setPlaceData((oldPlaceData) => {
                return {
                    ...oldPlaceData,
                    zones: [...oldPlaceData.zones, e]
                }
            });
        }

        setShow(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (let errors in errorsForm) {
            if (errorsForm[errors] != null) {
                alert(errorsForm[errors]);
                return;
            }
        }
        const data = new FormData();
        data.append('name', placeData?.name);
        data.append('image', placeData?.image, placeData?.image?.name);

        placeData?.zones?.forEach((place, i) => {
            data.append(`zones[${i}][name]`, place?.name);
            data.append(`zones[${i}][capacity]`, place?.capacity);
        });

        await createPlace({ data });
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
                            <ImgUploadInput change={handleChange} name="image" className="h-48 w-48" description="Mapa del lugar o sala" />
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
                                            <Button>
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
                            Crear
                        </Button>
                    </div>
                </form>
            </div>

            <AddZonePlaceModal show={show} onClose={handleClose} />
        </div>
    )
}

export default CreatePlaces;