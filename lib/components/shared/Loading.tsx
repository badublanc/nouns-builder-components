import loadingNoggles from '../../assets/loading-noggles.gif';

type Props = {};

function Loading({}: Props) {
	return (
		<div className="mx-auto w-full h-full flex items-center justify-center p-4 md:p-10">
			<img src={loadingNoggles} alt="loading" className="w-full max-w-[120px]" />
		</div>
	);
}

export default Loading;
