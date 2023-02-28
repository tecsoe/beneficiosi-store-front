import { useEffect, useState } from "react";

import { IoHelpCircleSharp, IoImagesSharp, IoLogoUsd } from "react-icons/io5";
import { isRequired, validate } from "../../helpers/formsValidations";
import Button from "../Button";
import CheapHelp from "../CheapHelp";
import CustomInput from "../CustomInput";
import ImgUploadInput from "../ImgUploadInput";

const FourStep = ({ show, onSubmit, goBack, values, data, onChange, isEdit }) => {

    const [errorsForm, setErrorsForm] = useState({
        portrait: null
    });

    useEffect(() => {
        if (!isEdit) {
            setErrorsForm({
                portrait: validate(values.images[0], [
                    { validator: isRequired, errorMessage: "La foto de portada es obligatoria." },
                ])
            })
        }
    }, [values]);

    const handleSubmit = (e) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors] != null) {
                alert(errorsForm[errors]);
                return;
            }
        }

        onSubmit();
    }

    const handleImagesChange = (e, index) => {
        if (data?.previewImages?.[index]) {
            return onChange({ target: { ...e.target, index: index, id: data?.previewImages?.[index].id } })
        }
        onChange({ target: { ...e.target, index: index } })
    }

    return (
        <div hidden={!show} className="px-8">
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <h1 className="text-2xl flex items-center text-gray-500 font-bold">
                        <IoImagesSharp className="mr-2" />
                        Imagenes
                    </h1>

                    <div className="flex items-center space-x-8 mt-6">
                        <div className="w-1/2 flex space-x-4 items-end">
                            <div className="w-1/2">
                                <h1 className="text-center text-xl text-gray-500 font-bold">Foto de portada</h1>
                                <ImgUploadInput previewImage={data?.previewImages?.[0].url} className="h-72" change={(e) => { handleImagesChange(e, 0) }} name="images" deleteButton={!isEdit} />
                                {
                                    errorsForm.portrait ?
                                        <div className="text-red-500">
                                            {errorsForm.portrait}
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            <div className="w-1/2">
                                <ImgUploadInput previewImage={data?.previewImages?.[1]?.url} className="h-72" change={(e) => { handleImagesChange(e, 1) }} name="images" deleteButton />
                            </div>
                        </div>

                        <div className="w-1/2 flex flex-wrap space-y-8">
                            <div className="flex w-full space-x-12">
                                <ImgUploadInput previewImage={data?.previewImages?.[2]?.url} change={(e) => { handleImagesChange(e, 2) }} name="images" deleteButton description="Subir foto" className="w-1/3 h-28" />
                                <ImgUploadInput previewImage={data?.previewImages?.[3].url} change={(e) => { handleImagesChange(e, 3) }} name="images" deleteButton description="Subir foto" className="w-1/3 h-28" />
                                <ImgUploadInput previewImage={data?.previewImages?.[4].url} change={(e) => { handleImagesChange(e, 4) }} name="images" deleteButton description="Subir foto" className="w-1/3 h-28" />
                            </div>
                            <div className="flex w-full space-x-12">
                                <ImgUploadInput previewImage={data?.previewImages?.[5].url} change={(e) => { handleImagesChange(e, 5) }} name="images" deleteButton description="Subir foto" className="w-1/3 h-28" />
                                <ImgUploadInput previewImage={data?.previewImages?.[6].url} change={(e) => { handleImagesChange(e, 6) }} name="images" deleteButton description="Subir foto" className="w-1/3 h-28" />
                                <ImgUploadInput previewImage={data?.previewImages?.[7].url} change={(e) => { handleImagesChange(e, 7) }} name="images" deleteButton description="Subir foto" className="w-1/3 h-28" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-8">
                    <h1 className="text-2xl flex items-center text-gray-500 font-bold mb-2 relative">
                        <IoLogoUsd className="mr-2" />
                        Precio
                        <CheapHelp className="relative" icon={<IoHelpCircleSharp />} message="Precio base del producto sin las caracteristicas." />
                    </h1>

                    <CustomInput onChange={onChange} name="price" type="number" placeholder="Precio..." value={values.price} />
                </div>

                <div className="my-8 text-right space-x-4">
                    <Button onClick={goBack} type="button">
                        volver atras
                    </Button>
                    <Button>
                        {isEdit ?
                            "Guardar Cambios"
                            :
                            "Crear Producto"
                        }

                    </Button>
                </div>
            </form>
        </div>
    )
}

export default FourStep;