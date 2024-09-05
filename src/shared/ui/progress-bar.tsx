import React from 'react';
import * as Progress from '@radix-ui/react-progress';

interface ProgressBarProps {
  percentage: number;
  bgIndicator: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, bgIndicator }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <Progress.Root
      className="relative overflow-hidden bg-gray-100 rounded-full w-full h-2"
      style={{
        // Fix overflow clipping in Safari
        // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
        transform: 'translateZ(0)',
      }}
      value={progress}
    >
      <Progress.Indicator
        className="w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)] rounded-full"
        style={{ transform: `translateX(-${100 - progress}%)`, background: bgIndicator }}
      />
    </Progress.Root>
  );
};

export default ProgressBar;
