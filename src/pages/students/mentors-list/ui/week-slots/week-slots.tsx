import useEmblaCarousel from 'embla-carousel-react';

import { NextButton, PrevButton, usePrevNextButtons } from './embla-carousel-arrow-buttons';
import { WeekSlot } from './week-slot';

export const WeekSlots = () => {
  const datesArray = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    datesArray.push(nextDate.toISOString());
  }

  console.log('datesArray', datesArray);

  const slides = Array.from(Array(7).keys());
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  return (
    <div className="flex items-end gap-3">
      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-3">
          {datesArray.map((date) => (
            <div
              className="relative min-w-0 grow-0 shrink-0 basis-full sm:basis-[14.2857143%] pl-3"
              key={date}
            >
              <WeekSlot date={date} />
            </div>
          ))}
        </div>
      </div>

      <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
    </div>
  );
};
