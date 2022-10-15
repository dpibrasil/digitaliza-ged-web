import Dexie from 'dexie';
import { WorkingDocumentPageType } from '../types/DocumentTypes';
import { DirectoryIndexType, DirectoryType, OrganizationType } from '../types/OrganizationTypes';
import api from './api';

class Database extends Dexie {
    organizations!: Dexie.Table<OrganizationType, number>
    directories!: Dexie.Table<DirectoryType, number>
    directoryIndexes!: Dexie.Table<DirectoryIndexType, number>
    workingDocumentPages!: Dexie.Table<WorkingDocumentPageType, number>

    constructor () {
        super('digitalizav1')
        this.version(1).stores({
            organizations: 'id, name, storageId, isDeleted, createdAt, updatedAt',
            directories: 'id, name, organizationId, storageId, isDeleted, createdAt, updatedAt',
            directoryIndexes: 'id, name, type, displayAs, notNullable, min, max, minLength, maxLength, regex, createdAt, updatedAt',
            workingDocumentPages: '++id, sequency, type, data, url'
        })
    }

    async sync()
    {
        console.log('Sincronizando com servidor')
        await this.organizations.clear()
        const {data: organizations} = await api.get('/organizations')
        for (const organization of organizations) await this.organizations.put(organization, organization.id)

        await this.directories.clear()
        const {data: directories} = await api.get('/directories')
        for (const directory of directories) await this.directories.put(directory, directory.id)

        await this.directoryIndexes.clear()
        const {data: indexes} = await api.get('/directory-indexes')
        for (const index of indexes) await this.directoryIndexes.put(index, index.id)
    }
}

export default Database;