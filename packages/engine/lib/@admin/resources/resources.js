import { NotFoundError, paramConverter, populator } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
export const makeNewHandler = (fields) => async (request, response, context) => {
    const { resource, h, currentAdmin } = context;
    if (request.method === 'post') {
        if (![null, undefined].includes(request?.payload)) {
            fields.forEach((field) => {
                if (typeof request.payload[field] === 'string') {
                    request.payload[field] = JSON.parse(request.payload[field]);
                }
            });
        }
        const params = paramConverter.prepareParams(request.payload ?? {}, resource);
        let record = await resource.build(params);
        record = await record.create(context);
        const [populatedRecord] = await populator([record], context);
        context.record = populatedRecord;
        if (record.isValid()) {
            return {
                redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
                notice: {
                    message: 'successfullyCreated',
                    type: 'success'
                },
                record: record.toJSON(currentAdmin)
            };
        }
        const baseMessage = populatedRecord.baseError?.message || 'thereWereValidationErrors';
        return {
            record: record.toJSON(currentAdmin),
            notice: {
                message: baseMessage,
                type: 'error'
            }
        };
    }
    throw new Error('new action can be invoked only via `post` http method');
};
export const makeEditHandler = (fields) => async (request, response, context) => {
    if (![null, undefined].includes(request?.payload)) {
        fields.forEach((field) => {
            if (typeof request.payload[field] === 'string') {
                request.payload[field] = JSON.parse(request.payload[field]);
            }
        });
    }
    const { record, resource, currentAdmin, h } = context;
    if (record == null) {
        throw new NotFoundError([`Record of given id ("${request.params.recordId}") could not be found`].join('\n'), 'Action#handler');
    }
    if (request.method === 'get') {
        return {
            record: record.toJSON(currentAdmin)
        };
    }
    const params = paramConverter.prepareParams(request.payload ?? {}, resource);
    const newRecord = await record.update(params, context);
    const [populatedRecord] = await populator([newRecord], context);
    context.record = populatedRecord;
    if (record.isValid()) {
        return {
            redirectUrl: h.resourceUrl({
                resourceId: resource._decorated?.id() || resource.id()
            }),
            notice: {
                message: 'successfullyUpdated',
                type: 'success'
            },
            record: populatedRecord.toJSON(currentAdmin)
        };
    }
    const baseMessage = populatedRecord.baseError?.message || 'thereWereValidationErrors';
    return {
        record: populatedRecord.toJSON(currentAdmin),
        notice: {
            message: baseMessage,
            type: 'error'
        }
    };
};
export const makeResource = (config, db) => (name, { title, parent, actions, parentName, parentIcon, fields = {}, showFields = [], editFields = [], listFields = [], filterFields = [] } = {}) => {
    const properties = {};
    if (Object.keys(fields).length > 0) {
        Object.keys(fields).forEach((field) => {
            properties[field] = {
                type: typeof fields[field]?.type === 'string' ? fields[field].type : undefined,
                isTitle: typeof title === 'string' ? field === title : undefined,
                components: typeof fields[field]?.components === 'object' ? fields[field]?.components : undefined,
                props: typeof fields[field]?.props === 'object' ? fields[field]?.props : undefined,
                isVisible: {
                    show: showFields.includes(field),
                    edit: editFields.includes(field),
                    filter: filterFields.includes(field),
                    list: listFields.includes(field)
                }
            };
        });
    }
    return {
        resource: {
            model: getModelByName(name),
            client: db.repositories
        },
        options: parent ?? {
            parent: {
                name: parentName ?? '',
                icon: parentIcon ?? ''
            },
            actions,
            properties
        }
    };
};
//# sourceMappingURL=resources.js.map