import { OrganizationType } from "./OrganizationTypes";

export interface UserType {
    id: number,
    name: string,
    email: string,
    type: 'super-admin'|'admin'|'operator'|'client',
    organization: OrganizationType
}