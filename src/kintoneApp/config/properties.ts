import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

type Properties<
  T extends KintoneFormFieldProperty.OneOf = KintoneFormFieldProperty.OneOf
> = Record<string, T>;

type BuiltinFieldProperty =
  | KintoneFormFieldProperty.RecordNumber
  | KintoneFormFieldProperty.Modifier
  | KintoneFormFieldProperty.UpdatedTime
  | KintoneFormFieldProperty.Creator
  | KintoneFormFieldProperty.CreatedTime;

type MetaFieldProperty =
  | KintoneFormFieldProperty.Category
  | KintoneFormFieldProperty.Status
  | KintoneFormFieldProperty.StatusAssignee;

type NormalFieldProperty = Exclude<
  KintoneFormFieldProperty.OneOf,
  BuiltinFieldProperty | MetaFieldProperty
>;

const isBuiltinFieldProperty = (
  fieldProperty: KintoneFormFieldProperty.OneOf
): fieldProperty is BuiltinFieldProperty => {
  const type = fieldProperty.type;
  return (
    type === "RECORD_NUMBER" ||
    type === "MODIFIER" ||
    type === "UPDATED_TIME" ||
    type === "CREATOR" ||
    type === "CREATED_TIME"
  );
};

const isMetaFieldProperty = (
  fieldProperty: KintoneFormFieldProperty.OneOf
): fieldProperty is MetaFieldProperty => {
  const type = fieldProperty.type;
  return type === "CATEGORY" || type === "STATUS" || type === "STATUS_ASSIGNEE";
};

const isNormalFieldProperty = (
  fieldProperty: KintoneFormFieldProperty.OneOf
): fieldProperty is NormalFieldProperty => {
  return (
    !isMetaFieldProperty(fieldProperty) &&
    !isBuiltinFieldProperty(fieldProperty)
  );
};

const categorizeFieldProperties = (properties: Properties) => {
  return Object.keys(properties).reduce<{
    normalFieldProperties: Properties<NormalFieldProperty>;
    builtinFieldProperties: Properties<BuiltinFieldProperty>;
    metaFieldProperties: Properties<MetaFieldProperty>;
  }>(
    (acc, fieldCode) => {
      const fieldProperty = properties[fieldCode];
      if (isMetaFieldProperty(fieldProperty)) {
        acc.metaFieldProperties[fieldCode] = fieldProperty;
        return acc;
      }
      if (isBuiltinFieldProperty(fieldProperty)) {
        acc.builtinFieldProperties[fieldCode] = fieldProperty;
        return acc;
      }
      if (isNormalFieldProperty(fieldProperty)) {
        acc.normalFieldProperties[fieldCode] = fieldProperty;
        return acc;
      }
      // exhaustive check
      const _check: never = fieldProperty;
      return _check;
    },
    {
      normalFieldProperties: {},
      builtinFieldProperties: {},
      metaFieldProperties: {},
    }
  );
};

const buildPropertiesToInitialize = ({
  currentProperties,
  newProperties,
}: {
  currentProperties: Properties;
  newProperties: Properties;
}) => {
  const {
    builtinFieldProperties: currentBuiltinFieldProperties,
  } = categorizeFieldProperties(currentProperties);
  const {
    builtinFieldProperties: newBuiltinFieldProperties,
    normalFieldProperties: propertiesForAdd,
  } = categorizeFieldProperties(newProperties);

  const propertiesForUpdate = Object.keys(newBuiltinFieldProperties).reduce<
    Properties<BuiltinFieldProperty>
  >((acc, fieldCode) => {
    const newFieldProperty = newBuiltinFieldProperties[fieldCode];
    const currentFieldCode = Object.values(currentBuiltinFieldProperties).find(
      (fieldProperty) => {
        return fieldProperty.type === newFieldProperty.type;
      }
    )?.code;
    if (currentFieldCode) {
      acc[currentFieldCode] = newFieldProperty;
      return acc;
    }
    return acc;
  }, {});
  return { propertiesForAdd, propertiesForUpdate };
};

export { Properties, buildPropertiesToInitialize };
