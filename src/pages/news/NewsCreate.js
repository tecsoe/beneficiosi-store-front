import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import ImgUploadInput from "../../components/ImgUploadInput";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router";

const NewsCreate = () => {

    const history = useHistory();

    const { setCustomAlert, setLoading } = useAuth();

    const [newPostData, setNewPostData] = useState({
        title: '',
        image: null,
        redirectUrl: ''
    });

    const [{ data: createData, error: createError }, createNewPost] = useAxios({ url: 'news', method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        if (createData) {
            setLoading({ show: false, message: '' });
            setCustomAlert({ show: true, message: 'Se ha creado exitosamente.', severity: 'success' });
            history?.push('/news');
        }
    }, [createData]);

    useEffect(() => {
        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }
    }, [createError]);

    const handleChange = (e) => {
        setNewPostData((oldNewPostData) => {
            return {
                ...oldNewPostData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPostData?.title) {
            alert("El titulo es obligatorio");
            return;
        }

        if (!newPostData?.redirectUrl) {
            alert("La url de redireccion es obligatoria");
            return;
        }

        if (!newPostData?.image) {
            alert("El post es obligatorio");
            return;
        }

        const data = new FormData();

        data.append('title', newPostData?.title);
        data.append('redirectUrl', newPostData?.redirectUrl);
        data.append('image', newPostData?.image, newPostData?.image?.name);

        setLoading({ show: true, message: 'Creando' });
        await createNewPost({ data });
        setLoading({ show: false, message: '' });

    }

    return (
        <div className="p-4">
            <h1 className="text-gray-500 text-2xl mb-4">Crear post de noticias</h1>
            <div className="bg-white p-4 rounded">
                <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <div className="w-1/2">
                            <label htmlFor="title">
                                Titulo
                            </label>
                            <CustomInput
                                id="title"
                                name="title"
                                value={newPostData?.title}
                                placeholder="Titulo"
                                onChange={handleChange}
                                className="mb-8"
                            />
                            <label htmlFor="url">
                                Url de redirección
                            </label>
                            <CustomInput
                                id="url"
                                name="redirectUrl"
                                value={newPostData?.redirectUrl}
                                placeholder="Url de redirección"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="w-1/2 text-center">
                            <p>Post de la Noticia</p>
                            <ImgUploadInput className="w-64" name="image" change={handleChange} />
                        </div>
                    </div>
                    <div className="text-right mt-8">
                        <Button>
                            Crear Noticia
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewsCreate;