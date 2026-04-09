import I18nLink from '@components/customs/I18nLink';

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
	const { id } = await params;
	return (
		<div>
			<h1>Post {id}</h1>
			<p>This is the content of post {id}.</p>

			{Array(4)
				.fill(0)
				.map((_, i) => (
					<I18nLink
						key={'media-' + i}
						href='postIdMediaId'
						params={{ id, mediaId: (i + 1).toString() }}>
						View Media {i + 1}
					</I18nLink>
				))}
		</div>
	);
}
