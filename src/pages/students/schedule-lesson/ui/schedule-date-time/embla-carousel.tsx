import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';

import { NextButton, PrevButton, usePrevNextButtons } from './embla-carousel-arrow-buttons';

import { WeekSlot } from './week-slot';
import type { WeekRanges } from './schedule-date-time';
import { useEffect, useState } from 'react';

type PropType = {
  slides: WeekRanges[];
  options?: EmblaOptionsType;
  generateWeekRanges: (count: number) => void;
};

export const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, generateWeekRanges } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [curMonth, setCurMonth] = useState(slides[0]?.rangeStart);

  const { prevBtnDisabled, /*nextBtnDisabled,*/ onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  console.log('emblaApi', emblaApi?.selectedScrollSnap());

  const handleNextButtonClick = () => {
    if (!emblaApi) return;

    if (slides.length / 4 - emblaApi.selectedScrollSnap() === 1) {
      generateWeekRanges(4);
    }

    setCurMonth(slides[(emblaApi.selectedScrollSnap() + 1) * 3].rangeStart);

    setTimeout(() => {
      onNextButtonClick();
    }, 500);
  };

  // useEffect(() => {
  //   if (emblaApi) {
  //     setCurMonth(slides[emblaApi.selectedScrollSnap() * 4].rangeStart);
  //   }
  // }, [emblaApi?.selectedScrollSnap()]);

  return (
    <div className="relative space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{curMonth}</h2>

        <div className="flex items-center gap-3">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={handleNextButtonClick} /*disabled={nextBtnDisabled}*/ />
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-2.5">
          {slides.map((slot, index) => (
            <div
              className="relative min-w-0 grow-0 shrink-0 basis-[28%] pl-2.5"
              key={slot.rangeStart}
            >
              <WeekSlot slot={slot} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
