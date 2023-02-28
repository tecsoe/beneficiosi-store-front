import useAxios from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import ImgUploadInput from "../../components/ImgUploadInput";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory, useParams } from "react-router";

const NewsEdit = () => {

    const { id } = useParams();

    const history = useHistory();

    const { setCustomAlert, setLoading } = useAuth();

    const [previewImage, setPreviewImage] = useState(null);

    const [newPostData, setNewPostData] = useState({
        title: '',
        image: null,
        redirectUrl: ''
    });

    const [{ data: newPost, error: newPostError, loading: newPostLoading }, getNewPost] = useAxios({ url: `news/${id}` }, { useCache: false });

    const [{ data: updateData, error: updateError }, updateNewPost] = useAxios({ url: `news/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (newPost) {
            const { id, ...rest } = newPost;
            setNewPostData((oldNewPostData) => {
                return {
                    ...oldNewPostData,
                    ...rest
                }
            })
            setPreviewImage(`${process.env.REACT_APP_API_URL}/${newPost?.imgPath}`);
        }
    }, [newPost])

    useEffect(() => {
        setLoading({ show: newPostLoading, message: 'Obteniendo datos' });
    }, [newPostLoading])

    useEffect(() => {
        if (updateData) {
            setLoading({ show: false, message: '' });
            setCustomAlert({ show: true, message: 'Se ha actualizado exitosamente.', severity: 'success' });
            history?.push('/news');
        }
    }, [updateData]);

    useEffect(() => {
        if (newPostError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${newPostError?.response?.status === 400 ? newPostError?.response?.data.message[0] : newPostError?.response?.data.message}.`, severity: "error" });
        }

        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }
    }, [newPostError, updateError]);

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

        const data = new FormData();

        data.append('title', newPostData?.title);
        data.append('redirectUrl', newPostData?.redirectUrl);
        if (newPostData?.image) {

            data.append('image', newPostData?.image, newPostData?.image?.name);
        }

        setLoading({ show: true, message: 'Actualizando' });
        await updateNewPost({ data });
        setLoading({ show: false, message: '' });

    }

    return (
        <div className="p-4">
            <h1 className="text-gray-500 text-2xl mb-4">Editar post de noticias</h1>
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
                            <ImgUploadInput previewImage={previewImage} className="w-64" name="image" change={handleChange} />
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

export default NewsEdit;