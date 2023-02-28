import { ReactNode } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../contexts/AuthContext";



const PrivateRouteEvents = (props) => {

  const { user } = useAuth();

  const { children, ...rest } = props;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user?.storeCategory.id === 2 || user?.storeCategory.id === 4 ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/dashboard?message=No puede ingresar en esa ruta.",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRouteEvents;