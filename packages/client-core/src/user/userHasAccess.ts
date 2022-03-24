import { accessAuthState, useAuthState } from './services/AuthService'

export const userHasAccessHook = (scope: string) => {
  const hasScope = useAuthState().user?.scopes?.value?.find((r) => r.type === scope)
  const isAdmin = useAuthState().user?.userRole?.value === 'admin'
  return Boolean(hasScope || isAdmin)
}

export const userHasAccess = (scope: string, host: string) => {
  const organization = accessAuthState().organization.value
  const hasScope = accessAuthState().user?.scopes?.value?.find((r) => r.type === scope && r.organizationId === organization.id)
  const isAdmin = accessAuthState().user?.userRole?.value === 'admin'
  return Boolean(hasScope || isAdmin)
}
