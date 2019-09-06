import { Address, AddressKey, FormField } from '@bigcommerce/checkout-sdk';

import DynamicFormFieldType from './DynamicFormFieldType';

export type AddressFormValues = Pick<Address, Exclude<AddressKey, 'customFields'>> & {
    customFields: { [id: string]: any };
};

export default function mapAddressToFormValues(fields: FormField[], address?: Address): AddressFormValues {
    const values = ({
        ...fields.reduce(
            (addressFormValues, { name, custom, fieldType, default: defaultValue }) => {
                if (custom) {
                    if (!addressFormValues.customFields) {
                        addressFormValues.customFields = {};
                    }

                    const field = address &&
                        address.customFields &&
                        address.customFields.find(({ fieldId }) => fieldId === name);

                    const fieldValue = (field && field.fieldValue);

                    addressFormValues.customFields[name] = getValue(fieldType, fieldValue, defaultValue);

                    return addressFormValues;
                }

                if (isSystemAddressFieldName(name)) {
                    addressFormValues[name] = (address && address[name]) || '';
                }

                return addressFormValues;
            },
            {} as AddressFormValues
        ),
    });

    // Manually backfill stateOrProvince to avoid Formik warning (uncontrolled to controlled input)
    if (values.stateOrProvince === undefined) {
        values.stateOrProvince = '';
    }

    if (values.stateOrProvinceCode === undefined) {
        values.stateOrProvinceCode = '';
    }

    return values;
}

function getValue(fieldType?: string, fieldValue?: string | string[] | number, defaultValue?: string): string | string[] | number | Date {
    if (fieldValue === undefined || fieldValue === null) {
        return getDefaultValue(fieldType, defaultValue);
    }

    if (fieldType === DynamicFormFieldType.date && typeof fieldValue === 'string') {
        return new Date(fieldValue);
    }

    return fieldValue;
}

function getDefaultValue(fieldType?: string, defaultValue?: string): string | string[] | Date {
    if (defaultValue && fieldType === DynamicFormFieldType.date) {
        return new Date(defaultValue);
    }

    if (fieldType === DynamicFormFieldType.checkbox) {
        return [];
    }

    return defaultValue || '';
}

function isSystemAddressFieldName(fieldName: string): fieldName is Exclude<keyof Address, 'customFields'> {
    return fieldName !== 'customFields';
}