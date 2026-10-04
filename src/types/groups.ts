import type { AdminGroup, EditorGroup, UserGroup } from '@appartmint/tsm-types/groups';

export type { AdminGroup, EditorGroup, UserGroup };

export const adminGroups = ['admins', 'owners'] as const satisfies readonly AdminGroup[];
export const editorGroups = [...adminGroups, 'editors'] as const satisfies readonly EditorGroup[];
export const userGroups = ['users'] as const satisfies readonly UserGroup[];
