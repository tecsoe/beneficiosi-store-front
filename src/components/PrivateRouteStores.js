import { ReactNode } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../contexts/AuthContext";



const PrivateRouteStores = (props) => {

  const { user } = useAuth();

  const { children, ...rest } = props;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user?.storeCategory.id === 1 || user?.storeCategory.id === 3 || user?.storeCategory.id === 5 ? (
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

export default PrivateRouteStores;