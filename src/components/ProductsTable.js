import { IoCheckmarkSharp, IoClose, IoSearch, IoEllipsisVertical, IoPencil } from "react-icons/io5";
import { Link } from "react-router-dom";
import findPortraitImg from "../helpers/findPortraitImage"

const ProductsTable = ({ products, className, onFiltersChange, filters, onDelete, findData }) => {

    return (
        <div className={className}>
            <div className="bg-main h-12"></div>
            <div className="flex w-full items-center font-bold text-center px-4">
                <div className="w-1/12 p-2">
                    <p>ID</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="id"
                        value={filters.id}
                        className="max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-1/12 p-2">
                    <p>Imagen</p>
                </div>
                <div className="w-2/12 p-2">
                    <p>Nombre</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="name"
                        value={filters.name}
                        className="max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-1/12 p-2">
                    <p>Referencia</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="reference"
                        value={filters.reference}
                        className="max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-2/12 p-2">
                    <p>Precio</p>
                    <input
                        onChange={onFiltersChange}
                        type="number"
                        name="minPrice"
                        placeholder="Desde..."
                        value={filters.minPrice}
                        className="max-w-full my-1 border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                    <input
                        onChange={onFiltersChange}
                        type="number"
                        name="maxPrice"
                        placeholder="Hasta..."
                        value={filters.maxPrice}
                        className="max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-2/12 p-2">
                    <p>Categorias</p>
                    <input
                        onChange={onFiltersChange}
                        type="text"
                        name="categoryName"
                        value={filters.categoryId}
                        className="max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-1/12 p-2">
                    <p>Cantidad</p>
                    <input
                        onChange={onFiltersChange}
                        type="number"
                        placeholder="min..."
                        name="minQuantity"
                        value={filters.minQuantity}
                        className="my-1 max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                    <input
                        onChange={onFiltersChange}
                        type="number"
                        placeholder="max..."
                        name="maxQuantity"
                        value={filters.maxQuantity}
                        className="max-w-full border-none bg-gray-100 rounded-full p-2 focus:shadow-xl focus:bg-white focus:ring-white transition duration-500" />
                </div>
                <div className="w-2/12 p-2">
                    <button onClick={findData}>
                        <IoSearch /> Buscar
                    </button>
                </div>
            </div>
            <div className="w-full text-center px-4">
                {
                    products.length > 0 ?
                        products.map((product, i) => <div key={i} className="flex flex-wrap bg-white my-4 p-6 items-center rounded-lg transition duration-300 transform hover:shadow-xl hover:-translate-y-2">
                            <div className="w-1/12 p-2">
                                <p>{product.id}</p>
                            </div>
                            <div className="w-1/12 p-2">
                                <img src={`${process.env.REACT_APP_API_URL}/${findPortraitImg(product.productImages)?.path}`} className="rounded" alt={product.name} />
                            </div>
                            <div className="w-2/12 p-2 text-blue-500">
                                <a href={`${process.env.REACT_APP_HOST}products/${product?.slug}`}>
                                    <p>{product.name}</p>
                                </a>
                            </div>
                            <div className="w-1/12 p-2">
                                <p>{product.reference}</p>
                            </div>
                            <div className="w-2/12 p-2">
                                <p>$ {product?.productDetails?.price}</p>
                            </div>
                            <div className="w-2/12 p-2">
                                {
                                    product.categories?.length > 0 ?
                                        <p className="text-main">{product.categories.map(category => category.name).join(", ")}</p>
                                        :
                                        <p>No tiene categorias</p>
                                }
                            </div>
                            <div className="w-1/12 p-2">
                                <p>{product.quantity}</p>
                            </div>
                            <div className="w-2/12 p-2 flex itemx-center justify-between">
                                <Link to={`/catalog/products/edit/${product.id}`} className="text-yellow-500 text-2xl">
                                    <IoPencil />
                                </Link>
                                <button onClick={() => { onDelete(product) }} className="text-red-500 text-2xl">
                                    <IoClose />
                                </button>
                            </div>
                        </div>
                        )
                        :
                        <p className="text-red-500 py-8">
                            No hay productos
                        </p>
                }
            </div>
        </div>
    )
}

export default ProductsTable;