import { componentLoader } from './component-loader.js';
import { URL } from 'url';
export const BASE_PATH = new URL('../../', import.meta.url).pathname.replace(/\/$/, '');
export const Components = {
    Dashboard: componentLoader.add('Dashboard', BASE_PATH + '/@admin/dashboard/dashboard.js', 'rootBundle'),
    SchemaPlayground: componentLoader.add('SchemaPlayground', BASE_PATH + '/@admin/dashboard/SchemaPlayground/SchemaPlayground/index.js', 'rootBundle'),
    SchemaEditor: componentLoader.add('SchemaEditor', BASE_PATH + '/@admin/dashboard/SchemaPlayground/SchemaEditor/index.js', 'rootBundle'),
    EditJSON: componentLoader.add('EditJSON', BASE_PATH + '/@admin/dashboard/EditJSON/EditJSON.js', 'rootBundle')
};
//# sourceMappingURL=components.js.map