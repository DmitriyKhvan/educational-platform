import { useState } from 'react';
import { FaPlay } from 'react-icons/fa6';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { PlaygroundRecordingModal } from 'src/components/PlaygroundRecordingModal';
import preview1 from 'src/shared/assets/images/samples/preview1.jpg';
import preview2 from 'src/shared/assets/images/samples/preview2.jpg';
import preview3 from 'src/shared/assets/images/samples/preview3.jpg';

function Reviews() {
  const [playerOpen, setPlayerOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(
    'https://info.naonow.com/hubfs/Jays%20Mom.mp4',
  );

  return (
    <>
      <AdaptiveDialog open={playerOpen} setOpen={setPlayerOpen}>
        <div className="md:min-w-[686px] min-h-[356px] flex items-center">
          <PlaygroundRecordingModal urlRecording={videoUrl} />
        </div>
      </AdaptiveDialog>
      <section>
        <h2 className="font-bold text-[64px] mb-16 text-center">Reviews</h2>
        <div className="flex gap-10">
          <div className="max-w-[400px]">
            <div
              className="mb-4 overflow-hidden rounded-xl relative hover:cursor-pointer group"
              onClick={() => {
                setPlayerOpen(true);
                setVideoUrl('https://info.naonow.com/hubfs/Jays%20Mom.mp4');
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
            <h3 className="text-2xl font-bold mb-3">Jay&apos;s Mom</h3>
            <p>
              «I like Nao Now as qualified mentors are delivering classes with
              so many different topics. My son was afraid of speaking in front
              of native speakers before, but after he met his mentor at Nao Now,
              he feels confident having conversations with any native speaker.»
            </p>
          </div>

          <div className="max-w-[400px]">
            <div
              className="mb-4 overflow-hidden rounded-xl relative hover:cursor-pointer group"
              onClick={() => {
                setPlayerOpen(true);
                setVideoUrl('https://info.naonow.com/hubfs/Julias%20Mom.mp4');
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
            <h3 className="text-2xl font-bold mb-3">Lee Sung Kyung</h3>
            <p>
              «I initially liked how natural the interaction between the teacher
              and the child was, and how the teacher paid attention and
              listened. I think the best part is that the child can talk about
              what they want to say.»
            </p>
          </div>

          <div className="max-w-[400px]">
            <div
              className="mb-4 overflow-hidden rounded-xl relative hover:cursor-pointer group"
              onClick={() => {
                setPlayerOpen(true);
                setVideoUrl(
                  'https://info.naonow.com/hubfs/Justins%20Mom%20Testimonial-2.mp4',
                );
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
            <h3 className="text-2xl font-bold mb-3">
              Justin & Riwoo&apos;s Mom
            </h3>
            <p>
              «I chose Nao Now because I felt that the teachers were paying
              attention to the children with interest and loving them a lot.
              When it&apos;s time for Nao Now, my children go to class so
              happily.»
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Reviews;
