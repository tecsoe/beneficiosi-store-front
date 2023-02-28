import { useState } from "react";
import Button from "../Button";
import CustomInput from "../CustomInput";
import { IoHelpCircleSharp, IoTrashSharp } from "react-icons/io5";
import AddFeatureGroupModal from "./AddFeatureGroupModal";
import CheapHelp from "../CheapHelp";

const ThirdStep = ({ show, onSubmit, goBack, values, onChange, onAddFeature, onRemoveFeature, onAddFeatureGroup, onRemoveFeatureGroup }) => {

    const [showModalGroup, setShowModalGroup] = useState(false);

    const handleChange = (e, i, forof, i2) => {
        onChange({
            target: {
                name: e.target.name,
                value: e.target.value,
                type: e.target.type,
                index: i,
                index2: i2 !== undefined ? i2 : undefined,
                for: forof
            }
        })
    }

    const handleAddFeatureGroup = (e) => {
        if (e) {
            onAddFeatureGroup(e);
        }
        setShowModalGroup(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(values);
    }

    return (
        <div hidden={!show}>
            <form onSubmit={handleSubmit}>
                <h1 className="text-gray-700 text-2xl mb-4">
                    Caracteristicas del producto
                </h1>

                {
                    values?.features.length > 0 ?
                        values?.features?.map((feature, i) => {
                            return (
                                <div key={i} className="flex items-center my-6 space-x-4">
                                    <div className="w-1/5">
                                        <h1 className="relative mb-2">
                                            Nombre
                                            <CheapHelp icon={<IoHelpCircleSharp />} message="Nombre de la caracteritica." />
                                        </h1>
                                        <CustomInput placeholder="Nombre" value={feature.name} name="name" onChange={e => { handleChange(e, i, "features") }} />
                                    </div>
                                    <div className="w-1/5">
                                        <h1 className="mb-2 relative">
                                            Valor/Cantidad
                                            <CheapHelp icon={<IoHelpCircleSharp />} message="Cantidad de la caracteritica Ej: 500grs" />
                                        </h1>
                                        <CustomInput placeholder="Valor" value={feature.value} name="value" onChange={e => { handleChange(e, i, "features") }} />
                                    </div>
                                    <div className="w-1/5">
                                        <h1 className="mb-2 relative">
                                            Precio
                                            <CheapHelp icon={<IoHelpCircleSharp />} message="Precio que va a influir al costo final" />
                                        </h1>
                                        <CustomInput type="number" placeholder="Precio" value={feature.price} name="price" onChange={e => { handleChange(e, i, "features") }} />
                                    </div>
                                    <div className="w-1/5 text-center">
                                        <h1 className="relative">
                                            Seleccionable
                                            <CheapHelp icon={<IoHelpCircleSharp />} message="Permite al cliente seleccionar o no esta caracteristica al comprar." />
                                        </h1>
                                        <input
                                            className="focus:ring-main rounded-full text-main"
                                            type="checkbox"
                                            checked={feature.isSelectable}
                                            value={feature.isSelectable}
                                            name="isSelectable"
                                            onChange={e => { handleChange(e, i, "features") }} />

                                    </div>
                                    <div className="w-1/5 text-center">
                                        <Button type="button" onClick={e => { onRemoveFeature(feature) }}>
                                            <IoTrashSharp />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className="text-center text-main">
                            No se han agregado caracteristicas aun.
                        </div>
                }

                <div className="my-6 text-right border-b pb-4">
                    <Button type="button" onClick={() => { onAddFeature() }}>
                        Agregar Caracteristica
                    </Button>
                </div>

                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-gray-700 text-2xl">
                        Grupo de caracteristicas del producto
                    </h1>
                    <Button type="button" onClick={() => { setShowModalGroup(true) }}>
                        Añadir Grupo
                    </Button>
                </div>

                {
                    values?.featureGroups.length > 0 ?
                        values?.featureGroups?.map((featureGroup, i) => {
                            return (
                                <div key={i} className="my-6">
                                    <div className="flex items-center">
                                        <IoTrashSharp className="text-main mr-2 cursor-pointer text-2xl transition duration-500 transform hover:scale-125" onClick={e => { onRemoveFeatureGroup(featureGroup) }} />
                                        <h1 className="text-xl font-bold">
                                            {featureGroup.name}
                                        </h1>
                                        <Button className="ml-12 p-0 px-2 py-1" type="button" onClick={e => { onAddFeature(i) }}>
                                            Añadir caracteristica al grupo
                                        </Button>
                                    </div>
                                    {
                                        featureGroup.features.length > 0 ?
                                            featureGroup.features.map((feature, i2) => {
                                                return (
                                                    <div key={i2} className="flex items-center my-6 space-x-4">
                                                        <div className="w-1/5">
                                                            <h1 className="relative mb-2">
                                                                Nombre
                                                                <CheapHelp icon={<IoHelpCircleSharp />} message="Nombre de la caracteritica." />
                                                            </h1>
                                                            <CustomInput placeholder="Nombre" value={feature.name} name="name" onChange={e => { handleChange(e, i, "featureGroups", i2) }} />
                                                        </div>
                                                        <div className="w-1/5">
                                                            <h1 className="mb-2 relative">
                                                                Valor/Cantidad
                                                                <CheapHelp icon={<IoHelpCircleSharp />} message="Cantidad de la caracteritica Ej: 500grs" />
                                                            </h1>
                                                            <CustomInput placeholder="Valor" value={feature.value} name="value" onChange={e => { handleChange(e, i, "featureGroups", i2) }} />
                                                        </div>
                                                        <div className="w-1/5">
                                                            <h1 className="mb-2 relative">
                                                                Precio
                                                                <CheapHelp icon={<IoHelpCircleSharp />} message="Precio que va a influir al costo final" />
                                                            </h1>
                                                            <CustomInput type="number" placeholder="Precio" value={feature.price} name="price" onChange={e => { handleChange(e, i, "featureGroups", i2) }} />
                                                        </div>
                                                        <div className="w-1/5 text-center">
                                                            <h1 className="relative">
                                                                Seleccionable
                                                                <CheapHelp icon={<IoHelpCircleSharp />} message="Permite al cliente seleccionar o no esta caracteristica al comprar." />
                                                            </h1>
                                                            <input
                                                                className="focus:ring-main rounded-full text-main"
                                                                type="checkbox"
                                                                checked={feature.isSelectable}
                                                                value={feature.isSelectable}
                                                                name="isSelectable"
                                                                onChange={e => { handleChange(e, i, "featureGroups", i2) }} />

                                                        </div>
                                                        <div className="w-1/5 text-center">
                                                            <Button type="button" onClick={e => { onRemoveFeature(feature, i) }}>
                                                                <IoTrashSharp />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className="text-center text-main">
                                                No se han agregado caracteristicas aun.
                                            </div>
                                    }
                                </div>
                            )
                        })
                        :
                        <div className="text-center text-main">
                            No se han agregado grupos de caracteristicas aun.
                        </div>
                }

                <div className="text-right space-x-4">
                    <Button type="button" onClick={goBack}>
                        Volver atras
                    </Button>
                    <Button>
                        Siguiente Paso
                    </Button>
                </div>
            </form>
            <AddFeatureGroupModal show={showModalGroup} onClose={handleAddFeatureGroup} />
        </div>
    )
}

export default ThirdStep;