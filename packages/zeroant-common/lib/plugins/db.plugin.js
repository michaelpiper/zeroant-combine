import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { DBConfig } from '../config/db.config.js';
import { PrismaClient } from '@prisma/client';
export class DBPlugin extends AddonPlugin {
    _dataSource;
    async initialize() {
        const prisma = new PrismaClient();
        this._dataSource = prisma;
    }
    get repositories() {
        return this._dataSource;
    }
    repository(repository) {
        return this.repositories[repository];
    }
    call(repository) {
        return this.repository(repository);
    }
    clone() {
        const options = this.context.config.addons.get(DBConfig).options;
        const dataSource = new PrismaClient(options);
        return dataSource;
    }
    destroy() {
        const prisma = this._dataSource;
        prisma.$disconnect().catch((e) => this.context.log.info(e));
    }
    close() {
        this.destroy();
    }
}
//# sourceMappingURL=db.plugin.js.map