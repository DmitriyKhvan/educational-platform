import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';

import { NextButton, PrevButton, usePrevNextButtons } from './embla-carousel-arrow-buttons';

import { WeekSlot } from './week-slot';
import type { WeekRanges } from './schedule-date-time';
import { useState } from 'react';
import { format } from 'date-fns-tz';
import { useAuth } from '@/app/providers/auth-provider';

type PropType = {
  slides: WeekRanges[];
  options?: EmblaOptionsType;
  generateWeekRanges: (count: number) => void;
  fetchAvailabilitySlots: (rangeStart: string, rangeEnd: string) => void;
};

export const EmblaCarousel: React.FC<PropType> = (props) => {
  const { user } = useAuth();
  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { slides, options, generateWeekRanges, fetchAvailabilitySlots } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [curMonth, setCurMonth] = useState(
    format(new Date(), 'yyyy-MM-dd', { timeZone: userTimezone }),
  );
  const [activeRangeDate, setActiveRangeDate] = useState<WeekRanges>();

  const { prevBtnDisabled, /*nextBtnDisabled,*/ onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

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

  const handlePrevButtonClick = () => {
    if (!emblaApi) return;

    setCurMonth(slides[(emblaApi.selectedScrollSnap() - 1) * 3].rangeStart);
    onPrevButtonClick();
  };

  const selectRangeDate = (slot: WeekRanges) => {
    setActiveRangeDate(slot);
    fetchAvailabilitySlots(slot.rangeStart, slot.rangeEnd);
  };

  return (
    <div className="relative space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{format(new Date(curMonth), 'MMMM yyyy')}</h2>

        <div className="flex items-center gap-3">
          <PrevButton onClick={handlePrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={handleNextButtonClick} /*disabled={nextBtnDisabled}*/ />
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-2.5">
          {slides.map((slot, index) => (
            <button
              type="button"
              onClick={() => selectRangeDate(slot)}
              className="relative min-w-0 grow-0 shrink-0 basis-[28%] pl-2.5"
              key={slot.rangeStart}
            >
              <WeekSlot
                slot={slot}
                index={index}
                active={activeRangeDate?.rangeStart === slot.rangeStart}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="h-1 bg-gray-50 -mx-5" />
    </div>
  );
};
