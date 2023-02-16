import React from 'react';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';

type Props = {
	imageUrl: string;
	inCollectionList?: boolean;
};

function TokenImage({ imageUrl, inCollectionList }: Props) {
	const [isImageLoaded, setIsImageLoaded] = React.useState(false);
	const [isImageError, setIsImageError] = React.useState(false);

	return (
		<>
			<img
				src={imageUrl}
				style={isImageLoaded ? {} : { display: 'none' }}
				onLoad={() => setIsImageLoaded(true)}
				onError={() => setIsImageError(true)}
				className={cx(
					'rounded-md w-full',
					!inCollectionList && 'rounded-b-none !md:rounded-md !md:rounded-r-none'
				)}
				alt={`${name} token image`}
			/>

			{/* Show placeholder until image is loaded */}
			<div
				style={
					!isImageLoaded && !isImageError
						? { display: 'block', height: '100%' }
						: { display: 'none' }
				}
			>
				<Skeleton
					containerClassName="h-full w-full rounded-md rounded-b-none !md:rounded-md !md:rounded-r-none"
					className="aspect-square"
				/>
			</div>
		</>
	);
}

export default TokenImage;
