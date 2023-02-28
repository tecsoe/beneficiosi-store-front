//Imagenes
import BeneficioSiLogo from '../assets/images/logo.png';
import bgSection from '../assets/images/women-shopping.png';
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useAxios from '../hooks/useAxios';
import { isEmail, isRequired, validate } from '../helpers/formsValidations';

const Login = () => {

  const history = useHistory();

  const [loginInfo, setLoginInfo] = useState({ password: "", email: "" });

  const [errorsForm, setErrorsForm] = useState({
    email: null,
    password: null,
  });

  const [{ data, loading, error }, login] = useAxios({ url: "/auth/login-store", method: "POST" }, { manual: true, useCache: false });

  const { setAuthInfo, setLoading, setCustomAlert } = useAuth();

  useEffect(() => {
    setLoading({ show: loading, message: "Iniciando Sesión" });
  }, [loading]);


  useEffect(() => {
    if (error) {
      console.log(error);
      setCustomAlert({ show: true, message: `${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setAuthInfo({ isAuthenticated: true, user: data.user, token: data.accessToken });
      history.push('/dashboard');
    }
  }, [data]);

  useEffect(() => {
    setErrorsForm({
      email: validate(loginInfo.email, [
        { validator: isRequired, errorMessage: "El email es obligatorio." },
        { validator: isEmail, errorMessage: "el email debe ser valido." }
      ]),
      password: validate(loginInfo.password, [
        { validator: isRequired, errorMessage: "la contraseña es Obligatoria." },
      ])
    })
  }, [loginInfo])

  const handleSubmit = (e) => {
    e.preventDefault();

    login({ data: loginInfo });
  }

  const handleChange = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value
    });
  }


  return (
    <div className="h-screen w-screen">
      <div className="flex h-full w-full justify-between">

        <div className="w-1/2 text-center text-white" style={{ backgroundImage: `url(${bgSection})`, backgroundSize: '100% 100%', backgroundRepeat: 'none' }}>
          <div className="bg-black bg-opacity-50 h-full p-12">
            <img className="m-auto w-1/3 text-gray-700" src={BeneficioSiLogo} alt="" />
            <h1 className="my-4 font-bold text-[70px]">
              Beneficio si
            </h1>
            <p className="text-lg">La mejor plataforma para hacer crecer tus ventas.</p>
          </div>
        </div>


        <div className="w-1/2 bg-white p-8 relative">
          <div className="flex justify-right items-center">
            <img className="ml-auto w-1/12 text-gray-700" src={BeneficioSiLogo} alt="" />
            <h1 className="ml-2 font-bold text-[40px]">
              Beneficio si
            </h1>
          </div>
          <div className="border-b border-main mt-24">
            <h2 className="text-center text-2xl">
              Login de Tiendas
            </h2>
          </div>

          <form className="text-2xl mt-5" onSubmit={handleSubmit}>
            <div className="my-12">
              <h2 className="text-gray-600 font-bold">
                E-Mail Address
              </h2>
              <input
                name="email"
                onChange={handleChange}
                value={loginInfo.email}
                className="rounded w-full mt-1"
                type="text"
                placeholder="Correo Electronico" />
              {
                errorsForm.email ?
                  <p className="text-sm mt-2 text-red-500">{errorsForm.email}</p>
                  :
                  null
              }
            </div>

            <div className="my-12">
              <h2 className="text-gray-600 font-bold">
                Password
              </h2>
              <input
                name="password"
                value={loginInfo.password}
                onChange={handleChange}
                className="rounded w-full mt-1"
                type="password"
                placeholder="Password" />
              {
                errorsForm.password ?
                  <p className="text-sm mt-2 text-red-500">{errorsForm.password}</p>
                  :
                  null
              }
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-main px-4 py-2 rounded-xl text-white transition transform duration-500 hover:-translate-y-2 hover:bg-gray-100 hover:text-main hover:shadow-xl">
                Iniciar sesion
              </button>
            </div>

            <Link to={'/forgot-password'}>
              <p className="text-center mt-4 text-lg text-main hover:text-gray-800 transition duration-500">
                ¿He olvidado mi contraseña?
              </p>
            </Link>


            <p className="text-center mt-4 text-lg">
              ¿No tienes una cuenta? <Link to="/select-category" className="text-main hover:text-gray-800 transition duration-500"> Registrate </Link>
            </p>
          </form>
          <div className="hidden text-sm mt-auto absolute bottom-2 right-4">
            © 2019 <span className="text-main">Beneficio Si.</span> Todos los derechos reservados. Diseñado por Jeyver Vegas
          </div>
        </div>
      </div>
    </div>
  )

}


export default Login;