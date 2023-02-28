import { IoCheckbox, IoSadOutline } from "react-icons/io5";
import Button from "../Button";
import CustomInput from "../CustomInput";
import RenderListStoresCategories from "../RenderListStoresCategories";

const SecondStep = ({ show, onSubmit, goBack, data, values, onChange, loadingTags, findTags, findTagsFilterValue }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(values)
    }

    return (
        <div hidden={!show} className="p-4">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <h1 className="text-xl text-gray-500">Selecciona las Categorias de tu <b>Tienda</b></h1>
                    {
                        data.categoriesStores.length > 0 ?
                            <RenderListStoresCategories name="categoryIds" value={values.categoryIds} onChange={onChange} categories={data.categoriesStores} className="mt-4 w-1/4" />
                            :
                            <div className="text-center text-red-500 text-xl">
                                <IoSadOutline className="m-auto text-4xl" />
                                <p>No se Encontraron categorias en tu tienda.</p>
                                <Button target="_blank" type="button" to={"/catalog/categories/create"}>
                                    Cargar Categoria
                                </Button>
                            </div>
                    }
                </div>

                <div className="mt-8">
                    <h1 className="text-xl text-gray-500 mb-4">Selecciona las etiquetas de <b>BeneficioSi</b></h1>
                    <CustomInput onChange={findTags} value={findTagsFilterValue} className="my-2" placeholder='Ejemplo... "Refrescos"' />
                    <div className="h-64 overflow-auto">
                        {
                            loadingTags ?
                                <div>
                                    Cargando Etiquetas...
                                </div>
                                :
                                data?.tags?.length > 0 ?
                                    data?.tags?.map((tag, i) => {
                                        return (
                                            <div key={i} onClick={() => { onChange({ target: { name: "tagIds", value: tag.id, type: "checkbox" } }) }} className="rounded border-b border-main my-2 p-2 flex items-center space-x-4 transition duration-500 cursor-pointer hover:shadow-xl hover:border-none">
                                                {
                                                    values.tagIds.includes(tag.id) ?
                                                        <IoCheckbox className="text-green-500" />
                                                        :
                                                        null
                                                }
                                                <p>{tag.name}</p>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className="text-red-500">
                                        No se encontraron etiquetas.
                                    </div>
                        }
                    </div>
                </div>
                <div className="text-right space-x-4">
                    <Button type="button" onClick={goBack}>
                        Volver atras
                    </Button>
                    <Button>
                        Siguiente Paso
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default SecondStep;