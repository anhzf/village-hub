import { ValidationRule } from 'quasar';

export const required: (fieldName?: string) => ValidationRule<string> = function (fieldName = 'Isian ini') {
  return (value) => (value ? true : `${fieldName} wajib diisi.`);
};
