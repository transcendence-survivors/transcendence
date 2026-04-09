import I18nLink from '@components/customs/I18nLink';

const Page = () => {
	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-4'>Posts</h1>
			<p className='text-foreground'>This is the posts page.</p>
			<div className='space-y-4'>
				{Array.from({ length: 5 }, (_, i) => (
					<div key={`i18n-${i}`} className='p-4 border rounded-md'>
						<I18nLink
							href='postId'
							params={{
								id: (i + 1).toString(),
							}}>
							<h2 className='text-xl font-semibold mb-2'>Post {i + 1}</h2>
							<p>This is the content of post {i + 1}.</p>
						</I18nLink>
					</div>
				))}
			</div>
		</div>
	);
};

export default Page;
