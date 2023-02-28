import { format } from "date-fns";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import CardsIssuersList from "../../../components/CardsIssuersList";
import CardsList from "../../../components/CardsList";
import CustomInput from "../../../components/CustomInput";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { isRequired, validate } from "../../../helpers/formsValidations";
import useDiscountsTypes from "../../../hooks/useDiscountsTypes";
import useAxios from "../../../hooks/useAxios";
import { useHistory, useParams } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";

const DiscountsEdit = () => {

    const history = useHistory();

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useAuth();

    const [imgPreview, setImgPreview] = useState("");

    const [discount, setDiscount] = useState({
        name: "",
        description: "",
        image: null,
    });

    const [errorsForm, setErrorsForm] = useState({
        name: null,
        description: null,
    });

    const [{ data: discountData, error: discountError, loading: discountLoading }] = useAxios({ url: `/discounts/${id}` }, { useCache: false });

    const [{ data: updateData, error: updateError }, updateDiscount] = useAxios({ url: `/discounts/${id}`, method: "PUT" }, { manual: true, useCache: false });



    useEffect(() => {
        if (discountData) {
            setDiscount((oldDiscount) => {
                return {
                    ...oldDiscount,
                    name: discountData?.name,
                    description: discountData?.description,
                }
            });

            setImgPreview(`${process.env.REACT_APP_API_URL}/${discountData.imgPath}`);
            console.log(discountData);
        }
    }, [discountData])

    useEffect(() => {
        setLoading?.({ show: discountLoading, message: "Obteniendo información" });
    }, [discountLoading])

    useEffect(() => {
        if (updateData) {
            setCustomAlert?.({ show: true, message: "El descuento ha sido actualizado exitosamente.", severity: "success" });
            history.push("/catalog/discounts");
        }
    }, [updateData]);

    useEffect(() => {
        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }

        if (discountError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${discountError?.response?.status === 400 ? discountError?.response?.data.message[0] : discountError?.response?.data.message}.`, severity: "error" });
        }
    }, [updateError, discountError]);

    useEffect(() => {
        setErrorsForm({
            name: validate(discount.name, [
                { validator: isRequired, errorMessage: "El nombre es obligatorio." },
            ]),
            description: validate(discount.description, [
                { validator: isRequired, errorMessage: "La descripción es obligatoria." },
            ])
        })
    }, [discount])

    useEffect(() => {
        setDiscount((oldDiscount) => {
            return {
                ...oldDiscount,
                cardsIssuersIds: [],
                cardsIds: []
            }
        });
    }, [discount.discountTypeCode])

    useEffect(() => {
        console.log(discount);
    }, [discount])

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors] != null) {
                alert(errorsForm[errors]);
                return;
            }
        }

        const data = new FormData();

        const { image, ...rest } = discount;

        for (let value in rest) {
            data.append(value, rest[value]);
        }

        if (image) {
            data.append("image", image, image.name);
        }

        setLoading({ show: true, message: "Actualizando el descuento." });
        await updateDiscount({ data });
        setLoading({ show: false, message: "" });

    }

    const handleChange = (e) => {
        setDiscount((oldDiscount) => {
            return {
                ...oldDiscount,
                [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
            }
        });
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl text-gray-500 mb-4">
                Editar descuento
            </h2>

            <div className="bg-white p-8 rounded">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h1 className="text-xl text-gray-500 my-5">
                        Informacion del descuento
                    </h1>

                    <div className="flex items-center space-x-2">
                        <div className="w-1/2 space-y-2">
                            <label htmlFor="name">Nombre del descuento:</label>
                            <div>
                                <CustomInput
                                    id="name"
                                    name="name"
                                    value={discount.name}
                                    onChange={handleChange}
                                    className="w-2/3"
                                    placeholder="Nombre del descuento"
                                />
                                {
                                    errorsForm.name &&
                                    <p className="text-red-500">{errorsForm.name}</p>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 flex items-center">

                        <div className="w-1/2">
                            <label htmlFor="description">Descripcion del descuento:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={discount.description}
                                onChange={handleChange}
                                placeholder="Descripcion del descuento"
                                className="w-full rounded bg-gray-100 border-none transition duration-500 focus:bg-white focus:ring-white focus:shadow-xl"
                                rows={4}
                            />
                            {
                                errorsForm.description &&
                                <p className="text-red-500">{errorsForm.description}</p>
                            }
                        </div>
                        <div className="w-1/2">
                            <ImgUploadInput className="mt-4 w-2/3 h-48" previewImage={imgPreview} description="Imagen del descuento" change={handleChange} name="image" />
                            {
                                errorsForm.image &&
                                <p className="text-red-500 text-center">{errorsForm.image}</p>
                            }
                        </div>
                    </div>

                    <div className="text-right">
                        <Button type="submit">
                            Editar Descuento
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default DiscountsEdit;