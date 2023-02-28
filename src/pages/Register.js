//Imagenes
import BeneficioSiLogo from '../assets/images/logo.png';
import bgSection from '../assets/images/women-shopping.png';
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isEmail, isNumber, isRequired, validate } from '../helpers/formsValidations';
import Map from "../components/googlemaps/Map";
import { useAuth } from '../contexts/AuthContext';
import useAxios from '../hooks/useAxios';
import { useLocation } from 'react-router-dom';
import useCountries from '../hooks/useCountries';

const Register = () => {

  const history = useHistory();

  const location = useLocation();

  const { setLoading, setCustomAlert, setAuthInfo } = useAuth();

  const [{ data, error: registerError }, registerStore] = useAxios({ url: "/auth/register-store", method: "POST" }, { useCache: false, manual: true });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    phoneCode: "",
    address: "",
    latitude: null,
    longitude: null,
    storeCategoryId: "",
    confirmPassword: ""
  });

  const [errorsForm, setErrorsForm] = useState({
    name: null,
    email: null,
    phoneNumber: null,
    password: null,
    address: null,
    latitude: null,
    longitude: null,
    storeCategoryId: null,
    confirmPassword: null
  });

  const [googleMapsMarkers, setGoogleMapsMarkers] = useState([{ lat: -34.397, lng: 150.644 }]);

  const [googleMapsOptions, setGoogleMapsOptions] = useState({ center: { lat: -34.397, lng: 150.644 }, zoom: 8 })

  const [{ countries, loading: countriesLoading, error: countriesError }, getCountries] = useCountries({
    params: {
      perPage: 500
    }
  });

  useEffect(() => {
    console.log(countries);
  }, [countries])

  useEffect(() => {
    if (registerError) {
      setLoading({ show: false, message: "" });
      setCustomAlert({ show: true, message: `${registerError.response?.status === 400 ? registerError.response?.data.message[0] : registerError.response?.data.message}.`, severity: "error" });
    }
  }, [registerError]);

  useEffect(() => {
    if (data) {
      setAuthInfo({ isAuthenticated: true, user: data.user, token: data.accessToken });
      history.push('/dashboard');
    }
  }, [data]);

  useEffect(() => {
    setErrorsForm({
      email: validate(registerData.email, [
        { validator: isRequired, errorMessage: "El email es obligatorio." },
        { validator: isEmail, errorMessage: "el email debe ser valido." }
      ]),
      address: validate(registerData.address, [
        { validator: isRequired, errorMessage: "la direccion es obligatoria." },
      ]),
      confirmPassword: validate(registerData.confirmPassword, [
        { validator: isRequired, errorMessage: "Por favor rellene este campo." },
      ]),
      name: validate(registerData.name, [
        { validator: isRequired, errorMessage: "El nombre es obligatorio." },
      ]),
      phoneNumber: validate(registerData.phoneNumber, [
        { validator: isRequired, errorMessage: "El telefono es obligatorio." },
      ]),
      storeCategoryId: validate(registerData.storeCategoryId, [
        { validator: isRequired, errorMessage: "la categoria es obligatoria." },
        { validator: isNumber, errorMessage: "el valor de la categoria debe de ser un numero." },
      ]),
      password: validate(registerData.password, [
        { validator: isRequired, errorMessage: "La contraseña es obligatoria." },
      ])
    })
  }, [registerData]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const storeCategoryId = params.get('storeCategoryId');

    if (storeCategoryId) {
      setRegisterData((oldRegisterData) => {
        return {
          ...oldRegisterData,
          storeCategoryId
        }
      })
    } else {
      history.push('/select-category');
    }
  }, [location]);

  const handleChange = (e) => {
    setRegisterData((oldRegisterData) => ({
      ...oldRegisterData,
      [e.target.name]: e.target.value
    }));
  }

  const hanleMapClick = (e) => {
    setGoogleMapsMarkers([e]);
    setGoogleMapsOptions({ ...googleMapsOptions, center: e });
    setRegisterData((oldRegisterData) => ({
      ...oldRegisterData,
      latitude: e.lat,
      longitude: e.lng
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let errors in errorsForm) {
      if (errorsForm[errors] != null) {
        alert("Hay un error en el campo: " + errors);
        return;
      }
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading({ show: true, message: "Creando Tienda" });

    await registerStore({
      data: {
        name: registerData.name,
        email: registerData.email,
        phoneNumber: registerData?.phoneCode + registerData.phoneNumber,
        password: registerData.password,
        address: registerData.address,
        latitude: registerData.latitude,
        longitude: registerData.longitude,
        storeCategoryId: registerData.storeCategoryId
      }
    });

    setLoading({ show: false, message: "" });
  }

  return (
    <div className="h-screen w-screen">
      <div className="flex justify-between h-full">

        <div className="w-1/2 text-center text-white" style={{ backgroundImage: `url(${bgSection})`, backgroundSize: '100% 100%', backgroundRepeat: 'none' }}>
          <div className="bg-black bg-opacity-50 h-full p-12">
            <img className="m-auto w-1/3 text-gray-700" src={BeneficioSiLogo} alt="" />
            <h1 className="my-4 font-bold text-[70px]">
              Beneficio si
            </h1>
            <p className="text-lg">La mejor plataforma para hacer crecer tus ventas.</p>
          </div>
        </div>

        <div className="w-1/2 bg-white overflow-y-auto h-full px-2 relative">
          <div className="flex justify-right items-center p-6">
            <img className="ml-auto w-1/12 text-gray-700" src={BeneficioSiLogo} alt="" />
            <h1 className="ml-2 font-bold text-[40px]">
              Beneficio si
            </h1>
          </div>
          <div className="mt-4 px-8">
            <h2 className="border-b border-main text-center text-2xl">
              Registro de Tiendas
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="text-lg mt-5 px-14">
            <div className="flex justify-between">
              <div className="w-1/2 px-1">
                <h2 className="text-gray-600 font-bold">
                  Nombre de la tienda
                </h2>
                <input name="name" onChange={handleChange} className="rounded w-full mt-1" type="text" placeholder="Nombre de la tienda..." />
                {
                  errorsForm.name ?
                    <p className="text-red-500">{errorsForm.name}</p>
                    :
                    null
                }
              </div>
              <div className="w-1/2 px-1">
                <h2 className="text-gray-600 font-bold">
                  Correo Electronico
                </h2>
                <input name="email" onChange={handleChange} className="rounded w-full mt-1" type="text" placeholder="Correo Electronico" />
                {
                  errorsForm.email ?
                    <p className="text-red-500">{errorsForm.email}</p>
                    :
                    null
                }
              </div>
            </div>

            <div className="my-6 flex justify-between">
              <div className="w-1/2 px-1">
                <h2 className="text-gray-600 font-bold">
                  Contraseña
                </h2>
                <input name="password" onChange={handleChange} className="rounded w-full mt-1" type="password" placeholder="Contraseña" />
                {
                  errorsForm.password ?
                    <p className="text-red-500">{errorsForm.password}</p>
                    :
                    null
                }
              </div>
              <div className="w-1/2 px-1">
                <h2 className="text-gray-600 font-bold">
                  Confirmar Contraseña
                </h2>
                <input name="confirmPassword" onChange={handleChange} className="rounded w-full mt-1" type="password" placeholder="Confirmar Contraseña" />
                {
                  errorsForm.confirmPassword ?
                    <p className="text-red-500">{errorsForm.confirmPassword}</p>
                    :
                    null
                }
              </div>
            </div>

            <div className="px-1 my-6">
              <h2 className="text-gray-600 font-bold">
                Telefono
              </h2>
              <div className="flex items-center space-x-2">
                <select className="rounded w-1/3" value={registerData?.phoneCode} name="phoneCode" onChange={handleChange}>
                  {countries?.map?.((country, i) => {
                    return (
                      <option value={country?.dialCode}>
                        ({country?.dialCode}) {country?.name}
                      </option>
                    )
                  })}
                </select>
                <input name="phoneNumber" onChange={handleChange} className="rounded w-full" type="text" placeholder="Telefono" />
              </div>
              {
                errorsForm.phoneNumber ?
                  <p className="text-red-500">{errorsForm.phoneNumber}</p>
                  :
                  null
              }
            </div>

            <div className="my-6 justify-between">
              <Map
                searchBox={
                  {
                    label: "Direccion:",
                    onChange: handleChange,
                    value: registerData.address,
                    name: "address"
                  }
                }
                options={googleMapsOptions}
                onClick={hanleMapClick}
                markers={googleMapsMarkers} />
            </div>

            <div className="text-center">
              <button className="bg-main px-4 py-2 rounded text-white">
                Registrate
              </button>
            </div>
            <p className="text-center mt-4 text-lg">
              ¿Ya tienes cuenta? <Link to="/login" className="text-main hover:text-gray-800 transition duration-500"> Inicia Sesión </Link>
            </p>
          </form>
          <div className="hidden text-sm mt-4 text-right">
            © 2019 <span className="text-main">Beneficio Si.</span> Todos los derechos reservados. Diseñado por Jeyver Vegas
          </div>
        </div>
      </div >
    </div >
  )

}


export default Register;