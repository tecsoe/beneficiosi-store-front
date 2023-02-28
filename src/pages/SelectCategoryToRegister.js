import { useEffect } from "react";
import useCategories from "../hooks/useCategories";
import SystemInfo from "../util/SystemInfo";

const SelectCategoryToRegister = () => {

    const [{ categories, error, loading }, getCategories] = useCategories();

    useEffect(() => {
        console.log(categories);
    }, [categories])

    return (
        <div className="h-screen w-screen py-8 text-center flex-wrap text-white flex justify-center">
            <div className="space-y-4 w-full">
                <img className="m-auto h-12" src={SystemInfo.logo} alt="" />
                <h1 className="text-center text-main text-4xl font-bold">
                    ¡Gracias por querer pertenecer a nuestra familia!
                </h1>
                <p className="text-center text-xl text-main">
                    Por favor selecciona la categoria a la cual quieres pertenecer.
                </p>
            </div>
            {
                error ?
                    <div className="m-auto">
                        Ha ocurrido un error
                    </div>
                    :
                    loading ?
                        <div className="text-3xl mt-1/4 text-main font-bold w-full">
                            Cargando...
                        </div>
                        :
                        categories?.length > 0 ?
                            <div className="flex space-x-4 w-full justify-center">
                                {categories.map((category, index) => <a
                                    key={index}
                                    href={`/register?storeCategoryId=${category?.id}`}
                                    className="
                                        h-24 w-2/12
                                        flex items-center justify-center
                                        relative w-full py-8
                                        text-white font-semibold text-2xl
                                        rounded-md overflow-hidden shadow
                                        transform transition duration-300
                                        hover:-translate-y-1 hover:shadow-2xl"
                                    style={{
                                        backgroundImage: `url(${process.env.REACT_APP_API_URL}${category.imgPath})`,
                                        backgroundSize: 'cover',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black opacity-30"></div>
                                    <span className="relative capitalize">{category.name}</span>
                                </a>)}
                            </div>
                            :
                            null
            }
        </div >
    )
}

export default SelectCategoryToRegister;