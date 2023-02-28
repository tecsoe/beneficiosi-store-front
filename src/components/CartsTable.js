import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import format from "date-fns/format";
import { es } from "date-fns/locale";
import { IoEye } from "react-icons/io5";
import { Link } from "react-router-dom";
import CustomInput from "./CustomInput";


const CartsTable = ({ carts, className, values, onFiltersChange, onClearFilters }) => {

    return (
        <div className={className}>
            <div className="bg-main h-12"></div>
            <div className="flex w-full items-center font-bold">
                <div className="w-2/12 p-2">
                    <p>ID</p>
                    <CustomInput name="id" value={values.id} onChange={onFiltersChange} placeholder="id" />
                </div>
                <div className="w-2/12 p-2">
                    <p>Cliente</p>
                    <CustomInput name="clientName" value={values.clientName} onChange={onFiltersChange} placeholder="Nombre" />
                </div>
                <div className="w-3/12 space-y-4 p-2">
                    <p>Total</p>
                    <CustomInput name="minTotal" value={values.minTotal} onChange={onFiltersChange} placeholder="min" />
                    <CustomInput name="maxTotal" value={values.maxTotal} onChange={onFiltersChange} placeholder="max" />
                </div>
                <div className="w-2/12 space-y-4 p-2">
                    <p>Fecha</p>
                    <DateTimePickerComponent
                        placeholder="desde"
                        name="minDate"
                        value={values?.minDate}
                        onChange={onFiltersChange}
                        format="dd/MM/yyyy"
                        allowEdit={false}
                        floatLabelType="auto"
                        openOnFocus={true} />

                    <DateTimePickerComponent
                        placeholder="hasta"
                        name="maxDate"
                        value={values?.maxDate}
                        onChange={onFiltersChange}
                        format="dd/MM/yyyy"
                        allowEdit={false}
                        floatLabelType="auto"
                        openOnFocus={true} />
                </div>
                <div className="w-1/12 p-2">
                    <p>Procesado</p>
                    <select className="w-full" name="isProcessed" value={values.isProcessed} onChange={onFiltersChange}>
                        <option value="null">Seleccione una opcion</option>
                        <option value="true">Si</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div className="w-1/12 p-2">
                    <p>Compra directa</p>
                    <select className="w-full" name="isDirectPurchase" value={values.isDirectPurchase} onChange={onFiltersChange}>
                        <option value="null">Seleccione una opcion</option>
                        <option value="true">Si</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div className="w-1/12 p-2">
                    <button onClick={onClearFilters}>
                        Limpiar filtros
                    </button>
                </div>
            </div>
            <div className="w-full text-center">
                {
                    carts?.length > 0 ?
                        carts.map((cart, i) => <div className="flex bg-white my-4 p-6 items-center rounded-lg transition duration-300 transform hover:shadow-xl hover:-translate-y-2">
                            <div className="w-2/12">
                                {cart?.id}
                            </div>
                            <div className="w-2/12">
                                {cart?.user?.name}
                            </div>
                            <div className="w-3/12">
                                ${cart?.subTotal?.toLocaleString()}
                            </div>
                            <div className="w-2/12 capitalize">
                                {
                                    format(new Date(cart?.createdAt), 'EEEE, dd/MM/yyyy', {
                                        locale: es
                                    })
                                }
                            </div>
                            <div className="w-1/12">
                                {
                                    cart?.isProcessed ?
                                        <p className="text-green-500">Si</p>
                                        :
                                        <p className="text-red-500">No</p>
                                }
                            </div>
                            <div className="w-1/12">
                                {
                                    cart?.isDirectPurchase ?
                                        <p className="text-green-500">Si</p>
                                        :
                                        <p className="text-red-500">No</p>
                                }
                            </div>
                            <div className="w-1/12">
                                <Link to={`carts/${cart?.id}`}>
                                    <IoEye className="m-auto text-2xl cursor-pointer hover:text-main transition duration-300" />
                                </Link>
                            </div>
                        </div>
                        )
                        :
                        <p className="text-red-500 py-8">
                            No hay carritos.
                        </p>
                }
            </div>
        </div>
    )
}

export default CartsTable;