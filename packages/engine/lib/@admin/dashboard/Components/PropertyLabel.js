import { Label } from '@adminjs/design-system';
import React from 'react';
import { useTranslation, PropertyDescription } from 'adminjs';
export const PropertyLabel = (props) => {
    const { property, props: labelProps, filter = false } = props;
    const { translateProperty } = useTranslation();
    const PropertyDescription_ = PropertyDescription;
    if (property.hideLabel) {
        return null;
    }
    return (React.createElement(Label, { htmlFor: filter ? ['filter', property.path].join('-') : property.path, required: !filter && property.isRequired, ...labelProps },
        translateProperty(property.label, property.resourceId),
        property.description && React.createElement(PropertyDescription_, { property: property })));
};
export default PropertyLabel;
//# sourceMappingURL=PropertyLabel.js.map