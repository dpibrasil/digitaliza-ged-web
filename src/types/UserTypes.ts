export interface UserType {
    id: number,
    name: string,
    type: 'super-admin'|'admin'|'operator'|'client'
}