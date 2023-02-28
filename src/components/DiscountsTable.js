import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { format } from "date-fns";
import { IoPencil, IoClose, IoEllipsisVertical, IoSearch, IoHandLeftOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Button from "./Button";
import CustomInput from "./CustomInput";

const DiscountsTable = ({ discounts, className, filters, onFiltersChange, onDelete, onClearFilters }) => {
    return (
        <div className={className}>
            <div className="bg-main h-12"></div>
            <div className="flex w-full justify-between items-center font-bold text-center px-4">
                <div className="w-1/12 p-2 text-center">
                    <p>ID</p>
                </div>
                <div className="w-2/12 p-2 text-center">
                    <p>Imagen</p>
                </div>
                <div className="w-2/12 p-2 text-center">
                    <p>Nombre</p>
                </div>
                <div className="w-2/12 p-2 text-center">
                    <p>Porcentaje</p>
                </div>
                <div className="w-2/12 p-2 text-center">
                    <p>Fecha de Inicio</p>
                </div>
                <div className="w-2/12 p-2 text-center">
                    <p>Fecha Final</p>
                </div>
                <div className="w-1/12 p-2 text-center">
                    <Button onClick={onClearFilters}>
                        Limpiar Filtros
                    </Button>
                </div>
            </div>
            <div className="flex w-full justify-between items-center font-bold text-center px-4">
                <div className="w-1/12 p-2 text-center">
                    <CustomInput
                        name="id"
                        value={filters.id}
                        onChange={onFiltersChange}
                        placeholder="id"
                        type="text"
                    />

                </div>
                <div className="w-2/12 p-2 text-center">
                    --
                </div>
                <div className="w-2/12 p-2 text-center">
                    <CustomInput
                        name="name"
                        value={filters.name}
                        onChange={onFiltersChange}
                        placeholder="Nombre"
                        type="text"
                    />

                </div>
                <div className="w-2/12 p-2 text-center space-y-2">
                    <CustomInput
                        name="minValue"
                        value={filters.minValue}
                        onChange={onFiltersChange}
                        placeholder="min"
                        type="number"
                    />
                    <CustomInput
                        name="maxValue"
                        value={filters.maxValue}
                        onChange={onFiltersChange}
                        placeholder="max"
                        type="number"
                    />

                </div>
                <div className="w-2/12 p-2 text-center">
                    <DateTimePickerComponent
                        placeholder="Inicia..."
                        name="minDate"
                        value={filters?.minDate}
                        onChange={onFiltersChange}
                        format="dd/MM/yyyy"
                        allowEdit={false}
                        floatLabelType="auto"
                        openOnFocus={true} />
                </div>
                <div className="w-2/12 p-2 text-center">
                    <DateTimePickerComponent
                        placeholder="Finaliza..."
                        name="maxDate"
                        value={filters?.maxDate}
                        onChange={onFiltersChange}
                        format="dd/MM/yyyy"
                        allowEdit={false}
                        floatLabelType="auto"
                        openOnFocus={true} />
                </div>
                <div className="w-1/12 p-2 text-center">
                </div>
            </div>
            <div className="w-full text-center px-4">
                {
                    discounts.length > 0 ?
                        discounts.map((discount, i) => <div key={i} className="flex flex-wrap bg-white my-4 p-6 items-center rounded-lg transition duration-300 transform hover:shadow-xl hover:-translate-y-2">
                            <div className="w-1/12 p-2 text-left">
                                <p>{discount?.id}</p>
                            </div>
                            <div className="w-2/12 p-2">
                                {
                                    discount?.imgPath &&
                                    <img src={`${process.env.REACT_APP_API_URL}/${discount?.imgPath}`} className="m-auto rounded w-24" alt={discount.name} />
                                }
                            </div>
                            <div className="w-2/12 p-2 text-blue-500">
                                <p>{discount?.name}</p>
                            </div>
                            <div className="w-2/12 p-2">
                                <p>{discount?.value}%</p>
                            </div>
                            <div className="w-2/12 p-2">
                                <p>{format(new Date(discount?.from), "dd/MM/yyyy")}</p>
                            </div>
                            <div className="w-2/12 p-2">
                                <p>{format(new Date(discount?.until), "dd/MM/yyyy")}</p>
                            </div>
                            <div className="w-1/12 p-2 flex itemx-center justify-between">
                                <Link to={`/catalog/discounts/${discount?.id}/edit`} className="text-yellow-500 text-2xl">
                                    <IoPencil />
                                </Link>
                                <button onClick={() => { onDelete(discount) }} className="text-red-500 text-2xl">
                                    <IoClose />
                                </button>
                            </div>
                        </div>
                        )
                        :
                        <div className="text-center my-4 text-red-500 p-6">
                            No se encontraron descuentos.
                        </div>
                }
            </div>
        </div>
    )
}

export default DiscountsTable;