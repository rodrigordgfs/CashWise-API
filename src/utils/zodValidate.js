/**
 * Validates data against a Zod schema and returns the parsed result.
 *
 * Throws a validation error if the data does not conform to the schema.
 *
 * @param {import('zod').ZodType} schema - The Zod schema to validate against.
 * @param {*} data - The data to be validated.
 * @returns {*} The validated and parsed data.
 * @throws {import('zod').ZodError} If validation fails.
 */
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) throw result.error;
  return result.data;
}