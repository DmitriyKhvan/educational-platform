
import ReactPlayer from "react-player/file";

export const PlaygroundRecordingModal = ({
	urlRecording,
	width = "100%",
	autoPlay,
}: {
	urlRecording: string;
	width?: string;
	autoPlay?: boolean;
}) => {
	return (
		<div
			className={`max-w-[${
				width === "100%" ? "456px" : width
			}] w-full mx-auto overflow-hidden rounded-lg mb-6 bg-gray-500 aspect-video`}
		>
			<ReactPlayer
				light={!autoPlay}
				url={urlRecording}
				playing
				controls
				volume={0.8}
				width={width}
				height="100%"
			/>
		</div>
	);
};
