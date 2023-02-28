import { Link } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import CustomInput from "./CustomInput";
import Button from "./Button";

const OrdersTable = (props) => {

  const { orders, className, values, onFiltersChange, options, onClearFilters } = props;

  console.log(orders);

  return (
    <div className={className}>
      <div className="bg-main h-12"></div>
      <div className="flex px-4 w-full items-center font-bold space-x-4">
        <div className="w-1/12">
          Referencia
          <CustomInput
            placeholder="Nro. de orden"
            onChange={onFiltersChange}
            value={values.orderNumber}
            name="orderNumber" />
        </div>
        <div className="w-2/12">
          Direccion
          <CustomInput
            placeholder="dirección..."
            onChange={onFiltersChange}
            value={values.address}
            name="address" />
        </div>
        <div className="w-1/12">
          Cliente
          <CustomInput
            placeholder="Nombre del cliente"
            onChange={onFiltersChange}
            value={values.clientName}
            name="clientName" />
        </div>
        <div className="w-1/12">
          Total
          <CustomInput
            placeholder="min"
            className="my-1"
            onChange={onFiltersChange}
            value={values.minTotal}
            name="minTotal" />
          <CustomInput
            placeholder="max"
            className="my-1"
            onChange={onFiltersChange}
            value={values.maxTotal}
            name="maxTotal" />
        </div>
        <div className="w-2/12">
          Fecha
          <CustomInput
            placeholder="desde"
            className="my-1"
            onChange={onFiltersChange}
            value={values.from}
            name="from" />
          <CustomInput
            placeholder="hasta"
            className="my-1"
            onChange={onFiltersChange}
            value={values.until}
            name="until" />
        </div>
        <div className="w-2/12">
          <p>Estado</p>
          <select type="text" className="capitalize max-w-full border-gray-200 mt-2 rounded p-1">
            {
              options?.orderStatuses?.map((orderStatus, i) => {
                return (
                  <option key={i} className="capitalize" value={orderStatus?.code}>{orderStatus?.name}</option>
                )
              })
            }
          </select>
        </div>
        <div className="w-2/12">
          <p>Pago</p>
          <select type="text" className="capitalize max-w-full border-gray-200 mt-2 rounded p-1">
            {
              options?.payMethods?.map((payMethod, i) => {
                return (
                  <option key={i} className="capitalize" value={payMethod?.code}>{payMethod?.name}</option>
                )
              })
            }
          </select>
        </div>
        <div className="w-1/12">
          <Button onClick={onClearFilters}>
            Limpiar Filtros
          </Button>
        </div>
      </div>
      <div className="w-full">
        {
          orders?.length > 0 ?
            orders.map((order, i) => <div key={i} className="flex space-x-4 px-4 py-8 bg-white my-4 items-center rounded-lg transition duration-300 transform hover:shadow-xl hover:-translate-y-2">
              <div className="w-1/12 text-center">
                {order?.orderNumber}
              </div>
              <div className="w-2/12">
                {
                  order?.delivery?.profileAddress?.address ?
                    order?.delivery?.profileAddress?.address
                    :
                    <b>Retira en tienda</b>
                }
              </div>
              <div className="w-1/12">
                {order?.user?.name}
              </div>
              <div className="w-1/12">
                <p title={`$${order?.total?.toLocaleString()}`}>
                  ${order?.total?.toLocaleString().length > 12 ? `${order?.total?.toLocaleString().slice(0, 12)}...` : order?.total?.toLocaleString()}
                </p>
              </div>
              <div className="w-2/12">
                {order?.createdAt?.toLocaleString()}
              </div>
              <div className="w-2/12 rounded-lg font-bold bg-opacity-10" >
                <p className="text-white py-2 capitalize rounded" style={{ backgroundColor: order?.orderStatus?.color }}>{order?.orderStatus?.name}</p>
              </div>
              <div className="w-2/12 capitalize">
                {order?.paymentMethod?.name}
              </div>
              <div className="w-1/12">
                <Link to={`/my-orders/orders/${order?.id}`}>
                  <IoEye className="m-auto text-2xl cursor-pointer hover:text-main transition duration-300"></IoEye>
                </Link>
              </div>
            </div>
            )
            :
            <p className="text-red-500 py-8">
              No hay ordenes.
            </p>
        }
      </div>
    </div>
  )
}

export default OrdersTable;