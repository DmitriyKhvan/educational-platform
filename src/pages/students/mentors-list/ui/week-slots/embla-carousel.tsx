import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';

import { NextButton, PrevButton, usePrevNextButtons } from './embla-carousel-arrow-buttons';
import { WeekSlot } from './week-slot';
import type { GroupedAvailabilitySlots } from '@/types/types.generated';

type PropType = {
  slides: string[];
  slots: GroupedAvailabilitySlots[];
  options?: EmblaOptionsType;
  nextWeekSlots: (count: number) => void;
};

export const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, slots, options, nextWeekSlots } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { prevBtnDisabled, /*nextBtnDisabled,*/ onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  console.log('emblaApi', emblaApi?.selectedScrollSnap());

  const handleNextButtonClick = async () => {
    if (!emblaApi) return;

    const currentSlideIdx = emblaApi.selectedScrollSnap();
    if (slides.length / 7 - currentSlideIdx === 1) {
      await nextWeekSlots(currentSlideIdx + 2);
    }
    setTimeout(() => {
      onNextButtonClick();
    }, 100);
  };

  return (
    <div className="relative w-[1048px] px-[50px]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-2">
          {slides.map((date) => (
            <div
              className="relative min-w-0 grow-0 shrink-0 basis-full sm:basis-[14.2857143%] pl-2"
              key={date}
            >
              <WeekSlot date={date} slots={slots} />
            </div>
          ))}
        </div>
      </div>

      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <NextButton onClick={handleNextButtonClick} /*disabled={nextBtnDisabled}*/ />
    </div>
  );
};
