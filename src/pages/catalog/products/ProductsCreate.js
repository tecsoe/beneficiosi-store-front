import clsx from "clsx";
import { useEffect } from "react";
import { useState } from "react";
import { FiTruck } from "react-icons/fi";
import {
    IoFastFoodOutline,
    IoImagesSharp,
    IoInformationCircleSharp,
    IoListOutline,
    IoLogoUsd,
    IoPricetagsOutline
} from "react-icons/io5";
import { useHistory } from "react-router-dom";
import ProductForm from "../../../components/product-form/ProductForm";
import SuccessProductCreate from "../../../components/product-form/SuccessProductCreate";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";
import useBrands from "../../../hooks/useBrands";
import useCategoriesStores from "../../../hooks/useCategoriesStores";
import useDeliveryTypes from "../../../hooks/useDelyveryTypes";
import useTags from "../../../hooks/useTags";

const initialProductData = () => ({
    name: "",
    reference: "",
    shortDescription: "",
    description: "",
    quantity: 0,
    price: 0,
    videos: [],
    images: [null, null, null, null, null, null, null, null],
    categoryIds: [],
    tagIds: [],
    brandId: "",
    featureGroups: [],
    features: [],
    width: 0,
    height: 0,
    length: 0,
    weight: 0,
    deliveryMethodTypeCodes: []
});

const ProductsCreate = () => {

    const history = useHistory();

    const [step, setStep] = useState(1);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);

    const [previewImages, setPreviewImages] = useState(["", "", "", "", "", "", "", ""]);
    
    const [productData, setProductData] = useState(initialProductData());

    const [createdProduct, setCreatedProduct] = useState(null);

    const [tagsFilters, setTagsFilters] = useState("");

    const { setLoading, setCustomAlert, user } = useAuth();

    const [{ brands, error: errorBrands }, getBrands] = useBrands({ options: { useCache: false, manual: true } });

    const [{ deliveryTypes, error: errorDeliveryTypes }, getDeliveryTypes] = useDeliveryTypes({ options: { useCache: false, manual: true } });

    const [{ tags, error: errorTags, loading: loadingTags }, getTags] = useTags({ options: { useCache: false, manual: true } });

    const [{ categoriesStores, error: errorCategoriesStores }, getCategoriesStores] = useCategoriesStores({ params: { parentOnly: true, storeId: user?.storeId, perPage: 9999999999999 }, options: { useCache: false, manual: true } });

    const [{ data: createProductData, error: createProductError, loading: createProductLoading }, createProduct] = useAxios({ url: "/products", method: "POST" }, { useCache: false, manual: true });

    useEffect(() => {
        getTags({ params: { name: tagsFilters } });
    }, [tagsFilters])

    useEffect(() => {
        setLoading({ show: true, message: "Obteniendo datos" });
        Promise.all([getBrands(), getDeliveryTypes(), getTags(), getCategoriesStores()]).then((values) => {
            setLoading({ show: false, message: "" });
        })
    }, []);

    useEffect(() => {
        if (!productData?.deliveryMethodTypeCodes.includes('dmt-001') || productData?.deliveryMethodTypeCodes.includes('dmt-002')) {
            setProductData((oldProductData) => {
                return {
                    ...oldProductData,
                    width: 1,
                    height: 1,
                    length: 1,
                    weight: 1,
                }
            })
        }
    }, [productData?.deliveryMethodTypeCodes])

    useEffect(() => {
        if (createProductData) {
            setCreatedProduct(createProductData);
            setLoading({ show: false, message: "" });
            setShowAlertSuccess(true);
        }
    }, [createProductData])

    useEffect(() => {
        if (errorBrands) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${errorBrands?.response?.status === 400 ? errorBrands?.response?.data.message[0] : errorBrands?.response?.data.message}.`, severity: "error" });
        }
        if (errorDeliveryTypes) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${errorDeliveryTypes?.response?.status === 400 ? errorDeliveryTypes?.response?.data.message[0] : errorDeliveryTypes?.response?.data.message}.`, severity: "error" });
        }
        if (errorTags) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${errorTags?.response?.status === 400 ? errorTags?.response?.data.message[0] : errorTags?.response?.data.message}.`, severity: "error" });
        }
        if (errorCategoriesStores) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${errorCategoriesStores?.response?.status === 400 ? errorCategoriesStores?.response?.data.message[0] : errorCategoriesStores?.response?.data.message}.`, severity: "error" });
        }

        if (createProductError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createProductError?.response?.status === 400 ? createProductError?.response?.data.message[0] : createProductError?.response?.data.message}.`, severity: "error" });
        }
    }, [errorBrands, errorDeliveryTypes, errorTags, errorCategoriesStores, createProductError]);


    const handleChange = (e) => {

        if (e.target.type === "number" && e.target.value < 0) {
            alert('el valor no puede ser menor a 0');
            return;
        }

        if (e.target.for === "featureGroups") {
            setProductData((oldProductData) => {
                const updatedArray = [...oldProductData.featureGroups];
                const updateRange = updatedArray[e.target.index];
                const featuresArray = [
                    ...updateRange.features
                ];
                featuresArray.splice(e.target.index2, 1, { ...featuresArray[e.target.index2], [e.target.name]: e.target.type === "checkbox" ? !featuresArray[e.target.index2][e.target.name] : e.target.value })
                updatedArray.splice(e.target.index, 1, { ...updateRange, features: featuresArray });
                return {
                    ...oldProductData,
                    featureGroups: updatedArray
                }
            });
            return;
        }

        if (e.target.for === "features") {
            setProductData((oldProductData) => {
                const updatedArray = [...oldProductData[e.target.for]];
                const updatedRange = updatedArray[e.target.index];
                updatedArray.splice(e.target.index, 1, { ...updatedRange, [e.target.name]: e.target.type === "checkbox" ? !updatedRange[e.target.name] : e.target.value });
                return {
                    ...oldProductData,
                    [e.target.for]: updatedArray
                }
            });
            return;
        }
        if (e.target.type === "checkbox") {
            const value = productData[e.target.name].includes(e.target.value);
            if (value) {
                const newValues = productData[e.target.name].filter(n => n !== e.target.value);
                setProductData((oldProductData) => {
                    return {
                        ...oldProductData,
                        [e.target.name]: newValues
                    }
                });
            } else {
                setProductData((oldProductData) => {
                    return {
                        ...oldProductData,
                        [e.target.name]: [e.target.value, ...oldProductData[e.target.name]]
                    }
                });
            }

            return;
        }

        if (e.target.index !== undefined) {
            setProductData((oldProductData) => {
                const imagesToUpdate = [...oldProductData.images];
                imagesToUpdate.splice(e.target.index, 1, e?.target?.files?.length > 0 ? e.target.files[0] : null);

                return {
                    ...oldProductData,
                    images: imagesToUpdate
                }
            });

            setPreviewImages((oldPreviewImages) => {
                const imagesToUpdate = [...oldPreviewImages];
                imagesToUpdate.splice(e.target.index, 1, e?.target?.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null);
                return imagesToUpdate;
            })

            return;
        }


        setProductData((oldProductData) => {
            return {
                ...oldProductData,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmitStep = (e) => {
        setStep(e.actualStep + 1);
    }

    const addFeature = (i) => {
        if (i !== undefined) {
            setProductData((oldProductData) => {
                const updatedArray = [...oldProductData.featureGroups];
                updatedArray.splice(i, 1, { ...updatedArray[i], features: [...updatedArray[i].features, { name: "", value: "", price: 0, isSelectable: true }] })
                return {
                    ...oldProductData,
                    featureGroups: updatedArray
                }
            });

            return;
        }

        setProductData((oldProductData) => {
            return {
                ...oldProductData,
                features: [
                    ...oldProductData.features,
                    { name: "", value: "", price: 0, isSelectable: false }
                ]
            }
        })
    }

    const removeFeature = (feature, i) => {
        if (i !== undefined) {
            setProductData((oldProductData) => {
                const updatedArray = [...oldProductData.featureGroups];
                updatedArray.splice(i, 1, { ...updatedArray[i], features: updatedArray[i].features.filter(feature2 => feature2 !== feature) })
                return {
                    ...oldProductData,
                    featureGroups: updatedArray
                }
            })
            return;
        }

        setProductData((oldProductData) => {
            return {
                ...oldProductData,
                features: oldProductData.features.filter(feature2 => feature2 !== feature)
            }
        })
    }

    const handleAddFeatureGroup = (featureGroup) => {
        setProductData((oldProductData) => {
            return {
                ...oldProductData,
                featureGroups: [
                    ...oldProductData.featureGroups,
                    featureGroup
                ]
            }
        })
    }

    const handleRemoveFeatureGroup = (featureGroup) => {
        setProductData((oldProductData) => {
            return {
                ...oldProductData,
                featureGroups: oldProductData.featureGroups.filter(featureGroup2 => featureGroup2 !== featureGroup)
            }
        })
    }

    const handleAddVideo = (video) => {
        setProductData((prevProductData) => ({
            ...prevProductData,
            videos: [
                ...prevProductData.videos,
                video,
            ],
        }));
    }

    const handleRemoveVideo = (index) => {
        setProductData((prevProductData) => ({
            ...prevProductData,
            videos: prevProductData.videos.filter((_, i) => i !== index),
        }));
    }

    const handleCreateProduct = async () => {
        const { images, videos, deliveryMethodTypeCodes, categoryIds, tagIds, featureGroups, features, ...rest } = productData;
        const data = new FormData();

        for (let key in rest) {
            if (rest[key]) {
                data.append(key, rest[key]);
            }
        }

        for (let index = 0; index < features.length; index++) {
            const feature = features[index];
            if (feature) {
                data.append(`features[${index}][name]`, feature.name);
                data.append(`features[${index}][price]`, feature.price);
                data.append(`features[${index}][value]`, feature.value);
                data.append(`features[${index}][isSelectable]`, `${feature.isSelectable}`);
            }
        }

        for (let index = 0; index < featureGroups.length; index++) {
            const featureGroup = featureGroups[index];
            if (featureGroup) {
                data.append(`featureGroups[${index}][name]`, featureGroup.name);
                data.append(`featureGroups[${index}][isMultiSelectable]`, `${featureGroup.isMultiSelectable}`);
                featureGroup.features.forEach((feature, i2) => {
                    data.append(`featureGroups[${index}][features][${i2}][name]`, feature.name);
                    data.append(`featureGroups[${index}][features][${i2}][price]`, feature.price);
                    data.append(`featureGroups[${index}][features][${i2}][value]`, feature.value);
                    data.append(`featureGroups[${index}][features][${i2}][isSelectable]`, `${feature.isSelectable}`);
                })
            }
        }

        for (let index = 0; index < deliveryMethodTypeCodes.length; index++) {
            const deliveryMethodTypeCode = deliveryMethodTypeCodes[index];
            if (deliveryMethodTypeCode) {
                data.append(`deliveryMethodTypeCodes[]`, deliveryMethodTypeCode);
            }
        }

        for (let index = 0; index < categoryIds.length; index++) {
            const categoryId = categoryIds[index];
            if (categoryId) {
                data.append(`categoryIds[]`, categoryId);
            }
        }

        for (let index = 0; index < tagIds.length; index++) {
            const tagId = tagIds[index];
            if (tagId) {
                data.append(`tagIds[]`, tagId);
            }
        }

        for (let index = 0; index < videos.length; index++) {
            data.append(`videos[${index}][name]`, videos[index]['name']);
            data.append(`videos[${index}][url]`, videos[index]['url']);
        }

        for (let index = 0; index < images.length; index++) {
            const image = images[index];
            if (image) {
                data.append(`images`, image, image.name);
            }
        }
        setLoading({ show: true, message: "Creando Producto" });
        await createProduct({ data });
        setLoading({ show: false, message: "" });

    }

    const handleClose = (e) => {
        setShowAlertSuccess(false);

        if (e === "close") {
            history.push("/catalog/products")
        }

        if (e === "add") {
            setProductData(initialProductData());
            setPreviewImages([null, null, null, null, null, null, null, null])
            setStep(1);
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoFastFoodOutline />
                <p>Crear Producto</p>
            </div>

            <div className="bg-white">
                <div className="flex w-full">
                    <div className={clsx(["transition duration-500 px-8 py-4 w-full border text-center"], {
                        "bg-white text-gray-500": step !== 1,
                        "bg-main text-white": step === 1,
                    })}>
                        <h1 className="flex items-center">
                            1. Información del Producto
                            <IoInformationCircleSharp className="ml-2" />
                        </h1>
                    </div>
                    <div className={clsx(["transition duration-500 px-8 py-4 w-full border text-center"], {
                        "bg-white text-gray-500": step !== 2,
                        "bg-main text-white": step === 2,
                    })}>
                        <h1 className="flex items-center">
                            2. Categorización
                            <IoPricetagsOutline className="ml-2" />
                        </h1>
                    </div>
                    <div className={clsx(["transition duration-500 px-8 py-4 w-full border text-center"], {
                        "bg-white text-gray-500": step !== 3,
                        "bg-main text-white": step === 3,
                    })}>
                        <h1 className="flex items-center">
                            3. Caracteristicas
                            <IoListOutline className="ml-2" />
                        </h1>
                    </div>
                    <div className={clsx(["transition duration-500 px-8 py-4 w-full border text-center"], {
                        "bg-white text-gray-500": step !== 4,
                        "bg-main text-white": step === 4,
                    })}>
                        <h1 className="flex items-center justify-between">
                            4.
                            <div className="w-1/3 text-center">
                                <p>
                                    Imagenes
                                </p>
                                <IoImagesSharp className="m-auto" />
                            </div>
                            <div className="w-1/3 text-center">
                                <p>
                                    Delivery
                                </p>
                                <FiTruck className="m-auto" />
                            </div>
                            <div className="w-1/3 text-center">
                                <p>
                                    Precio
                                </p>
                                <IoLogoUsd className="m-auto" />
                            </div>
                        </h1>
                    </div>
                </div>

                <div className="p-4">
                    <ProductForm
                        onChange={handleChange}
                        values={
                            {
                                FirstStepValues: {
                                    name: productData.name,
                                    reference: productData.reference,
                                    shortDescription: productData.shortDescription,
                                    brandId: productData.brandId,
                                    quantity: productData.quantity,
                                    description: productData.description,
                                    height: productData.height,
                                    width: productData.width,
                                    length: productData.length,
                                    weight: productData.weight,
                                    deliveryMethodTypeCodes: productData.deliveryMethodTypeCodes,
                                    videos: productData.videos,
                                },
                                SecondStepValues: {
                                    tagIds: productData.tagIds,
                                    categoryIds: productData.categoryIds
                                },
                                ThirdStepValues: {
                                    featureGroups: productData.featureGroups,
                                    features: productData.features
                                },
                                FourStepValues: {
                                    images: productData.images,
                                    price: productData.price
                                }
                            }
                        }
                        data={
                            {
                                FirstStepData: {
                                    brands: brands,
                                    deliveryTypes: deliveryTypes,
                                },
                                SecondStepData: {
                                    tags: tags,
                                    categoriesStores: categoriesStores
                                },
                                FourStepData: {
                                    deliveryTypes: deliveryTypes,
                                    previewImages: previewImages
                                }
                            }
                        }
                        activeStep={step}
                        findTags={e => { setTagsFilters(e.target.value) }}
                        findTagsFilterValue={tagsFilters}
                        loadingTags={loadingTags}
                        onCancel={e => setStep(e - 1)}
                        onSubmitStep={handleSubmitStep}
                        onAddVideo={handleAddVideo}
                        onRemoveVideo={handleRemoveVideo}
                        onAddFeature={addFeature}
                        onRemoveFeature={removeFeature}
                        onAddFeatureGroup={handleAddFeatureGroup}
                        onRemoveFeatureGroup={handleRemoveFeatureGroup}
                        onComplete={handleCreateProduct}
                    />
                </div>
            </div>
            <SuccessProductCreate show={showAlertSuccess} product={createProductData} onClose={handleClose} />
        </div>
    )
}

export default ProductsCreate;