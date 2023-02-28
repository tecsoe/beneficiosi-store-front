import { IoEye, IoEllipsisVertical, IoSearch, IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import CustomInput from "./CustomInput";


const CategoriesTable = ({ categories, className, onFiltersChange, filtersValues, onDelete, type }) => {
    return (
        <div className={className}>
            <div className="bg-main h-12"></div>
            <div className="flex w-full text-center items-start font-bold">
                <div className="w-3/12 p-2">
                    <p>ID</p>
                    <CustomInput name="id" value={filtersValues.id} onChange={onFiltersChange} type="text" className="p-2" />
                </div>
                <div className="w-3/12 p-2">
                    <p>Nombre</p>
                    <CustomInput name="name" value={filtersValues.name} onChange={onFiltersChange} type="text" className="p-2" />
                </div>
                <div className="w-3/12 p-2">
                    <p>Productos</p>
                </div>
                <div className="w-3/12 p-2">

                </div>
            </div>
            {
                categories.length > 0 ?
                    <div className="w-full text-center">
                        {
                            categories.map((category, i) => <div key={i} className="flex bg-white my-4 p-6 items-center rounded-lg transition duration-300 transform hover:shadow-xl hover:-translate-y-2">
                                <div className="w-3/12">
                                    {category.id}
                                </div>
                                <div className="w-3/12">
                                    <Link className="text-blue-500" to={`/catalog/categories?id=${category.id}&name=${category.name}`}>
                                        {category.name}
                                    </Link>
                                </div>
                                <div className="w-3/12">
                                    {category.products}
                                </div>
                                <div className="w-3/12 p-2 flex itemx-center justify-end">
                                    <button className="text-gray-500 text-2xl mr-4">
                                        <IoEye className="m-auto text-2xl cursor-pointer hover:text-main transition duration-300" />
                                    </button>
                                    <button onClick={handleDelete => { onDelete(category) }} className="text-2xl text-red-500">
                                        <IoClose />
                                    </button>
                                </div>
                            </div>
                            )
                        }
                    </div>
                    :
                    <div className="w-full text-center text-main py-5 mb-5">
                        <p>No Hay Categorias</p>
                    </div>
            }
        </div>
    )
}

export default CategoriesTable;