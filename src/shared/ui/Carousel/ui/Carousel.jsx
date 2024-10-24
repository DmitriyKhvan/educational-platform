import useEmblaCarousel from 'embla-carousel-react';
<<<<<<<< HEAD:src/components/carousel/carousel.tsx
========
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from './EmblaCarouselArrowButtons';
import AutoScroll from 'embla-carousel-auto-scroll';
>>>>>>>> origin/mentor-profile:src/shared/ui/Carousel/ui/Carousel.jsx

import { CarouselCard } from '@/components/carousel/carousel-card';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from '@/components/carousel/embla-carousel-arrow-buttons';
import { DotButton, useDotButton } from '@/components/carousel/embla-carousel-dot-button';
import type { WeekRanges } from '@/pages/students/schedule-lesson/ui/schedule-date-time/schedule-date-time';
import type { OptionsType } from 'embla-carousel/components/Options';

export const EmblaCarousel = (props: {
  slides: WeekRanges[];
  options: Partial<OptionsType>;
}) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: false }),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  return (
    <div className="relative">
<<<<<<<< HEAD:src/components/carousel/carousel.tsx
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {slides.map((index) => (
            <div
              className="relative min-w-0 grow-0 shrink-0 basis-full sm:basis-1/2 pl-4"
              key={index?.rangeStart}
            >
              <CarouselCard />
            </div>
          ))}
        </div>
========
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">{slides}</div>
>>>>>>>> origin/mentor-profile:src/shared/ui/Carousel/ui/Carousel.jsx
      </div>

      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />

      <div className="z-[1] absolute left-0 right-0 -bottom-6 flex items-center justify-center">
        {scrollSnaps.map((_, index) => (
          <DotButton
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={'w-2 h-2 flex mx-3 after:content-[""] after:bg-[#EDEEF0] after:rounded-full after:w-full after:h-2'.concat(
              index === selectedIndex ? ' after:bg-color-purple' : '',
            )}
          />
        ))}
      </div>
    </div>
  );
};
