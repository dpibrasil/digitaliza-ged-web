import { DirectoryIndexType, DirectoryType, OrganizationType } from "./OrganizationTypes"
import { UserType } from "./UserTypes"

export interface WorkingDocumentPageType
{
    id?: number,
    sequence: number,
    type: string,
    data: any
}

interface DocumentIndexType extends DirectoryIndexType {
	value: any
}
export interface DocumentType
{
	id: number,
	documentId: string,
	organizationId: number,
	directoryId: number,
	editorId: number,
	version: number,
	createdAt: Date,
	updatedAt: Date,
	indexes: DocumentIndexType[],
    organization: OrganizationType,
    directory: DirectoryType,
    editor: UserType
}