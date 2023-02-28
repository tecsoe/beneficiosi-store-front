import { useEffect, useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import useCategoriesStores from "../hooks/useCategoriesStores";

const RenderItem = ({ category, onChange, value, name, ...rest }) => {

    const [childrens, setChildrens] = useState([]);

    const [drop, setDrop] = useState(false);

    const [{ categoriesStores: childrenCategories, error, loading: loadingChildren }, getChildrenCategories] = useCategoriesStores({ params: { parentId: category.id }, options: { manual: true } });

    useEffect(() => {
        setChildrens(childrenCategories);
    }, [childrenCategories])

    useEffect(() => {
        if (drop) {
            getChildrenCategories();
        }
    }, [drop])

    const handleClick = async (e) => {
        setDrop((oldDrop) => !oldDrop);
    }

    return (
        <li>
            <div className="flex items-center text-black">
                <button className="text-main" type="button" onClick={handleClick}>
                    {
                        drop ?
                            <IoChevronUpOutline />
                            :
                            <IoChevronDownOutline />
                    }
                </button>
                <input
                    className="focus:ring-main rounded-full mx-2 text-main w-4"
                    type="checkbox"
                    name={name}
                    value={value}
                    checked={value.includes(category.id)}
                    onChange={e => { onChange({ target: { name: name, value: category.id, type: "checkbox" } }) }} />
                {category.name}
            </div>
            {
                loadingChildren ?
                    <div className="text-center">
                        Cargando Hijos...
                    </div>
                    :
                    drop ?
                        childrens.length > 0 ?
                            <RenderListStoresCategories name={name} value={value} onChange={onChange} categories={childrens} className="pl-4" />
                            :
                            <div className="pl-4 text-main">
                                No tiene Hijos
                            </div>
                        :
                        null
            }
        </li>
    )
}

const RenderListStoresCategories = ({ categories, className, onChange, value, name, ...rest }) => {
    return (
        <ul className={className} {...rest}>
            {
                categories.map((category, i) => {
                    return (
                        <RenderItem onChange={onChange} name={name} value={value} key={i} category={category} />
                    )
                })
            }
        </ul>
    )
}

export default RenderListStoresCategories;