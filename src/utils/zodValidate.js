export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) throw result.error;
  return result.data;
}
