import React from 'react'
import { Redirect, Route } from 'react-router'

import Dashboard from './user/components/Dashboard/Dashboard'
import {useAuthState} from "./user/services/AuthService";

const PrivateRoute = ({ scope: scope, component: Component, ...rest }) => {
  const admin = useAuthState().user
  const organization = useAuthState().organization
  const scopes = admin?.scopes?.value || []
  const readScope = scopes.find(s => s.type === `${scope}:read` && s.organizationId === organization.id.value)
  return (
    readScope ?
    <Route
      {...rest}
      render={(props) => (
        <Dashboard>
          <Component {...props} />
        </Dashboard>
      )}
    /> : admin?.id?.value?.length === 0 ? <div/> :
    <Redirect to={{ pathname: '/login', state: { from: '/admin' } }} />
  )
}

export default PrivateRoute
