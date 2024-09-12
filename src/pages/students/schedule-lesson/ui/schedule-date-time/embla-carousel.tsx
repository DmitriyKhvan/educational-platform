import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';

import { NextButton, PrevButton, usePrevNextButtons } from './embla-carousel-arrow-buttons';

import { WeekSlot } from './week-slot';
import type { WeekRanges } from './schedule-date-time';

type PropType = {
  slides: WeekRanges[];
  options?: EmblaOptionsType;
  generateWeekRanges: (count: number) => void;
};

export const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, generateWeekRanges } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { prevBtnDisabled, /*nextBtnDisabled,*/ onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  console.log('emblaApi', emblaApi?.selectedScrollSnap());

  const handleNextButtonClick = () => {
    if (!emblaApi) return;

    if (slides.length / 4 - emblaApi.selectedScrollSnap() === 1) {
      generateWeekRanges(4);
    }
    setTimeout(() => {
      onNextButtonClick();
    }, 500);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-2">
          {slides.map((slot, index) => (
            <div className="relative min-w-0 grow-0 shrink-0 basis-1/4 pl-2" key={slot.rangeStart}>
              <WeekSlot slot={slot} index={index} />
            </div>
          ))}
        </div>
      </div>

      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <NextButton onClick={handleNextButtonClick} /*disabled={nextBtnDisabled}*/ />
    </div>
  );
};
