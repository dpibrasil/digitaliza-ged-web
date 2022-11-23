import Dexie from 'dexie';
import { DocumentQueueType, WorkingDocumentPageType } from '../types/DocumentTypes';
import { DirectoryIndexType, DirectoryType, OrganizationType } from '../types/OrganizationTypes';
import api from './api';

class Database extends Dexie {
    organizations!: Dexie.Table<OrganizationType, number>
    directories!: Dexie.Table<DirectoryType, number>
    directoryIndexes!: Dexie.Table<DirectoryIndexType, number>
    workingDocumentPages!: Dexie.Table<WorkingDocumentPageType, number>
    documentsQueue!: Dexie.Table<DocumentQueueType, number>

    constructor () {
        super('digitaliza')
        this.version(1).stores({
            organizations: 'id, name, storageId, isDeleted, createdAt, updatedAt',
            directories: 'id, directoryId, name, organizationId, storageId, isDeleted, createdAt, updatedAt',
            directoryIndexes: 'id, name, type, displayAs, notNullable, min, max, minLength, maxLength, regex, createdAt, updatedAt',
            workingDocumentPages: '++id, sequency, type, data, url',
            documentsQueue: '++id, documentId, directoryId, data, indexes, synced, fail, createdAt, lastSync'
        })
    }

    async sync()
    {
        console.log('Sincronizando com servidor')
        const {data: organizations} = await api.get('/organizations')
        await this.organizations.clear()
        for (const organization of organizations) await this.organizations.put(organization, organization.id)

        const {data: directories} = await api.get('/directories')
        await this.directories.clear()
        for (const directory of directories) await this.directories.put(directory, directory.id)

        const {data: indexes} = await api.get('/directory-indexes')
        await this.directoryIndexes.clear()
        for (const index of indexes) await this.directoryIndexes.put(index, index.id)
    }
}

export default Database;