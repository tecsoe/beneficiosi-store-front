import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "./Button";
import { IoClose } from "react-icons/io5";

const ImgUploadInput = (options) => {

  const { multiple, style, accept, icon, button, className, description, change, name, previewImage, deleteButton } = options;

  const [files, setFiles] = useState([]);

  const [preview, setPreview] = useState(null)

  const [active, setActive] = useState(false);

  useEffect(() => {
    setPreview(previewImage)
  }, [previewImage])

  useEffect(() => {
    if (files.length > 0) {
      setPreview(URL.createObjectURL(files[0]));
      change?.({ target: { name: name, files: files, type: "file" } });
    }
  }, [files])

  const handleDelete = (e) => {
    setFiles([]);
    setPreview(null);
    change?.({ target: { name: name, files: null, type: "file" } });
  }

  const { getInputProps, getRootProps } = useDropzone({
    accept: accept ? accept : 'image/*',
    maxFiles: 1,
    multiple: multiple,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles
      )
    },
    onDragEnter: (event) => {
      setActive(true);
    },
    onDragLeave: (event) => {
      setActive(false);
    },
    onDropAccepted: () => {
      setActive(false);
    }
  });

  return (
    <div style={style} className={`w-full h-[400px] m-auto bg-white rounded relative ${className}`} >
      {deleteButton ?
        <Button type="button" onClick={handleDelete} className="rounded-full px-0 py-0 absolute -top-2 -right-2 z-50">
          <IoClose></IoClose>
        </Button>
        :
        null
      }
      <div
        {...getRootProps()}
        className={" cursor-pointer h-full"}
      >
        <div className={clsx(["transition duration-300 flex h-full relative"], {
          "border border-dashed border-main rounded shadow-2xl": active,
          "border border-dashed border-gray-200 rounded": !active,
        })}>
          {
            preview ?
              <img className="w-full h-full absolute left-0 top-0" src={preview} alt="" />
              :
              <div className="text-center m-auto px-6">
                <div className={clsx({
                  "text-main": active,
                  "text-gray-200": !active
                })}>
                  {icon}
                </div>
                <div className={clsx(["font-bold text-xl"], {
                  "text-main": active,
                  "text-gray-200": !active
                })}>
                  {description ? description : "Arrastre una imagen o haga click"}
                </div>
              </div>
          }
        </div>
        {
          button ?
            <div className="text-center mt-2">
              <button className="bg-main p-4 rounded text-white">
                {button.text}
              </button>
            </div>
            :
            null
        }
        <input type="file" {...getInputProps()} />
      </div>
    </div >

  )
}

ImgUploadInput.propTypes = {
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  icon: PropTypes.element,
  className: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  change: PropTypes.func,
  button: PropTypes.object,
  previewImage: PropTypes.string
}

export default ImgUploadInput;
