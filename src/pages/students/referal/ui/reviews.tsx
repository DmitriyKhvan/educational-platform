import { PlaygroundRecordingModal } from "@/components/playground-recording-modal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlay } from "react-icons/fa6";
import preview1 from "@/shared/assets/images/samples/preview1.jpg";
import preview2 from "@/shared/assets/images/samples/preview2.jpg";
import preview3 from "@/shared/assets/images/samples/preview3.jpg";
import { AdaptiveDialog } from "@/shared/ui/adaptive-dialog";

const videoUrls = [
	"https://info.naonow.com/hubfs/Jays%20Mom.mp4",
	"https://info.naonow.com/hubfs/Julias%20Mom.mp4",
	"https://info.naonow.com/hubfs/Justins%20Mom%20Testimonial-2.mp4",
];

function Reviews() {
	const [t] = useTranslation("refer");
	const [playerOpen, setPlayerOpen] = useState(false);
	const [videoUrl, setVideoUrl] = useState(videoUrls[0]);

	return (
		<>
			<AdaptiveDialog open={playerOpen} setOpen={setPlayerOpen}>
				<div className="md:min-w-[686px] min-h-[356px] flex items-center">
					<PlaygroundRecordingModal urlRecording={videoUrl} autoPlay={true} />
				</div>
			</AdaptiveDialog>
			<section className="mx-5">
				<h2 className="font-bold text-[36px] md:text-[64px] mb-16 text-center">
					{t("reviews")}
				</h2>
				<div className="flex flex-col items-center space-y-[70px] lg:space-y-0 lg:items-start lg:flex-row lg:justify-between gap-2">
					<div className="max-w-[400px] basis-1/3">
						<div
							className="mb-4 overflow-hidden rounded-xl relative hover:cursor-pointer group"
							onClick={() => {
								setPlayerOpen(true);
								setVideoUrl(videoUrls[0]);
							}}
						>
							<img
								src={preview1}
								alt="preview"
								className="group-hover:brightness-75 transition-all"
							/>
							<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-color-purple rounded-full flex justify-center items-center">
								<FaPlay className=" text-white text-lg" />
							</span>
						</div>
						<h3 className="text-2xl font-bold mb-3">{t("review_title_1")}</h3>
						<p>{t("review_text_1")}</p>
					</div>

					<div className="max-w-[400px] basis-1/3">
						<div
							className="mb-4 overflow-hidden rounded-xl relative hover:cursor-pointer group"
							onClick={() => {
								setPlayerOpen(true);
								setVideoUrl(videoUrls[1]);
							}}
						>
							<img
								src={preview2}
								alt="preview"
								className="group-hover:brightness-75 transition-all"
							/>
							<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-color-purple rounded-full flex justify-center items-center">
								<FaPlay className=" text-white text-lg" />
							</span>
						</div>
						<h3 className="text-2xl font-bold mb-3">{t("review_title_2")}</h3>
						<p>{t("review_text_2")}</p>
					</div>

					<div className="max-w-[400px] basis-1/3">
						<div
							className="mb-4 overflow-hidden rounded-xl relative hover:cursor-pointer group"
							onClick={() => {
								setPlayerOpen(true);
								setVideoUrl(videoUrls[2]);
							}}
						>
							<img
								src={preview3}
								alt="preview"
								className="group-hover:brightness-75 transition-all"
							/>
							<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-color-purple rounded-full flex justify-center items-center">
								<FaPlay className=" text-white text-lg" />
							</span>
						</div>
						<h3 className="text-2xl font-bold mb-3">{t("review_title_3")}</h3>
						<p>{t("review_text_3")}</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default Reviews;
