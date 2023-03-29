import type { Context } from '@lit-labs/context';

export type Registry = { p: string[] };
export const key = 'prism-registry' as Context<'prism-registry', Registry>;
