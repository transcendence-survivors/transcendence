import { type Locale } from './routing';
import type { Metadata } from 'next';

const SITE_NAME = 'Transcendence Survivors';

const siteMetadata: Record<Locale, Metadata> = {
	fr: {
		title: SITE_NAME,
		description:
			"Le réseau social de survie ultime pour les passionnés de jeux vidéo et d'aventure.",
		keywords: [
			'reseau social',
			'communauté de joueurs',
			'aventure',
			'survie',
			'jeux vidéo',
			'partage de contenu',
			'interaction sociale',
			'gaming',
			'passionnés de jeux',
			'communauté en ligne',
			"partage d'expériences",
			'conseils de survie',
			'stratégies de jeu',
			'actualités du gaming',
			'événements de jeux vidéo',
			'groupes de discussion sur les jeux',
		],
		openGraph: {
			title: SITE_NAME,
			description:
				"Le réseau social de survie ultime pour les passionnés de jeux vidéo et d'aventure.",
			url: 'https://example.com/fr',
			siteName: SITE_NAME,
			type: 'website',
			images: [
				{
					url: 'https://example.com/static/og-image-fr.jpg',
					secureUrl: 'https://example.com/static/og-image-fr.jpg',
					width: 1200,
					height: 630,
					alt: 'Aperçu de Transcendence Survivors',
					type: 'image/jpg',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			site: '@transcendence_survivors',
			title: SITE_NAME,
			description:
				"Le réseau social de survie ultime pour les passionnés de jeux vidéo et d'aventure.",
			creator: '@transcendence_survivors',
			images: [
				{
					url: 'https://example.com/static/og-image-fr.jpg',
					alt: 'Aperçu de Transcendence Survivors',
					width: 1200,
					height: 630,
				},
			],
		},
	},
	en: {
		title: SITE_NAME,
		description:
			'The ultimate survival social network for gaming and adventure enthusiasts.',
		keywords: [
			'social network',
			'gaming community',
			'adventure',
			'survival',
			'video games',
			'content sharing',
			'social interaction',
			'gaming',
			'game enthusiasts',
			'online community',
			'sharing experiences',
			'survival tips',
			'game strategies',
			'gaming news',
			'video game events',
			'game discussion groups',
		],
		openGraph: {
			title: SITE_NAME,
			description:
				'The ultimate survival social network for gaming and adventure enthusiasts.',
			url: 'https://example.com/en',
			siteName: SITE_NAME,
			type: 'website',
			images: [
				{
					url: 'https://example.com/static/og-image-en.jpg',
					secureUrl: 'https://example.com/static/og-image-en.jpg',
					width: 1200,
					height: 630,
					alt: 'Preview of Transcendence Survivors',
					type: 'image/jpg',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			site: '@transcendence_survivors',
			title: SITE_NAME,
			description:
				'The ultimate survival social network for gaming and adventure enthusiasts.',
			creator: '@transcendence_survivors',
			images: [
				{
					url: 'https://example.com/static/og-image-en.jpg',
					alt: 'Preview of Transcendence Survivors',
				},
			],
		},
	},
	de: {
		title: SITE_NAME,
		description:
			'Das ultimative Überlebensnetzwerk für Gaming- und Abenteuer-Enthusiasten.',
		keywords: [
			'social network',
			'gaming community',
			'adventure',
			'survival',
			'video games',
			'content sharing',
			'social interaction',
			'gaming',
			'game enthusiasts',
			'online community',
			'sharing experiences',
			'survival tips',
			'game strategies',
			'gaming news',
			'video game events',
			'game discussion groups',
		],
		openGraph: {
			title: SITE_NAME,
			description:
				'Das ultimative Überlebensnetzwerk für Gaming- und Abenteuer-Enthusiasten.',
			url: 'https://example.com/de',
			siteName: SITE_NAME,
			type: 'website',
			images: [
				{
					url: 'https://example.com/static/og-image-de.jpg',
					secureUrl: 'https://example.com/static/og-image-de.jpg',
					width: 1200,
					height: 630,
					alt: 'Vorschau von Transcendence Survivors',
					type: 'image/jpg',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			site: '@transcendence_survivors',
			title: SITE_NAME,
			description:
				'Das ultimative Überlebensnetzwerk für Gaming- und Abenteuer-Enthusiasten.',
			creator: '@transcendence_survivors',
			images: [
				{
					url: 'https://example.com/static/og-image-de.jpg',
					alt: 'Vorschau von Transcendence Survivors',
				},
			],
		},
	},
};

export default siteMetadata;
