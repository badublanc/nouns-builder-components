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
					'nbc-w-full nbc-rounded-md',
					!inCollectionList && '!md:nbc-rounded-md !md:nbc-rounded-r-none nbc-rounded-b-none'
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
					containerClassName="nbc-h-full nbc-w-full nbc-rounded-md nbc-rounded-b-none !md:nbc-rounded-md !md:nbc-rounded-r-none"
					className="nbc-aspect-square"
				/>
			</div>
		</>
	);
}

export default TokenImage;
