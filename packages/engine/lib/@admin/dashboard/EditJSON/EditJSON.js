import * as React from 'react';
import { FormGroup } from '@adminjs/design-system';
import * as _ from 'lodash';
import { unflatten } from 'flat';
import { PropertyLabel } from '../Components/PropertyLabel.js';
import { ReactJsonM } from '../Components/ReactJsonM.js';
const getParameterObject = (object, property) => {
    if (typeof object?.[property.name] === 'string') {
        try {
            return JSON.parse(object?.[property.name]);
        }
        catch (_) {
            return object?.[property.name];
        }
    }
    else {
        return object?.[property.name];
    }
};
const EditJSON = (props) => {
    const { property, record, onChange, filter } = props;
    const matchingParams = _.chain(record.params)
        .omitBy(_.isNil)
        .pickBy((value, key) => key.startsWith(property.name))
        .value();
    const object = unflatten(matchingParams);
    const [paramObject] = React.useState(getParameterObject(object, property));
    const saveData = (data) => {
        console.log('saveData', data);
        onChange(property.name, data);
    };
    const onEdit = (event) => {
        const updatedSrc = event?.jsObject;
        saveData(updatedSrc);
    };
    return (React.createElement(FormGroup, { error: Boolean(record?.errors[property.path]) },
        React.createElement(PropertyLabel, { property: property, filter: filter }),
        React.createElement(ReactJsonM, { placeholder: paramObject, onChange: onEdit, width: "100%", height: "200px", theme: "light_mitsuketa_tribute" })));
};
export default EditJSON;
//# sourceMappingURL=EditJSON.js.map