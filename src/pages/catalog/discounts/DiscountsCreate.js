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
import { useHistory } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";

const DiscountsCreate = () => {

    const history = useHistory();
    const { setLoading, setCustomAlert } = useAuth();

    const [discount, setDiscount] = useState({
        name: "",
        description: "",
        discountTypeCode: "",
        image: null,
        value: 0,
        cardsIds: [],
        cardsIssuersIds: [],
        from: "",
        until: "",
    });

    const [errorsForm, setErrorsForm] = useState({
        name: null,
        description: null,
        discountTypeCode: null,
        image: null,
        value: null,
        cardsIds: null,
        cardsIssuersIds: null,
        from: null,
        until: null
    });

    const [{ discountsTypes, error: discountTypesError, loading: discountTypesLoading }, getDiscountsTypes] = useDiscountsTypes();

    const [{ data: createData, error: createError, loading: createLoading }, createDiscount] = useAxios({ url: "/discounts", method: "POST" }, { manual: true, useCache: false });

    useEffect(() => {
        if (createData) {
            setCustomAlert?.({ show: true, message: "El descuento ha sido creado exitosamente.", severity: "success" });
            history.push("/catalog/discounts");
        }
    }, [createData]);

    useEffect(() => {
        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }
    }, [createError]);

    useEffect(() => {
        setErrorsForm({
            name: validate(discount.name, [
                { validator: isRequired, errorMessage: "El nombre es obligatorio." },
            ]),
            description: validate(discount.description, [
                { validator: isRequired, errorMessage: "La descripción es obligatoria." },
            ]),
            discountTypeCode: validate(discount.discountTypeCode, [
                { validator: isRequired, errorMessage: "El tipo de descuento es obligatorio." },
            ]),
            image: validate(discount.image, [
                { validator: isRequired, errorMessage: "La imagen es obligatoria." },
            ]),
            value: validate(discount.value, [
                { validator: isRequired, errorMessage: "El porcentaje es obligatorio." },
            ]),
            cardsIds:
                discount.discountTypeCode === "dit-002" ?
                    validate(discount.cardsIds, [
                        { validator: isRequired, errorMessage: "Debe seleccionar al menos una tarjeta." },
                    ])
                    :
                    null,
            cardsIssuersIds:
                discount.discountTypeCode === "dit-001" ?
                    validate(discount.cardsIssuersIds, [
                        { validator: isRequired, errorMessage: "Debe seleccionar al menos un banco." },
                    ])
                    :
                    null,
            from: validate(discount.from, [
                { validator: isRequired, errorMessage: "La fecha inicial es obligatoria." },
            ]),
            until: validate(discount.until, [
                { validator: isRequired, errorMessage: "La fecha final es obligatoria." },
            ]),
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

        const { cardsIds, cardsIssuersIds, image, from, until, ...rest } = discount;

        for (let value in rest) {
            data.append(value, rest[value]);
        }

        data.append("image", image, image.name);
        data.append("from", format(new Date(from), "yyyy-MM-dd H:mm:ss"));
        data.append("until", format(new Date(until), "yyyy-MM-dd H:mm:ss"));

        if (rest.discountTypeCode === "dit-001") {
            cardsIssuersIds.forEach((cardIssuerId, i) => {
                data.append(`cardIssuerIds[${i}]`, cardIssuerId)
            });
        }

        if (rest.discountTypeCode === "dit-002") {
            cardsIds.forEach((cardId, i) => {
                data.append(`cardIds[${i}]`, cardId)
            });
        }

        setLoading({ show: true, message: "Creando descuento." });
        await createDiscount({ data });
        setLoading({ show: false, message: "" });

    }

    const handleChange = (e) => {

        if (e.target.name === "cardsIds" || e.target.name === "cardsIssuersIds") {
            const value = discount[e.target.name].includes(Number(e.target.value));
            if (value) {
                const newValues = discount[e.target.name].filter(n => n !== Number(e.target.value));
                console.log(newValues);
                setDiscount((oldDiscount) => {
                    return {
                        ...oldDiscount,
                        [e.target.name]: newValues,
                    }
                });
            } else {
                setDiscount((oldDiscount) => {
                    return {
                        ...oldDiscount,
                        [e.target.name]: [Number(e.target.value), ...oldDiscount[e.target.name]],
                    }
                });
            }
            return;
        }

        setDiscount((oldDiscount) => {
            return {
                ...oldDiscount,
                [e.target.name]: e.target.type === "checkbox" ? oldDiscount[e.target.name] === e.target.value ? "" : e.target.value : e.target.type === "file" ? e.target.files[0] : e.target.value
            }
        });
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl text-gray-500 mb-4">
                Crear descuento
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
                        <div className="w-1/2 space-y-2">
                            <label
                                htmlFor="value"
                            >
                                Por favor ingrese el Porcentaje (%) del descuento
                            </label>
                            <div>
                                <CustomInput
                                    id="value"
                                    name="value"
                                    value={discount.value}
                                    onChange={handleChange}
                                    placeholder={"porcentaje 0% - 100%"}
                                    type="number"
                                    className="w-1/3" />
                                {
                                    errorsForm.value &&
                                    <p className="text-red-500">{errorsForm.value}</p>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="w-1/2 space-y-2">
                            <label htmlFor="from">Fecha inicial:</label>
                            <div>
                                <DateTimePickerComponent
                                    id="from"
                                    name="from"
                                    value={discount?.from}
                                    onChange={handleChange}
                                    format="dd/MM/yyyy"
                                    allowEdit={false}
                                    floatLabelType="auto"
                                    openOnFocus={true} />
                                {
                                    errorsForm.from &&
                                    <p className="text-red-500">{errorsForm.from}</p>
                                }
                            </div>
                        </div>
                        <div className="w-1/2 space-y-2">
                            <label htmlFor="until">Fecha Final:</label>
                            <div>
                                <DateTimePickerComponent
                                    id="until"
                                    name="until"
                                    value={discount?.until}
                                    onChange={handleChange}
                                    format="dd/MM/yyyy"
                                    allowEdit={false}
                                    floatLabelType="auto"
                                    openOnFocus={true} />
                                {
                                    errorsForm.until &&
                                    <p className="text-red-500">{errorsForm.until}</p>
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
                            <ImgUploadInput className="mt-4 w-2/3 h-48" description="Imagen del descuento" change={handleChange} name="image" />
                            {
                                errorsForm.image &&
                                <p className="text-red-500 text-center">{errorsForm.image}</p>
                            }
                        </div>
                    </div>

                    <div className="mt-4 py-4 border-t">
                        <h1 className="text-3xl text-center font-bold text-gray-500 my-8">
                            Condiciones del descuento:
                        </h1>

                        <div className="flex mt-4">
                            <div className="w-1/3 space-y-2">
                                <h2 className="text-xl text-gray-500">Aplicar por:</h2>
                                {
                                    discountTypesError &&
                                    <div className="text-center text-red-500">
                                        <p>Ha courrido un error</p>
                                        <Button onClick={() => { getDiscountsTypes() }}>
                                            Reintentar
                                        </Button>
                                    </div>
                                }
                                {
                                    discountTypesLoading ?
                                        "Obteniendo tipos de descuento..."
                                        :
                                        discountsTypes.map((discountType, i) => {
                                            return (
                                                <div key={i} className="space-x-2">
                                                    <input
                                                        id={`discountType-${i}`}
                                                        name="discountTypeCode"
                                                        value={discountType?.code}
                                                        onChange={handleChange}
                                                        type="checkbox"
                                                        checked={discount.discountTypeCode === discountType?.code}
                                                        className="text-main focus:ring-main cursor-pointer"
                                                    />
                                                    <label htmlFor={`discountType-${i}`} className="cursor-pointer capitalize"> {discountType?.name}</label>
                                                </div>
                                            )
                                        })
                                }
                            </div>
                            <div className="w-2/3">
                                {
                                    discount.discountTypeCode === "dit-002" &&
                                    <div>
                                        <h3 className="text-xl text-gray-500 font-bold">Por favor seleccione las tarjeta.</h3>
                                        <CardsList values={discount.cardsIds} name="cardsIds" onChange={handleChange} />
                                    </div>
                                }

                                {
                                    discount.discountTypeCode === "dit-001" &&
                                    <div>
                                        <h3 className="text-xl text-gray-500 font-bold">Por favor seleccione los Bancos.</h3>
                                        <CardsIssuersList values={discount.cardsIssuersIds} name="cardsIssuersIds" onChange={handleChange} />
                                    </div>
                                }

                                {
                                    discount.discountTypeCode === "dit-003" &&
                                    <div className="text-center font-bold text-gray-500">
                                        El descuento sera aplicado a todas las compras que se realicen dentro de la tienda.
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <Button type="submit">
                            Crear Descuento
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default DiscountsCreate;