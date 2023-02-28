import { IoSearch, IoClose, IoPencil, IoEllipsisVerticalOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import CustomInput from "./CustomInput";

const DeliveryTable = ({ className, companies, deliverMethodsTypes, onDelete, filtersValues, onFiltersChange, onClickFilter }) => {
    return (
        <div className={className}>
            <div className="bg-main h-12"></div>
            <div className="flex w-full items-center font-bold text-center">
                <div className="w-2/12 p-2">
                    <p>ID</p>
                    <CustomInput
                        name="id"
                        value={filtersValues.id}
                        type="text"
                        onChange={onFiltersChange}
                    />
                </div>
                <div className="w-3/12 p-2">
                    <p>Imagen</p>
                </div>
                <div className="w-3/12 p-2">
                    <p>Nombre</p>
                    <CustomInput
                        name="name"
                        value={filtersValues.name}
                        type="text"
                        placeholder="Nombre"
                        onChange={onFiltersChange}
                    />
                </div>
                <div className="w-3/12 p-2">
                    <p>Tipo</p>
                    <select className="w-full rounded-xl capitalize border-none bg-gray-100 transition duration-500 focus:ring-white focus:bg-white focus:shadow-xl" name="deliveryMethodTypeCode" onChange={onFiltersChange} value={filtersValues.deliveryMethodTypeCode}>
                        {
                            deliverMethodsTypes.map((deliveryType, i) => {
                                return (
                                    <option className="capitalize" key={i} value={deliveryType.code}>{deliveryType.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="w-1/12 p-2">
                    <button onClick={onClickFilter}>
                        <IoSearch />
                        Buscar
                    </button>
                </div>
            </div>
            {
                companies.length > 0 ?
                    companies?.map((company, i) => {
                        return (
                            <div key={i} className="flex text-center w-full items-center font-bold my-2">
                                <div className="w-2/12 p-2">
                                    <p>{company?.id}</p>
                                </div>
                                <div className="w-3/12 p-2">
                                    {
                                        company?.imgPath ?
                                            <img className="m-auto rounded w-20" src={`${process.env.REACT_APP_API_URL}/${company.imgPath}`} alt="" />
                                            :
                                            <p className="text-center">No posee imagen</p>
                                    }
                                </div>
                                <div className="w-3/12 p-2">
                                    <p>{company?.name}</p>
                                </div>
                                <div className="w-3/12 p-2 capitalize">
                                    <p>{company?.deliveryMethodType?.name}</p>
                                </div>
                                <div className="w-1/12 p-2 flex text-2xl justify-between">
                                    <Link to={`/configuration/delivery-methods/${company?.id}/edit`}>
                                        <IoPencil className="text-yellow-500 cursor-pointer" />
                                    </Link>
                                    <IoClose onClick={() => { onDelete(company) }} className="text-red-500 cursor-pointer" />
                                    <IoEllipsisVerticalOutline className="text-gray-500 cursor-pointer" />
                                </div>
                            </div>
                        )
                    })
                    :
                    <div className="text-center text-red-500 py-8">
                        No hay empresas de envios.
                    </div>
            }
        </div>
    )
}

export default DeliveryTable;