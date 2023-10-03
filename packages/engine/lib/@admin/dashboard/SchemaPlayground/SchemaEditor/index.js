import React from 'react';
import { flat } from 'adminjs';
import { FormGroup, FormMessage } from '@adminjs/design-system';
import { PropertyLabel } from '../../Components/PropertyLabel.js';
import { ReactJsonM } from '../../Components/ReactJsonM.js';
export const SchemaEditor = ({ filter, property, onChange, record, resource }) => {
    const [error, setError] = React.useState(record?.errors[property.path]);
    const [value, setValue] = React.useState();
    const validate = (value, valid) => {
        if (!valid) {
            setError({ type: 'invalid', message: 'Invalid JSON Document' });
            return;
        }
        setValue(value);
        setError(null);
    };
    React.useEffect(() => {
        setError(record?.errors[property.path]);
    }, [record?.errors[property.path]]);
    React.useEffect(() => {
        const json = flat.get(record?.params, property.path) ?? {};
        setValue(json);
    }, []);
    React.useEffect(() => {
        const json = JSON.stringify(value);
        onChange(property.path, json);
    }, [value]);
    const onEdit = (event) => {
        const updatedSrc = event?.jsObject;
        validate(updatedSrc, !event.error);
    };
    const onBlur = (event) => {
        const updatedSrc = event?.jsObject;
        validate(updatedSrc, !event.error);
    };
    return (React.createElement(FormGroup, { error: Boolean(error) },
        React.createElement(PropertyLabel, { property: property, filter: filter }),
        React.createElement(ReactJsonM, { width: "100%", placeholder: value, onBlur: onBlur, onChange: onEdit, height: "200px", theme: "light_mitsuketa_tribute" }),
        React.createElement(FormMessage, null, error?.message)));
};
export default SchemaEditor;
//# sourceMappingURL=index.js.map