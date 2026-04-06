import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

type FormFieldValue = string | number;

export interface CreateChangeHandlerOptions<T> {
  numericFields?: Array<keyof T>;
}

export const createChangeHandler = <T extends Record<string, FormFieldValue>>(
  setFormData: Dispatch<SetStateAction<T>>,
  options: CreateChangeHandlerOptions<T> = {},
) => {
  const numericFields = options.numericFields || [];

  return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof T;
    const shouldParseNumber = type === 'number' || numericFields.includes(fieldName);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: shouldParseNumber ? Number(value) : value,
    }));
  };
};