import validator from '@rjsf/validator-ajv8';
import React from 'react';
import Form from '@rjsf/mui';
import { Box, Label, TextArea } from '@adminjs/design-system';
import { flat } from 'adminjs';
import _ from 'lodash';
const log = (type) => console.log.bind(console, type);
const Fa = Form;
const getDef = (definitions) => {
    if (typeof definitions === 'object' && definitions != null) {
        const newDef = Object.entries(definitions).map(([key, definition]) => {
            return [key, _.omit(definition, ['$src'])];
        });
        return Object.fromEntries(newDef);
    }
};
const SchemaPlayground = (props) => {
    const { record } = props;
    const { definitions, ...form } = flat.get(record.params, 'service_schema_form') ?? {};
    const [uiSchema, setUiSchema] = React.useState(flat.get(record.params, 'service_schema_ui'));
    const [schema, setSchema] = React.useState({ ...form, definitions: getDef(definitions) });
    const [data, setData] = React.useState(flat.get(record.params, 'service_schema_formdata'));
    React.useEffect(() => {
        if (typeof definitions === 'object' && definitions != null) {
            void Promise.all(Object.entries(definitions).map(async ([key, definition]) => [
                key,
                typeof definition === 'object' && definition?.$src != null
                    ? await fetch(definition.$src)
                        .then(async (r) => await r.json())
                        .catch(() => _.omit(definition, ['$src']))
                    : definition
            ])).then((newDef) => {
                setSchema((schema) => ({ ...schema, definitions: Object.fromEntries(newDef) }));
            });
        }
    }, []);
    return (React.createElement(Box, { display: 'flex', height: '100%', padding: '2rem', flex: '1' },
        React.createElement(Box, { display: 'flex', width: '100%', paddingRight: '1rem', flexDirection: 'column' },
            React.createElement(Box, { display: 'flex', width: '100%', height: '50%', flexDirection: 'column' },
                React.createElement(Label, { paddingTop: '0.2rem' }, "Form Schema"),
                React.createElement(TextArea, { style: { resize: 'none' }, readOnly: true, disabled: true, height: '50%', onChange: (e) => {
                        setSchema(JSON.parse(e.target.value));
                    }, value: JSON.stringify(schema, null, 2) })),
            React.createElement(Box, { display: 'flex', width: '100%', height: '50%', paddingTop: '0.4rem' },
                React.createElement(Box, { display: 'flex', width: '100%', flexDirection: 'column', paddingRight: '0.1rem' },
                    React.createElement(Label, null, "UI Schema"),
                    React.createElement(TextArea, { style: { resize: 'none' }, readOnly: true, disabled: true, height: '100%', onChange: (e) => {
                            setUiSchema(JSON.parse(e.target.value));
                        }, value: JSON.stringify(uiSchema, null, 2) })),
                React.createElement(Box, { display: 'flex', width: '100%', flexDirection: 'column', paddingLeft: '0.1rem' },
                    React.createElement(Label, null, "Form Data"),
                    React.createElement(TextArea, { style: { resize: 'none' }, readOnly: true, disabled: true, height: '100%', onChange: (e) => {
                            setData(JSON.parse(e.target.value));
                        }, value: JSON.stringify(data, null, 2) })))),
        React.createElement(Box, { display: 'flex', width: '100%' },
            React.createElement(Fa, { schema: schema, uiSchema: uiSchema, formData: data, validator: validator, onChange: (form) => {
                    log('changed').call(form.formData);
                    setData(form.formData);
                }, onSubmit: log('submitted'), onError: log('errors') }))));
};
export default SchemaPlayground;
//# sourceMappingURL=index.js.map