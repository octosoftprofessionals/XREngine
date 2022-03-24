import {UserId} from "./UserId";

export interface Organization {
  id: string
  name: string
  subdomain: string
  ownerId: string
}

export const OrganizationSeed: Organization = {
  id: '',
  name: '',
  subdomain: '',
  ownerId: ''
}
