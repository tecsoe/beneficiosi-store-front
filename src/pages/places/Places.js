import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import CustomModal from "../../components/CustomModal";
import Pagination from "../../components/Pagination";
import PlacesTable from "../../components/PlacesTable";
import { useAuth } from "../../contexts/AuthContext";
import usePlaces from "../../hooks/usePlaces";

const Places = () => {

    const { setLoading, setCustomAlert, user } = useAuth();

    const [open, setOpen] = useState(false);

    const [placeToDelete, setPlaceToDelete] = useState(null);

    const [filters, setFilters] = useState({ id: "", name: "", capacity: "", page: 1, storeId: user?.storeId });

    const [{ places, error: placesError, loading: placesLoading, numberOfPages }, getPlaces] = usePlaces({
        params: {
            ...filters
        }
    });

    const [{ data: deleteData, error: deleteError }, deletePlace] = useAxios({ url: `/places/${placeToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    useEffect(() => {
        if (deleteData !== undefined) {
            setCustomAlert({ show: true, message: "Se ha eliminado exitosamente.", severity: "success" });
            getPlaces();
            setPlaceToDelete(null);
        }
    }, [deleteData])

    useEffect(() => {
        setLoading({ show: placesLoading, message: 'Cargando' });
    }, [placesLoading]);

    useEffect(() => {
        if (placesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${placesError?.response?.status === 400 ? placesError?.response?.data.message[0] : placesError?.response?.data.message}.`, severity: "error" });
        }

        if (deleteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
            setPlaceToDelete(null);
        }
    }, [placesError, deleteError]);

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleDelete = (place) => {
        setPlaceToDelete(place);
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
            <h2 className="text-xl text-gray-500">
                Lugares o Salas
            </h2>

            <div className="text-right mb-4">
                <Button to={`/places/create`}>
                    Añadir nuevo
                </Button>
            </div>


            <PlacesTable onDelete={handleDelete} className="bg-white" filters={filters} onFiltersChange={handleChange} places={places} />

            <Pagination pages={numberOfPages} activePage={filters.page} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />

            <CustomModal message={`Desea eliminar "${placeToDelete?.name}"`} open={open} onClose={handleConfirmDelete} />
        </div>
    )
}

export default Places;