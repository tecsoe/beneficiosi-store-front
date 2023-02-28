import { useEffect, useState } from "react";
import { IoHelpCircleSharp, IoTrashSharp } from "react-icons/io5";
import { isRequired, validate } from "../../helpers/formsValidations";
import Button from "../Button";
import CheapHelp from "../CheapHelp";
import CustomInput from "../CustomInput";
import { FiTruck, FiVideo, FiExternalLink } from "react-icons/fi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import useUploadPlugin from "../../hooks/useUploadPlugin";
import AddProductVideoModal from "./AddProductVideoModal";

const FirstStep = ({ show, onSubmit, onChange, values, data, onAddVideo, onRemoveVideo }) => {
  const {uploadPlugin} = useUploadPlugin();

  const [showVideosModal, setShowVideosModal] = useState(false);
  
  const [errorsForm, setErrorsForm] = useState({
    name: null,
    height: null,
    width: null,
    length: null,
    weight: null,
    deliveryMethodTypeCodes: null,
  });  

  useEffect(() => {
    setErrorsForm({
      name: validate(values.name, [
        { validator: isRequired, errorMessage: "El nombre es obligatorio." },
      ]),
      height: validate(values.height, [
        { validator: isRequired, errorMessage: "La altura es obligatoria." },
      ]),
      width: validate(values.width, [
        { validator: isRequired, errorMessage: "El ancho es obligatorio." },
      ]),
      length: validate(values.length, [
        { validator: isRequired, errorMessage: "La longitud es obligatoria." },
      ]),
      weight: validate(values.weight, [
        { validator: isRequired, errorMessage: "El peso es obligatorio." },
      ]),
      deliveryMethodTypeCodes:
        values?.deliveryMethodTypeCodes?.length > 0
          ? null
          : "El tipo de delivery es obligatorio.",
    });
  }, [values]);

  const handleProductVideoModalClose = (data) => {
    if (data) {
      onAddVideo(data);
    }

    setShowVideosModal(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let errors in errorsForm) {
      if (errorsForm[errors] != null) {
        alert(errorsForm[errors]);
        return;
      }
    }
    onSubmit(values);
  };

  return (
    <div hidden={!show}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h1>Nombre</h1>
          <CustomInput
            autoFocus
            name="name"
            value={values.name}
            placeholder="Nombre"
            onChange={onChange}
          />
          {errorsForm.name ? (
            <p className="text-red-500">{errorsForm.name}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between space-x-8 mb-4">
          <div className="w-1/4">
            <h1 className="relative flex items-center">
              Referencia
              <CheapHelp
                className="relative mx-2"
                icon={<IoHelpCircleSharp />}
                message={"Referencia interna de su producto (opcional)."}
              />
            </h1>
            <CustomInput
              placeholder="Referencia..."
              name="reference"
              onChange={onChange}
              value={values.reference}
            />
          </div>
          <div className="w-1/4">
            <h1 className="relative flex items-center">
              Descripción corta
              <CheapHelp
                className="relative mx-2"
                icon={<IoHelpCircleSharp />}
                message={"Descripción corta (opcional)."}
              />
            </h1>
            <CustomInput
              placeholder="Descripción corta..."
              name="shortDescription"
              onChange={onChange}
              value={values.shortDescription}
            />
          </div>
          <div className="w-1/4">
            <h1 className="relative flex items-center">
              Marca
              <CheapHelp
                className="relative mx-2"
                icon={<IoHelpCircleSharp />}
                message={"Marca del producto (opcional)."}
              />
            </h1>
            <select
              name="brandId"
              onChange={onChange}
              value={values.brandId}
              className="capitalize w-full border-none rounded-xl bg-gray-200 transition duration-500 focus:bg-white focus:shadow-xl focus:ring-white"
            >
              <option value="">Seleccione una</option>
              {data?.brands?.map((brand, i) => {
                return (
                  <option key={i} className="capitalize" value={brand.id}>
                    {brand.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="w-1/4">
            <h1 className="relative flex items-center">
              Cantidad
              <CheapHelp
                className="relative mx-2"
                icon={<IoHelpCircleSharp />}
                message={"Cantidad del producto minimo 1"}
              />
            </h1>
            <CustomInput
              min="0"
              type="number"
              name="quantity"
              onChange={onChange}
              placeholder="Cantidad..."
              value={values.quantity}
            />
          </div>
        </div>

        <div className="mb-4">
          <h1>Descripción</h1>
          <CKEditor
            config={{
              toolbar: [
                "heading", "|",
                "bold", "italic", "link", "bulletedList", "numberedList", "|",
                "outdent", "indent", "|",
                "imageUpload", "blockQuote", "insertTable", "undo", "redo"
              ],
              extraPlugins: [uploadPlugin],
            }}
            editor={ClassicEditor}
            data={values.description || ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              onChange({
                target: { name: "description", value: data, type: "text" },
              });              
            }}
          />          
        </div>

        <div className="my-8">
          <h2 className="text-2xl flex items-center text-gray-500 font-bold mb-2">
            <FiVideo className="mr-2" />
            Videos
          </h2>

          <div className="space-y-3">
            {values.videos?.map((video, i) => <div key={i} className="flex">
              <a href={video.url} title={video.url} target="_blank" className="flex items-center space-x-2 w-full">
                <span>{video.name}</span>
                <FiExternalLink className="inline-block" />
              </a>
              <Button type="button" onClick={() => { onRemoveVideo(i) }}>
                <IoTrashSharp />
              </Button>
            </div>)}
          </div>
          
          <div className="my-6 text-right border-b pb-4">
            <Button type="button" onClick={() => setShowVideosModal(true)}>
              Agregar Video
            </Button>
          </div>
        </div>

        <div className="my-8">
          <h1 className="text-2xl flex items-center text-gray-500 font-bold mb-2">
            <FiTruck className="mr-2" />
            Metodos de Envio
          </h1>
          <div className="flex items-center space-x-6 w-full my-4">
            {data?.deliveryTypes?.map((deliveryType, i) => {
              return (
                <div
                  key={i}
                  className="w-1/3 flex items-center space-x-4 relative"
                >
                  <input
                    className="text-main focus:ring-main cursor-pointer"
                    type="checkbox"
                    name="deliveryMethodTypeCodes"
                    id={`deliveryMethodTypeCodes-${deliveryType.code}`}
                    value={deliveryType.code}
                    onChange={onChange}
                    checked={values.deliveryMethodTypeCodes.includes(
                      deliveryType.code
                    )}
                  />
                  <label
                    htmlFor={`deliveryMethodTypeCodes-${deliveryType.code}`}
                    className="text-xl relative font-bold text-gray-500 cursor-pointer capitalize"
                  >
                    {deliveryType.name}
                  </label>
                  <CheapHelp
                    className="relative"
                    icon={<IoHelpCircleSharp />}
                    message={
                      deliveryType.code === "dmt-001"
                        ? "El costo se aplicara por las dimesiones del producto."
                        : "El costo se aplicara por la cantidad de productos."
                    }
                  />
                </div>
              );
            })}
          </div>
          {values.deliveryMethodTypeCodes.includes("dmt-001") ? (
            <>
              <h1 className="text-center text-gray-500 font-bold mb-5 flex items-center w-full justify-center">
                Agregue las dimensiones
                <CheapHelp
                  className="relative mx-2"
                  icon={<IoHelpCircleSharp />}
                  message={
                    "Indique las dimensiones para el calculo del costo del envio."
                  }
                />
              </h1>
              <div className="flex items-center justify-between space-x-8 mb-4 animate__animated animate__fadeInUp">
                <div className="w-1/4">
                  <h1>
                    Ancho en metros <b>(m)</b>
                  </h1>
                  <CustomInput
                    min="0"
                    type="number"
                    placeholder='Ancho Ej... "0,5"'
                    name="width"
                    onChange={onChange}
                    value={values.width}
                  />
                  {errorsForm.width ? (
                    <p className="text-red-500">{errorsForm.width}</p>
                  ) : null}
                </div>
                <div className="w-1/4">
                  <h1>
                    Altura en metros <b>(m)</b>
                  </h1>
                  <CustomInput
                    min="0"
                    type="number"
                    placeholder='Altura Ej... "1"'
                    name="height"
                    onChange={onChange}
                    value={values.height}
                  />
                  {errorsForm.height ? (
                    <p className="text-red-500">{errorsForm.height}</p>
                  ) : null}
                </div>
                <div className="w-1/4">
                  <h1>
                    Longitud en metros cúbicos <b>(m3)</b>
                  </h1>
                  <CustomInput
                    min="0"
                    type="number"
                    placeholder='Longitud Ej... "0,025"'
                    name="length"
                    onChange={onChange}
                    value={values.length}
                  />
                  {errorsForm.length ? (
                    <p className="text-red-500">{errorsForm.length}</p>
                  ) : null}
                </div>
                <div className="w-1/4">
                  <h1>
                    Peso en Kilogramos <b>(Kg)</b>
                  </h1>
                  <CustomInput
                    type="number"
                    min="0"
                    name="weight"
                    onChange={onChange}
                    placeholder='Peso Ej... "20"'
                    value={values.weight}
                  />
                  {errorsForm.weight ? (
                    <p className="text-red-500">{errorsForm.weight}</p>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="text-right">
          <Button>Siguiente Paso</Button>
        </div>
      </form>

      <AddProductVideoModal show={showVideosModal} onClose={handleProductVideoModalClose} />
    </div>
  );
};

export default FirstStep;
