type PageProps = {
	params: Promise<{ id: string; mediaId: string }>;
};

const Page = async ({ params }: PageProps) => {
	const { id, mediaId } = await params;
	return (
		<div>
			<h1>
				Media {mediaId} for Post {id}
			</h1>
			<p>
				This is the content of media {mediaId} for post {id}.
			</p>
		</div>
	);
};

export default Page;
