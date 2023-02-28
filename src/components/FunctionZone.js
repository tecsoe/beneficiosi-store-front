import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import Button from "./Button";
import CustomInput from "./CustomInput";

const FunctionZone = ({ zone, onChange, index, name }) => {

    const handleChange = (e) => {
        onChange({ target: { name: e.target.name, parentName: name, index: index, value: e.target.value } })
    }

    return (
        <div className="my-4">
            <h2 className="text-center">

            </h2>
            <h3 className="text-center text-xl">
                {zone?.zone?.name}
            </h3>
            <h4 className="text-center text-gray-500">
                Disponibles
            </h4>
            <div className="flex items-center space-x-1">
                <Button type="button" onClick={() => { handleChange({ target: { name: 'availableSeats', value: Number(zone?.availableSeats) - 1 } }) }}>
                    <IoArrowDown />
                </Button>
                <CustomInput type="number" onChange={handleChange} name="availableSeats" value={zone?.availableSeats} />
                <Button type="button" onClick={() => { handleChange({ target: { name: 'availableSeats', value: Number(zone?.availableSeats) + 1 } }) }}>
                    <IoArrowUp />
                </Button>
            </div>
            <h4 className="text-center text-gray-500 mt-1">
                Precio ($)
            </h4>
            <div className="flex items-center space-x-1">
                <Button type="button" onClick={() => { handleChange({ target: { name: 'price', value: Number(zone?.price) - 1 } }) }}>
                    <IoArrowDown />
                </Button>
                <CustomInput type="number" onChange={handleChange} name="price" value={zone?.price} />
                <Button type="button" onClick={() => { handleChange({ target: { name: 'price', value: Number(zone?.price) + 1 } }) }}>
                    <IoArrowUp />
                </Button>
            </div>

        </div>
    )
}

export default FunctionZone;