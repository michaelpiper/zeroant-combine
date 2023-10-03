import { type AdminConfig } from 'zeroant-common/config/admin.config';
import { type ActionRequest, type ResourceWithOptions, type ActionContext } from 'adminjs';
import { type DBPlugin } from 'zeroant-common/plugins/db.plugin';
export declare const makeNewHandler: (fields: string[]) => (request: ActionRequest, response: any, context: ActionContext) => Promise<{
    redirectUrl: string;
    notice: {
        message: string;
        type: string;
    };
    record: import("adminjs").RecordJSON;
} | {
    record: import("adminjs").RecordJSON;
    notice: {
        message: string;
        type: string;
    };
    redirectUrl?: undefined;
}>;
export declare const makeEditHandler: (fields: string[]) => (request: ActionRequest, response: any, context: ActionContext) => Promise<{
    record: import("adminjs").RecordJSON;
    redirectUrl?: undefined;
    notice?: undefined;
} | {
    redirectUrl: string;
    notice: {
        message: string;
        type: string;
    };
    record: import("adminjs").RecordJSON;
} | {
    record: import("adminjs").RecordJSON;
    notice: {
        message: string;
        type: string;
    };
    redirectUrl?: undefined;
}>;
export declare const makeResource: (config: AdminConfig, db: DBPlugin) => (name: string, { title, parent, actions, parentName, parentIcon, fields, showFields, editFields, listFields, filterFields }?: any) => ResourceWithOptions;
