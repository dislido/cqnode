export type JSONType = string | number | null | boolean | JSONType[] |  { [key: string]: JSONType };
export type JSONBaseType = string | number | null | boolean;
export type JSONObjectType = { [key: string]: JSONType };

export type OptionalPromisify<T> = T | Promise<T>;
