import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useCategoriesStores from "../../../hooks/useCategoriesStores";
import { useState } from "react";
import Button from '../../../components/Button';
import useAxios from "../../../hooks/useAxios";
import CustomInput from "../../../components/CustomInput";
import { useHistory } from "react-router-dom";
import RenderListStoresCategories from "../../../components/RenderListStoresCategories";

const CategoriesCreate = () => {

    const { setLoading, setCustomAlert, user } = useAuth();

    const history = useHistory();

    const [categoryData, setCategoryData] = useState({ name: "", parentId: [] })

    const [filters, setFilters] = useState({ name: "" })

    const [{ categoriesStores, error, loading, total, size, numberOfPages }, getCategories] = useCategoriesStores({ params: { parentOnly: true, storeId: user?.storeId } });

    const [{ data: createData, error: createError }, createCategory] = useAxios({ url: "/stores/categories", method: "POST", }, { manual: true, useCache: false });

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        setLoading({ show: loading, message: "Obteniendo datos" })
    }, [loading])

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
        }

        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError.response?.status === 400 ? createError.response?.data.message[0] : createError.response?.data.message}.`, severity: "error" });
        }
    }, [error, createError]);

    useEffect(() => {
        if (createData) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `La categoria se ha creado exitosamente.`, severity: "success" });
            setCategoryData({
                name: "",
                parentIds: []
            });
            history.push('/catalog/categories');
        }
    }, [createData]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading({ show: true, message: "Creando Categoria" });
        await createCategory({
            data: {
                ...categoryData,
                parentId: categoryData.parentId[0]
            }
        });
        setLoading({ show: false, message: "" });
    }

    const handleChange = (e) => {
        if (e.target.value === categoryData.parentId[0] && e.target.type === "checkbox") {
            setCategoryData((oldCategoryData) => {
                return {
                    ...oldCategoryData,
                    [e.target.name]: []
                }
            })
        } else {
            setCategoryData((oldCategoryData) => {
                return {
                    ...oldCategoryData,
                    [e.target.name]: e.target.type === "checkbox" ? [e.target.value] : e.target.value
                }
            })
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-gray-500 text-2xl mb-6">
                Agregar Categoria
            </h1>

            <div className="bg-white p-12 rounded">
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <h1 className="mb-2 text-2xl">
                            Nombre de la categoria
                        </h1>
                        <CustomInput
                            name="name"
                            onChange={handleChange}
                            value={categoryData.name}
                            type="text"
                            placeholder='ejem... "Bebidas"' />
                    </div>

                    <div className="mt-5">
                        <h1 className="text-2xl">
                            Seleccionar la categoria padre
                        </h1>
                        <RenderListStoresCategories name="parentId" value={categoryData.parentId} onChange={handleChange} categories={categoriesStores} className="mt-4 w-1/4" />
                    </div>
                    <div className="text-right">
                        <Button color="main" className="mt-5" type="submit">
                            Aceptar
                        </Button>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default CategoriesCreate;