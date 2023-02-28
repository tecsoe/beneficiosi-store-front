import { useEffect } from "react";
import { useState } from "react";
import {
    IoPersonCircle,
    IoImageOutline,
    IoLogoWhatsapp,
    IoMailOutline,
    IoLogoInstagram,
    IoLogoFacebook,
    IoLogoYoutube,
    IoCallSharp
} from "react-icons/io5";
import Map from "../components/googlemaps/Map";
import { useAuth } from "../contexts/AuthContext";
import useAxios from "../hooks/useAxios";
import ImgUploadInput from "../components/ImgUploadInput";
import FeatureStoresList from "../components/FeatureStoresList";

const MyAccount = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const [{ data, error, loading }, getStoreData] = useAxios({ url: "/stores-profile" }, { useCache: false });

    const [{ data: updateData, error: updateError }, updateStoreData] = useAxios({ url: "/stores-profile", method: "PUT" }, { useCache: false, manual: true });

    const [imagesPreview, setImagesPreview] = useState({
        logo: null,
        banner: null,
        frontImage: null
    })

    const [storeData, setStoreData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        latitude: null,
        longitude: null,
        instagram: "",
        facebook: "",
        whatsapp: "",
        videoUrl: "",
        shortDescription: "",
        description: "",
        banner: null,
        logo: null,
        frontImage: null,
        storeFeatureIds: []
    });

    const [googleMapsMarkers, setGoogleMapsMarkers] = useState([]);

    const [googleMapsOptions, setGoogleMapsOptions] = useState({ center: { lat: -34.397, lng: 150.644 }, zoom: 8 })

    useEffect(() => {
        setLoading({ show: loading, message: "Obteniendo datos" });
    }, [loading]);

    useEffect(() => {
        if (error) {
            setCustomAlert({ show: true, message: `${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
        }

        if (updateError) {
            setLoading({ show: false, message: "" });
            setCustomAlert({ show: true, message: `${updateError.response?.status === 400 ? updateError.response?.data.message[0] : updateError.response?.data.message}.`, severity: "error" });
        }
    }, [error, updateError]);

    useEffect(() => {
        if (data) {
            console.log(data);
            const { id, isActive, storeProfile, ...rest } = data;
            setStoreData((oldStoreData) => {
                return {
                    ...oldStoreData,
                    ...rest,
                    ...storeProfile,
                    logo: null,
                    frontImage: null,
                    banner: null,
                    storeFeatureIds: data.storeFeatures.map((feature) => feature.id)
                }
            });
            setGoogleMapsMarkers([{ lat: Number(data.latitude), lng: Number(data.longitude) }]);
            setGoogleMapsOptions({ ...googleMapsOptions, center: { lat: Number(data.latitude), lng: Number(data.longitude) } });

            setImagesPreview({
                frontImage: storeProfile?.frontImage ? process.env.REACT_APP_API_URL + "/" + storeProfile.frontImage : null,
                banner: storeProfile?.banner ? process.env.REACT_APP_API_URL + "/" + storeProfile.banner : null,
                logo: storeProfile?.logo ? process.env.REACT_APP_API_URL + "/" + storeProfile?.logo : null
            });
        }
    }, [data]);

    useEffect(() => {
        if (updateData) {
            setCustomAlert({ show: true, message: `Los datos han sido actualizados exitosamente.`, severity: "success" });
        }
    }, [updateData])

    const handleChange = (e) => {
        setStoreData((oldStoreData) => ({
            ...oldStoreData,
            [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
        }));

        if (e.target.name === "logo") {
            setImagesPreview({
                ...imagesPreview,
                [e.target.name]: URL.createObjectURL(e.target.files[0])
            });
        }
    }

    const hanleMapClick = (e) => {
        setGoogleMapsMarkers([e]);
        setGoogleMapsOptions({ ...googleMapsOptions, center: e });
        setStoreData((oldStoreData) => ({
            ...oldStoreData,
            latitude: e.lat,
            longitude: e.lng
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(storeData);

        const { storeFeatureIds, ...rest } = storeData;

        const formData = new FormData();
        for (let key in rest) {
            if (key === "banner" || key === "logo" || key === "frontImage") {
                if (rest[key]) {
                    formData.append(key, rest[key], rest[key].name)
                }
            } else {
                formData.append(key, rest[key])
            }
        }

        storeFeatureIds.forEach((feature, i) => {
            formData.append(`storeFeatureIds[${i}]`, feature);
        })

        setLoading({ show: true, message: "Actualizando información de la tienda" });
        await updateStoreData({ data: formData });
        setLoading({ show: false, message: "" });
    }

    const handleFeatureStores = (e) => {

        const feature = storeData.storeFeatureIds.includes(Number(e.target.value));

        if (feature) {
            const newValues = storeData.storeFeatureIds.filter(n => n !== Number(e.target.value));
            setStoreData((oldStoreData) => {
                return {
                    ...oldStoreData,
                    storeFeatureIds: newValues,
                }
            });
            return;
        }

        setStoreData((oldStoreData) => {
            return {
                ...oldStoreData,
                storeFeatureIds: [Number(e.target.value), ...oldStoreData.storeFeatureIds],
            }
        });
    }


    return (
        <div className="p-4">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center text-3xl text-gray-500 mb-8">
                    <p>Datos de la tienda</p>
                </div>

                <div className="flex items-center text-gray-500 mb-8 justify-between">
                    <div className="w-1/2 flex items-center">
                        {
                            imagesPreview.logo ?
                                <img src={imagesPreview.logo} className="w-[100px] shadow-2xl rounded-full h-[100px]" alt="logo" />
                                :
                                <IoPersonCircle className="text-[100px]" />
                        }
                        <div className="ml-2">
                            <label htmlFor="logoImage" className="bg-main px-4 py-2 rounded text-white cursor-pointer">
                                Añadir Imagen
                            </label>
                            <input onChange={handleChange} type="file" name="logo" id="logoImage" hidden accept="image/png, image/gif, image/jpeg" />
                        </div>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="storeName" className="text-xl font-bold"><p className="mb-4">Nombre de la tienda:</p></label>
                        <input onChange={handleChange} name="name" value={storeData.name} className="w-1/2 rounded bg-transparent" type="text" />
                    </div>
                </div>

                <ImgUploadInput
                    name="banner"
                    description="Banner de fondo (resolucion recomendada 1920px x 200px)"
                    icon={<IoImageOutline className="m-auto text-[80px]" />}
                    change={handleChange}
                    previewImage={imagesPreview.banner}
                />

                <div className="flex mt-12">
                    <div className="w-1/2">
                        <div className="text-xl text-gray-500 mb-8">
                            <label htmlFor="storeWhatsapp" className="font-bold"><h1 className="mb-4">Whatsapp</h1></label>
                            <div className="w-1/2 relative">
                                <input onChange={handleChange} name="whatsapp" value={storeData.whatsapp} className="rounded bg-transparent w-full" id="storeWhatsapp" type="text" />
                                <IoLogoWhatsapp className="absolute top-[25%] right-2" />
                            </div>
                        </div>

                        <div className="text-xl text-gray-500 mb-8">
                            <label htmlFor="storePhone" className="font-bold"><h1 className="mb-4">Telefono</h1></label>
                            <div className="w-1/2 relative">
                                <input onChange={handleChange} name="phoneNumber" value={storeData.phoneNumber} className="w-full rounded bg-transparent" type="text" id="storePhone" />
                                <IoCallSharp className="absolute top-[25%] right-2" />
                            </div>
                        </div>

                        <div className="text-xl text-gray-500 mb-8">
                            <label htmlFor="storeEmail" className="font-bold"><h1 className="mb-4">Correo Electronico</h1></label>
                            <div className="w-1/2 relative">
                                <input onChange={handleChange} name="email" value={storeData.email} className="rounded bg-transparent w-full" type="text" name="storeEmail" id="storeEmail" />
                                <IoMailOutline className="absolute top-[25%] right-2" />
                            </div>
                        </div>

                        <div className="text-xl text-gray-500 mb-8">
                            <label htmlFor="storeInstagram" className="font-bold"><h1 className="mb-4">Instagram</h1></label>
                            <div className="w-1/2 relative">
                                <input onChange={handleChange} name="instagram" value={storeData.instagram} className="w-full rounded bg-transparent" type="text" id="storeInstagram" />
                                <IoLogoInstagram className="absolute top-[25%] right-2" />
                            </div>
                        </div>

                        <div className="text-xl text-gray-500 mb-8">
                            <label htmlFor="storeFacebook" className="font-bold"><h1 className="mb-4">Facebook</h1></label>
                            <div className="w-1/2 relative">
                                <input onChange={handleChange} name="facebook" value={storeData.facebook} className="w-full rounded bg-transparent" type="text" id="storeFacebook" />
                                <IoLogoFacebook className="absolute top-[25%] right-2" />
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <ImgUploadInput
                            name="frontImage"
                            description="Imagen Frontal (resolucion recomendada 250px x 160px);"
                            icon={<IoImageOutline className="m-auto text-[80px]" />}
                            change={handleChange}
                            previewImage={imagesPreview.frontImage}
                        />

                        <div className="text-xl text-gray-500 mt-8">
                            <label htmlFor="storeShortDescription" className="font-bold"><h1 className="mb-4">Descripcion corta de la tienda</h1></label>
                            <div className="w-1/2 relative">
                                <input
                                    onChange={handleChange}
                                    name="shortDescription"
                                    value={storeData.shortDescription}
                                    className="w-full rounded bg-transparent"
                                    type="text"
                                    id="storeShortDescription" />
                            </div>
                        </div>

                        <div className="text-xl text-gray-500 mt-8">
                            <label htmlFor="storeVideo" className="font-bold"><h1 className="mb-4">Url del video de Youtube</h1></label>
                            <div className="w-1/2 relative">
                                <input onChange={handleChange} name="videoUrl" value={storeData.videoUrl} className="w-full rounded bg-transparent" type="text" id="storeVideo" />
                                <IoLogoYoutube className="absolute top-[25%] right-2" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-xl text-gray-500 mt-8">
                    <label htmlFor="storeDescription" className="font-bold"><h1 className="mb-4">Descripcion de la tienda</h1></label>
                    <div className="relative">
                        <textarea
                            rows={5}
                            onChange={handleChange}
                            name="description"
                            value={storeData.description}
                            className="w-full rounded bg-transparent"
                            type="text"
                            id="storeDescription" />
                    </div>
                </div>

                <h1 className="text-center text-xl mt-4">
                    Caracteristicas de tu tienda
                </h1>
                <FeatureStoresList storeCategory={data?.storeCategory?.id} onChange={handleFeatureStores} values={storeData.storeFeatureIds} />

                <div className="text-xl text-gray-500 mt-8">
                    <Map
                        searchBox={
                            {
                                label: "Direccion:",
                                onChange: handleChange,
                                value: storeData.address,
                                name: "address"
                            }
                        }
                        options={googleMapsOptions}
                        onClick={hanleMapClick}
                        markers={googleMapsMarkers} />
                </div>

                <div className="text-right mt-4">
                    <button className="bg-main px-4 py-2 text-white" type="submit">
                        Aceptar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default MyAccount;