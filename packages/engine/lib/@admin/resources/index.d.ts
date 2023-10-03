import { type AdminConfig } from 'zeroant-common/config/admin.config';
import { type ResourceWithOptions } from 'adminjs';
import { type DBPlugin } from 'zeroant-common/plugins/db.plugin';
export declare const createResources: (config: AdminConfig, db: DBPlugin) => ResourceWithOptions[];
