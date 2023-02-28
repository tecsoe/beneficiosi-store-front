import { Redirect, Route } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = (props) => {

    let { user } = useAuth();

    const { children, ...rest } = props;

    return (
        <Route {...rest} render={({ location }) =>
            user ?
                (
                    <Redirect
                        to={{
                            pathname: "/dashboard",
                            state: { from: location }
                        }}
                    />
                )
                :
                (
                    children
                )}
        />
    );
}

export default PublicRoute;