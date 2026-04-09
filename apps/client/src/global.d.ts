/* eslint-disable @typescript-eslint/no-empty-object-type */

import 'next-intl';

import messages from '@/messages/en/common.json';

type Messages = typeof messages;

declare module 'next-intl' {
	interface AppConfig {
		Messages: Messages;
	}
}

export {};
