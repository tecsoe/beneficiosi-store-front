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
import { useHistory, useParams } from "react-router-dom";
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

const ProductsEdit = () => {

    const params = useParams();

    const history = useHistory();

    const [step, setStep] = useState(1);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);

    const [previewImages, setPreviewImages] = useState(["", "", "", "", "", "", "", ""]);

    const [productData, setProductData] = useState(initialProductData());

    const [editedProduct, setEditedProduct] = useState(null);

    const [tagsFilters, setTagsFilters] = useState("");

    const { setLoading, setCustomAlert, user } = useAuth();

    const [{ data: product, error: productError }, getProduct] = useAxios({ url: `/products/${params.id}` }, { useCache: false, manual: true });

    const [{ brands, error: errorBrands }, getBrands] = useBrands({ options: { useCache: false, manual: true } });

    const [{ deliveryTypes, error: errorDeliveryTypes }, getDeliveryTypes] = useDeliveryTypes({ options: { useCache: false, manual: true } });

    const [{ tags, error: errorTags, loading: loadingTags }, getTags] = useTags({ options: { useCache: false, manual: true } });

    const [{ categoriesStores, error: errorCategoriesStores }, getCategoriesStores] = useCategoriesStores({ params: { parentOnly: true, storeId: user?.storeId, perPage: 9999999999999 }, options: { useCache: false, manual: true } });

    const [{ data: editProductData, error: editProductError }, editProduct] = useAxios({ url: `/products/${params.id}`, method: "PUT" }, { useCache: false, manual: true });

    const [{ data: deleteImageData, error: deleteImageError, loading: deleteImageLoading }, deleteImage] = useAxios({ method: "DELETE" }, { manual: true, useCache: false });

    const [{ data: createImageData, error: createImageError, loading: createImageLoading }, createImage] = useAxios({ url: `/products/${params?.id}/images`, method: "POST" }, { manual: true, useCache: false });
    
    const [{ loading: deleteVideoLoading }, deleteVideo] = useAxios({ method: "DELETE" }, { manual: true, useCache: false });

    const [{ data: createVideoData, error: createVideoError, loading: createVideoLoading }, createVideo] = useAxios({
        method: "POST",
        url: `/products/${params?.id}/videos`
    }, { manual: true, useCache: false });
    
    useEffect(() => {
        setLoading({ show: createImageLoading, message: "Actualizando Imagen." });
    }, [createImageLoading]);

    useEffect(() => {
        setLoading({ show: deleteImageLoading, message: "Eliminando Imagen." });
    }, [deleteImageLoading]);

    useEffect(() => {
        setLoading({ show: deleteVideoLoading, message: "Eliminando Video." });
    }, [deleteVideoLoading]);

    useEffect(() => {
        setLoading({ show: createVideoLoading, message: "Agregando Video." });
    }, [createVideoLoading]);

    useEffect(() => {
        getTags({ params: { name: tagsFilters } });
    }, [tagsFilters]);

    useEffect(() => {
        if (product) {
            const {
                brand,
                deliveryMethodTypes,
                tags,
                categories,
                store,
                slug,
                productImages,
                productVideos,
                productDimensions,
                productFeatureGroups,
                productFeatures,
                productDetails,
                ...rest
            } = product;

            setProductData((oldProductData) => {
                return {
                    ...oldProductData,
                    ...productDetails,
                    ...rest,
                    ...productDimensions,
                    brandId: brand?.id,
                    deliveryMethodTypeCodes: deliveryMethodTypes.map(deliveryMethod => deliveryMethod.code),
                    categoryIds: categories ? categories?.map(category => category.id) : [],
                    tagIds: tags ? tags?.map(tag => tag.id) : [],
                    featureGroups: productFeatureGroups ? productFeatureGroups.map(featureGroup => { return { name: featureGroup.name, isMultiSelectable: featureGroup.isMultiSelectable, features: featureGroup.productFeatureForGroups } }) : [],
                    features: productFeatures ? productFeatures : [],
                    videos: productVideos,
                }
            });
            const ImagesArray = [...productImages.sort(image => image.isPortrait).map(image => { return { url: `${process.env.REACT_APP_API_URL}/${image.path}`, id: image.id, position: image.position } })]
            setPreviewImages((oldImagesPreview) => {
                return [...ImagesArray, ...oldImagesPreview].slice(0, 8)
            })
        }
    }, [product])

    useEffect(() => {
        setLoading({ show: true, message: "Obteniendo datos" });
        Promise.all([getBrands(), getDeliveryTypes(), getTags(), getCategoriesStores(), getProduct()]).then((values) => {
            setLoading({ show: false, message: "" });
        })
    }, []);

    useEffect(() => {
        if (editProductData) {
            setEditedProduct(editProductData);
            setLoading({ show: false, message: "" });
            setShowAlertSuccess(true);
        }

        if (createImageData) {
            setCustomAlert({ show: true, message: "Se ha actualizado la imagen.", severity: "success" })
        }

        if (createVideoData) {
            setCustomAlert({ show: true, message: "Se ha agregado el video.", severity: "success" });
            setProductData((prevProductData) => ({
                ...prevProductData,
                videos: [...prevProductData.videos, createVideoData],
            }));
        }

        if (deleteImageData !== undefined) {
            setCustomAlert({ show: true, message: "Se ha eliminado la imagen exitosamente.", severity: "success" })
        }
    }, [editProductData, createImageData, deleteImageData, createVideoData])

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

        if (editProductError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${editProductError?.response?.status === 400 ? editProductError?.response?.data.message[0] : editProductError?.response?.data.message}.`, severity: "error" });
        }

        if (productError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${productError?.response?.status === 400 ? productError?.response?.data.message[0] : productError?.response?.data.message}.`, severity: "error" });
        }

        if (deleteImageError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteImageError?.response?.status === 400 ? deleteImageError?.response?.data.message[0] : deleteImageError?.response?.data.message}.`, severity: "error" });
        }

        if (createImageError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createImageError?.response?.status === 400 ? createImageError?.response?.data.message[0] : createImageError?.response?.data.message}.`, severity: "error" });
        }

        if (createVideoError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createVideoError?.response?.status === 400 ? createVideoError?.response?.data.message[0] : createVideoError?.response?.data.message}.`, severity: "error" });
        }
    }, [errorBrands, errorDeliveryTypes, errorTags, errorCategoriesStores, editProductError, productError, deleteImageError, createImageError, createVideoError]);


    const handleChange = (e) => {
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
            if (!e.target.files) {
                return deleteImage({ url: `/products/${params?.id}/images/${e.target.index}` })
            }
            const data = new FormData();
            data.append("position", e.target.index);
            data.append("image", e.target.files[0]);
            return createImage({ data });
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
        createVideo({ data: video });
    }

    const handleRemoveVideo = async (index) => {
        if (!window.confirm('¿Está seguro?')) {
            return;
        }
        
        const video = productData.videos[index];

        try {
            await deleteVideo({ url: `/products/${params?.id}/videos/${video.id}` });
            setCustomAlert({ show: true, message: "Se ha eliminado el video.", severity: "success" });
            setProductData((prevProductData) => ({
                ...prevProductData,
                videos: prevProductData.videos.filter((_, i) => i !== index),
            }));
        } catch(err) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({
                show: true,
                message: `Ha ocurrido un error: ${err?.response?.status === 400
                    ? err?.response?.data.message[0]
                    : err?.response?.data.message}.`, severity: "error"
            });
        }
    }

    const handleCreateProduct = async () => {
        const { images, features, featureGroups, ...rest } = productData;

        const newFeatures = [];
        features.forEach((feature, i) => {
            newFeatures.push({ ...feature, isSelectable: `${feature.isSelectable}` });
        });

        const newFeaturesGroups = [];
        featureGroups.forEach((featureGroup, i) => {
            newFeaturesGroups.push({
                ...featureGroup,
                isMultiSelectable: `${featureGroup.isMultiSelectable}`,
                features: [...featureGroup.features.map((feature, i) => { return { ...feature, isSelectable: `${feature.isSelectable}` } })]
            });
        });

        setLoading({ show: true, message: "Actualizando Producto" });
        await editProduct({ data: { ...rest, featureGroups: newFeaturesGroups, features: newFeatures } });
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
                <p>{product?.name ? product?.name : "Editar Producto"}</p>
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
                        isEdit
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
                        onComplete={handleCreateProduct} />
                </div>
            </div>
            <SuccessProductCreate isEdit product={editedProduct} title={"Se ha actualizado la información exitosamente."} show={showAlertSuccess} onClose={handleClose} />
        </div>
    )
}

export default ProductsEdit;