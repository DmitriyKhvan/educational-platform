/* eslint-disable no-unused-vars */

import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { Trans, useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import botLeft from 'src/shared/assets/images/samples/bot-left.jpg';
import botMid from 'src/shared/assets/images/samples/bot-mid.jpg';
import botRight from 'src/shared/assets/images/samples/bot-right.jpg';
import topLeft from 'src/shared/assets/images/samples/top-left.jpg';
import topMid from 'src/shared/assets/images/samples/top-mid.jpg';
import topRight from 'src/shared/assets/images/samples/top-right.jpg';

const imgs = [topLeft, topMid, topRight, botLeft, botMid, botRight];

function ReferalIntro({ student }) {
  const [t] = useTranslation('refer');

  const isTablet = useMediaQuery({ maxWidth: 812 });
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false,
      stopOnFocusIn: false,
      stopOnMouseEnter: false,
      speed: 1,
    }),
  ]);
  const [emblaRef2] = useEmblaCarousel({ loop: true }, [
    AutoScroll({
      playOnInit: true,
      direction: 'backward',
      stopOnInteraction: false,
      stopOnFocusIn: false,
      stopOnMouseEnter: false,
      speed: 1,
    }),
  ]);
  return (
    <section className="max-w-[768px] text-center space-y-6 mb-16 xl:mb-0">
      <h1 className="font-bold text-[36px] leading-[45px] md:text-[64px] md:leading-[73px] text-center px-5 sm:px-10">
        {t('friend_invited_you_to_naonow', {
          friend: student?.firstName ?? 'Friend',
        })}
      </h1>
      <p className="text-[15px] md:text-lg px-5 sm:px-10">
        <Trans
          t={t}
          i18nKey="friend_gifted_you_offer"
          values={{ friend: student?.firstName ?? 'Friend' }}
          components={{
            purple: <span className="text-color-purple font-medium" />,
          }}
        />
      </p>
      <p className="text-[15px] md:text-lg italic px-5 sm:px-10">
        {t('only_for_new_studs')}
      </p>

      <div
        className="overflow-hidden w-screen md:w-auto relative rounded-lg"
        ref={emblaRef}
      >
        <div className="flex touch-pan-y -ml-4">
          {imgs.map((url) => (
            <div
              className="relative min-w-0 grow-0 shrink-0 basis-1/2 sm:basis-1/3 pl-4"
              key={url}
            >
              <img src={url} alt="mentor" className="rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      <div
        className="overflow-hidden w-screen md:w-auto relative rounded-lg"
        ref={emblaRef2}
      >
        <div className="flex touch-pan-y -ml-4">
          {imgs.map((url) => (
            <div
              className="relative min-w-0 grow-0 shrink-0 basis-1/2 sm:basis-1/3 pl-4"
              key={url}
            >
              <img src={url} alt="mentor" className="rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* {isTablet ? <><div className="overflow-hidden w-screen relative" ref={emblaRef}>
				<div className="flex touch-pan-y -ml-4">
					{imgs.map((url) => (
						<div
							className="relative min-w-0 grow-0 shrink-0 basis-1/3 pl-4"
							key={url}
						>
							<img src={url} alt="mentor" className="rounded-xl" />
						</div>
					))}
				</div>
			</div>
			<div className="overflow-hidden w-screen relative" ref={emblaRef2}>
				<div className="flex touch-pan-y -ml-4">
					{imgs.map((url) => (
						<div
							className="relative min-w-0 grow-0 shrink-0 basis-1/3 pl-4"
							key={url}
						>
							<img src={url} alt="mentor" className="rounded-xl" />
						</div>
					))}
				</div>
			</div></> :<div className="flex flex-wrap gap-6 mb-3">
				<img src={topLeft} alt="mentor" className="rounded-xl" />
				<img src={topMid} alt="mentor" className="rounded-xl" />
				<img src={topRight} alt="mentor" className="rounded-xl" />
				<img src={botLeft} alt="mentor" className="rounded-xl" />
				<img src={botMid} alt="mentor" className="rounded-xl" />
				<img src={botRight} alt="mentor" className="rounded-xl" />
			</div>} */}
    </section>
  );
}

export default ReferalIntro;
