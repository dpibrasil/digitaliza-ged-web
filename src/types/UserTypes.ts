import { OrganizationType } from "./OrganizationTypes";

export type UserTypes = 'super-admin'|'admin'|'operator'|'client'
export interface UserType {
    id: number,
    name: string,
    email: string,
    type: UserTypes,
    organization: OrganizationType
}