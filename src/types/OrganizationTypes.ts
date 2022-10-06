export interface OrganizationType {
    id?: number,
    name: string,
    storageId: number,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export interface DirectoryType {
    id?: number,
    name: string,
    organizationId: number,
    indexes: DirectoryIndexType[],
    createdAt: Date,
    updatedAt: Date,
}

export interface DirectoryIndexType {
    id: number,
    name: string,
    type: 'number'|'string'|'boolean'|'list'|'datetime'|string,
    displayAs: null|string,
    notNullable: boolean,
    min: null|number,
    max: null|number,
    minLength: null|number,
    maxLength: null|number,
    regex: null|string,
    listValues: any
}