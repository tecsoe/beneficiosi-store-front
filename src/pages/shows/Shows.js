import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import CustomModal from "../../components/CustomModal";
import Pagination from "../../components/Pagination";
import ShowsTable from "../../components/ShowsTable";
import { useAuth } from "../../contexts/AuthContext";
import useProducts from "../../hooks/useProducts";

const Shows = () => {

    const { setLoading, setCustomAlert, user } = useAuth();

    const [open, setOpen] = useState(false);

    const [productToDelete, setProductToDelete] = useState(null);

    const [filters, setFilters] = useState({ id: "", name: "", capacity: "", page: 1, storeId: user?.storeId });

    const [{ products, error, numberOfPages, total, loading }, getProducts] = useProducts({
        params: {
            ...filters
        }
    });

    const [{ data: deleteData, error: deleteError }, deletePlace] = useAxios({ url: `/products/${productToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    useEffect(() => {
        if (deleteData !== undefined) {
            setCustomAlert({ show: true, message: "Se ha eliminado exitosamente.", severity: "success" });
            setProductToDelete(null);
        }
    }, [deleteData]);

    useEffect(() => {
        setLoading({ show: loading, message: 'Obteniendo información' })
    }, [loading])

    useEffect(() => {
        if (deleteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
            setProductToDelete(null);
        }
    }, [deleteError]);

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleDelete = (place) => {
        setProductToDelete(place);
        setOpen(true);
    }

    const handleConfirmDelete = async (e) => {
        setOpen(false);

        if (e) {
            setLoading({ show: true, message: "Eliminando sala o lugar" });
            await deletePlace();
            setLoading({ show: false, message: "" });
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-gray-500 text-2xl font-bold">Shows / Peliculas / Eventos</h2>

            <div className="text-right mb-4">
                <Button to={`/shows/create`}>
                    Añadir nuevo
                </Button>
            </div>

            <ShowsTable onDelete={handleDelete} shows={products} className="bg-white" filters={filters} onFiltersChange={handleChange} />

            <br />

            <Pagination pages={numberOfPages} activePage={filters.page} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />

            <CustomModal message={`Desea eliminar "${productToDelete?.name}"`} open={open} onClose={handleConfirmDelete} />
        </div>
    )
}

export default Shows;