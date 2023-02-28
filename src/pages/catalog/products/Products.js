import { IoAdd, IoFastFoodOutline } from "react-icons/io5";
import ProductsTable from "../../../components/ProductsTable";
import { useState } from "react";
import Pagination from "../../../components/Pagination";
import useProducts from "../../../hooks/useProducts";
import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../../components/Button";
import CustomModal from "../../../components/CustomModal";
import useAxios from "../../../hooks/useAxios";

const Products = () => {

    const { setLoading, setCustomAlert, user } = useAuth();

    const [open, setOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [filters, setFilters] = useState({ id: "", name: "", reference: "", minQuantity: "", maxQuantity: "", minPrice: "", maxPrice: "", categoryName: "", page: 1, storeId: user?.storeId });

    const [{ products, error, numberOfPages, total, loading }, getProducts] = useProducts({
        params: {
            ...filters
        }
    });

    const [{ data: deleteData, error: deleteError, loading: deleteLoading }, deleteProduct] = useAxios({ url: `/products/${productToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading({ show: loading, message: "Cargando productos" })
    }, [loading]);

    useEffect(() => {
        if (deleteData !== undefined) {
            setCustomAlert({ show: true, message: "El producto fue eliminado exitosamente.", severity: "success" });
            getProducts();
            setProductToDelete(null);
        }
    }, [deleteData])

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }

        if (deleteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
            setProductToDelete(null);
        }
    }, [error, deleteError]);

    useEffect(() => {
        getProducts({
            params: {
                ...filters
            }
        })
    }, [filters.page])

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

    const handleDelete = (product) => {
        setProductToDelete(product);
        setOpen(true);
    }

    const handleConfirmDelete = async (e) => {
        setOpen(false);

        if (e) {
            setLoading({ show: true, message: "Eliminando producto" });
            await deleteProduct();
            setLoading({ show: false, message: "" });
        }
    }



    return (
        <div className="p-4">
            <div className="flex items-center text-3xl text-gray-500 mb-8">
                <IoFastFoodOutline />
                <p>Productos</p>
            </div>

            <div className="text-right">
                <Button className="my-4" to={"/catalog/products/create"}>
                    <IoAdd className="text-2xl" />
                    Añadir Nuevo
                </Button>
            </div>

            <ProductsTable findData={() => { getProducts() }} filters={filters} onFiltersChange={handleChange} onDelete={handleDelete} products={products.length > 0 ? products : []} className="bg-white mb-4" />

            <Pagination pages={numberOfPages} activePage={filters.page} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />

            <CustomModal message={`Desea eliminar el producto ${productToDelete?.name}`} open={open} onClose={handleConfirmDelete} />
        </div>
    )
}

export default Products;