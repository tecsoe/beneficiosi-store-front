import useAxios from "./useAxios";

export default (fieldName = 'image') => {
    const [{loading}, uploadImage] = useAxios({ url: '/products/upload-html-image', method: 'POST'}, { useCache: false, manual: true });
    
    const uploadAdapter = (loader) => ({
        upload: () => new Promise((resolve, reject) => {
            const body = new FormData();

            loader.file.then((file) => {
                body.append(fieldName, file);

                uploadImage({ data: body })
                    .then(({data}) => resolve({ default: data.url }))
                    .catch((err) => reject(err));
            })
        }),
    });

    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
          return uploadAdapter(loader);
        };
    }
    return { loading, uploadPlugin };
}