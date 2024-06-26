import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from './EmblaCarouselArrowButtons';
import AutoScroll from 'embla-carousel-auto-scroll';

export const EmblaCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: false }),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="relative">
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">{slides}</div>
      </div>

      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />

      <div className="z-[1] absolute left-0 right-0 -bottom-6 flex items-center justify-center">
        {scrollSnaps.map((_, index) => (
          <DotButton
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
