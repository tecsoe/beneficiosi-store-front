import { useEffect } from "react";
import { useState } from "react";
import { IoBookmarkOutline, IoStar, IoStatsChartOutline, IoPricetags } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import CategoriesTable from "../../../components/CategoriesTable";
import CustomModal from "../../../components/CustomModal";
import Pagination from "../../../components/Pagination";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";
import useCategoriesStores from "../../../hooks/useCategoriesStores";

const Categories = () => {

    const location = useLocation();

    const { setLoading, setCustomAlert, user } = useAuth();
    const [deleteCategory, setDeleteCategory] = useState(null);
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({ id: "", name: "", storeId: user?.storeId, parentOnly: true, page: 1, parentId: null });
    const [name, setName] = useState("Categories");

    const [{ data, error: deleteError }, deleteSelectedCategory] = useAxios({ url: `/stores/categories/${deleteCategory?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    const [{ categoriesStores, error, loading, numberOfPages }, getStoresCategories] = useCategoriesStores({ params: filters });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        const name = params.get('name');
        setName(name ? name : "Categorias");

        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                parentOnly: id ? false : true,
                parentId: id ? id : null
            }
        })

    }, [location]);

    useEffect(() => {
        setLoading({ show: loading, message: "Obteniendo datos" });
    }, [loading]);

    useEffect(() => {
        if (data !== undefined) {
            getStoresCategories().then(() => {
                setCustomAlert({ show: true, message: "La categoria ha sido eliminada exitosamente.", severity: "success" });
            })
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }

        if (deleteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
        }
    }, [error, deleteError]);

    useEffect(() => {
        getStoresCategories({
            params: {
                ...filters
            }
        });
    }, [filters])

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            if (e.target.name !== "page") {
                return {
                    ...oldFilters,
                    [e.target.name]: e.target.value,
                    page: 1
                }
            }
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
            }
        })
    }

    const handleDelete = (category) => {
        setDeleteCategory(category);
        setOpen(true);
    }

    const handleConfirmDelete = async (e) => {
        if (e) {
            setOpen(false);
            setLoading({ show: true, message: "Eliminando categoria" });
            await deleteSelectedCategory();
            setLoading({ show: false, message: "" });
        } else {
            setOpen(false)
            setDeleteCategory(null);
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoPricetags />
                <p>{name ? name : "Categorias"}</p>
            </div>

            <div className="bg-white rounded p-4">
                <div className="flex">
                    <div className="w-1/3">
                        <div className="flex items-center mb-4 text-main text-xl">
                            <IoBookmarkOutline className="mr-4" />
                            <h1>Categorias Vacias</h1>
                        </div>
                        <p className="text-4xl text-gray-400">5</p>
                    </div>
                    <div className="w-1/3">
                        <div className="flex items-center mb-4 text-yellow-500 text-xl">
                            <IoStar className="mr-4" />
                            <h1>Mejor categoria</h1>
                        </div>
                        <p className="text-4xl text-gray-400">Carnes</p>
                    </div>
                    <div className="w-1/3">
                        <div className="flex items-center mb-4 text-green-500 text-xl">
                            <IoStatsChartOutline className="mr-4" />
                            <h1>Promedio de productos por categoria</h1>
                        </div>
                        <p className="text-gray-400 text-4xl">30</p>
                    </div>
                </div>
            </div>

            <div className="text-right mt-8">
                <Link to={"/catalog/categories/create"} className="px-5 py-2 bg-main text-white rounded transition duration-500 hover:text-main hover:bg-white hover:shadow-xl">
                    Añadir Categoria
                </Link>
            </div>

            <CategoriesTable onDelete={handleDelete} filtersValues={filters} onFiltersChange={handleChange} categories={categoriesStores} className="bg-white mt-12" />

            <Pagination pages={numberOfPages} activePage={filters.page} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />

            <CustomModal message={`Desea eliminar la categoria ${deleteCategory?.name}`} open={open} onClose={handleConfirmDelete} />
        </div>
    )
}

export default Categories;