import type { MessageKeys } from '@i18n/types';

const PREFIX_KEY = 'forms.error' as const;

export const FORM_ERRORS = {
	required: `${PREFIX_KEY}.required`,
	type: `${PREFIX_KEY}.invalidType`,
	minLength: `${PREFIX_KEY}.minLength`,
	maxLength: `${PREFIX_KEY}.maxLength`,
	invalidEmail: `${PREFIX_KEY}.invalidEmail`,
	select: `${PREFIX_KEY}.select`,
	mustAcceptTerms: `${PREFIX_KEY}.mustAcceptTerms`,
} as const satisfies Record<string, MessageKeys>;
