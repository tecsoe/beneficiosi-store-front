import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { isEmail, isRequired, validate } from "../helpers/formsValidations";
import SystemInfo from "../util/SystemInfo";
import { useAuth } from "../contexts/AuthContext";

const RenewPassword = () => {

    const location = useLocation();
    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [passwordRenewData, setPasswordRenewData] = useState({
        password: '',
        confirmPassword: '',
        token: '',
        email: ''
    });

    const [errorsForm, setErrorsForm] = useState({
        email: null,
        token: null,
        password: null,
        confirmPassword: null,
    });

    const [{ data, loading, error }, renewPassword] = useAxios({ url: `/auth/reset-store-password`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const email = params.get('email');
        const token = params.get('token');
        if (email && token) {
            setPasswordRenewData((oldPasswordRenewData) => {
                return {
                    ...oldPasswordRenewData,
                    email: email,
                    token: token
                }
            });
        }
    }, [location]);

    useEffect(() => {
        setErrorsForm({
            email: validate(passwordRenewData.email, [
                { validator: isRequired, errorMessage: "El email es obligatorio." },
                { validator: isEmail, errorMessage: "el email debe ser valido." }
            ]),
            confirmPassword: validate(passwordRenewData.confirmPassword, [
                { validator: isRequired, errorMessage: "La contraseña de confirmacion es obligatoria." },
            ]),
            token: validate(passwordRenewData.token, [
                { validator: isRequired, errorMessage: "El token es obligatorio." }
            ]),
            password: validate(passwordRenewData.password, [
                { validator: isRequired, errorMessage: "la contraseña es Obligatoria." },
            ])
        })
    }, [passwordRenewData])

    useEffect(() => {
        if (data !== undefined) {
            setCustomAlert?.({ show: true, message: `La contraseña ha sido renovada exitosamente.`, severity: "success" });
            history.push('/login');
        }
    }, [data]);

    useEffect(() => {
        setLoading?.({ show: loading, message: 'Cambiando contraseña' });
    }, [loading]);

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }
    }, [error]);

    const handleChange = (e) => {
        setPasswordRenewData((oldPasswordRenewData) => {
            return {
                ...oldPasswordRenewData,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        for (let errorName in errorsForm) {
            if (errorsForm[errorName] !== null) {
                alert(errorsForm[errorName]);
                return;
            }
        }
        renewPassword({ data: { ...passwordRenewData } })
    }

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit}>
                <div className="text-center space-y-8 text-gray-500">
                    <img src={SystemInfo.logo} className="h-16 w-16 m-auto" alt="" />

                    <h1 className="text-xl font-bold">
                        Por favor ingrese su nueva contraseña.
                    </h1>

                    <div>
                        <input
                            placeholder="Nueva contraseña"
                            type="password"
                            name="password"
                            className="rounded p-2 w-1/3 focus:ring-main focus:border-main"
                            value={passwordRenewData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Nueva contraseña"
                            type="password"
                            name="confirmPassword"
                            className="rounded p-2 w-1/3 focus:ring-main focus:border-main"
                            value={passwordRenewData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="px-8 py-2 bg-main text-white rounded">
                        Aceptar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RenewPassword;