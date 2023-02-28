import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CustomInput from "../../components/CustomInput";
import ImgUploadInput from "../../components/ImgUploadInput";
import { useAuth } from "../../contexts/AuthContext";
import useAxios from "../../hooks/useAxios";
import { IoPencil, IoTrashSharp } from "react-icons/io5";
import EditDeliveryRangesModal from "../../components/EditShippingRangesModal";
import ShippingRanges from "../../components/ShippingRanges";
import ShippingZones from "../../components/ShippingZones";
import DeliveryRanges from "../../components/DeliveryRanges";
import Button from "../../components/Button";
import AddRangeModal from "../../components/AddRangeModal";
import AddZoneModal from "../../components/AddZoneModal";


const DeliveryMethodsEdit = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const { id } = useParams();

    const [actualDeliveryMethod, setActualDeliveryMethod] = useState({
        name: '',
        description: ''
    });

    const [deliveryMethodData, setDeliveryMethodData] = useState({
        name: '',
        description: '',
        image: null
    });

    const [addRange, setAddRange] = useState(false);
    const [addZone, setAddZone] = useState(false);

    const [{ data: deliveryMethod, error: deliveryMethodError, loading: deliveryMethodLoading }, getDeliveryMethod] = useAxios({ url: `/delivery-methods/${id}` }, { useCache: false });

    const [{ data: updateData, error: updateError }, updateDeliveryMethod] = useAxios({ url: `/delivery-methods/${actualDeliveryMethod?.id}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (updateData) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Actualizacion exitosa`, severity: "success" });
        }
    }, [updateData])

    useEffect(() => {
        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }
    }, [updateError]);

    useEffect(() => {
        if (deliveryMethod) {
            console.log(deliveryMethod);
            setDeliveryMethodData((oldDeliveryMethodData) => {
                return {
                    ...oldDeliveryMethodData,
                    name: deliveryMethod?.name,
                    description: deliveryMethod?.description
                }
            })

            setActualDeliveryMethod(deliveryMethod);
        }
    }, [deliveryMethod])

    useEffect(() => {
        if (deliveryMethodError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deliveryMethodError?.response?.status === 400 ? deliveryMethodError?.response?.data.message[0] : deliveryMethodError?.response?.data.message}.`, severity: "error" });
        }
    }, [deliveryMethodError]);

    useEffect(() => {
        setLoading({ show: deliveryMethodLoading, message: 'Obteniendo información' })
    }, [deliveryMethodLoading])

    const handleChange = (e) => {
        setDeliveryMethodData((oldDeliveryMethodData) => {
            return {
                ...oldDeliveryMethodData,
                [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
            }
        })
    }

    const handleUpdate = (e) => {
        setActualDeliveryMethod(e);
    }

    const handleAddRange = () => {
        setAddRange((oldAddRange) => !oldAddRange);
    }

    const handleAddZone = () => {
        setAddZone((oldAddZone) => !oldAddZone);
    }

    const handleClose = (e) => {
        handleAddRange();
        if (e) {
            setActualDeliveryMethod(e);
        }
    }

    const handleZoneClose = (e) => {
        handleAddZone();
        if (e) {
            setActualDeliveryMethod(e);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        data.append('name', deliveryMethodData?.name);
        data.append('description', deliveryMethodData?.description);

        if (deliveryMethodData?.image) {
            data.append('image', deliveryMethodData?.image, deliveryMethodData?.image?.name);
        }

        setLoading({ show: true, message: 'Actualizando información' });
        await updateDeliveryMethod({ data });
        setLoading({ show: false, message: '' });

    }

    return (
        <div className="p-8">
            <div className="bg-white shadow-lg text-gray-500 rounded-xl p-4 space-y-4">
                <form onSubmit={handleSubmit}>
                    <div className="w-2/3 flex items-center space-x-4">
                        <label className="text-main">Logo de la empresa:</label>
                        {
                            actualDeliveryMethod?.imgPath ?
                                <ImgUploadInput
                                    change={handleChange}
                                    style={{ height: 100, width: 100 }}
                                    className="m-0"
                                    previewImage={`${process.env.REACT_APP_API_URL}/${actualDeliveryMethod?.imgPath}`}
                                    name="image" />
                                :
                                <ImgUploadInput
                                    change={handleChange}
                                    style={{ height: 100, width: 100 }}
                                    className="m-0"
                                    description='logo'
                                    name="image" />
                        }
                    </div>
                    <div className="w-2/3 flex items-center space-x-4">
                        <label className="text-main">
                            Nombre:
                        </label>
                        <CustomInput
                            placeholder="Nombre"
                            name="name"
                            onChange={handleChange}
                            value={deliveryMethodData?.name}
                        />
                    </div>
                    <div className="w-2/3 flex items-center space-x-4">
                        <label className="text-main">
                            Descripción:
                        </label>
                        <textarea
                            placeholder="Descripción"
                            className="w-full my-2 rounded bg-gray-100 border-none transition duration-500 focus:bg-white focus:shadow-xl focus:ring-white focus:outline-none"
                            name="description"
                            value={deliveryMethodData?.description}
                            onChange={handleChange}
                            rows="5">
                        </textarea>
                    </div>
                    <div className="text-right">
                        <Button type="submit">
                            Actualizar informacion
                        </Button>
                    </div>
                </form>
                <br />
                <br />
                <div className="text-right">
                    <Button color="success" onClick={handleAddRange}>
                        Añadir rango
                    </Button>
                </div>
                {
                    actualDeliveryMethod?.deliveryMethodType?.code === 'dmt-001' ?
                        <ShippingRanges
                            deliveryMethodId={actualDeliveryMethod.id}
                            ranges={actualDeliveryMethod?.deliveryZones?.[0]?.deliveryZoneToShippingRanges}
                            onUpdate={handleUpdate}
                        />
                        :
                        <DeliveryRanges
                            deliveryMethodId={actualDeliveryMethod.id}
                            ranges={actualDeliveryMethod?.deliveryZones?.[0]?.deliveryZoneToDeliveryRanges}
                            onUpdate={handleUpdate}
                        />
                }
                <br />
                <br />

                <div className="text-right">
                    <Button color="success" onClick={handleAddZone}>
                        Añadir Zona
                    </Button>
                </div>
                <ShippingZones deliveryMethodCode={actualDeliveryMethod?.deliveryMethodType?.code} onUpdate={handleUpdate} zones={actualDeliveryMethod.deliveryZones} />
            </div>
            <AddRangeModal
                deliveryMethodId={actualDeliveryMethod?.id}
                show={addRange}
                deliveryMethodCode={actualDeliveryMethod?.deliveryMethodType?.code}
                onClose={handleClose} />
            <AddZoneModal
                deliveryMethodId={actualDeliveryMethod?.id}
                show={addZone}
                deliveryMethodZones={deliveryMethod?.deliveryZones?.map((zones, i) => zones?.locations[0].id)}
                onClose={handleZoneClose} />
        </div>
    )
}

export default DeliveryMethodsEdit;