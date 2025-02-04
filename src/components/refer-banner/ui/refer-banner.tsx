import Button from '@/components/form/button';

import { Info } from '@/components/refer-banner/ui/info';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';

export const ReferBanner = () => {
  return (
    <div className="w-full rounded-lg p-[22px] bg-[#19BBFE] bg-[url('@/shared/assets/images/referBanner.png'),_url('@/shared/assets/images/LogoBg.svg')] bg-[position:right_20px_center,_right_center] bg-[length:auto_100%] bg-no-repeat">
      <h2 className="text-2xl font-bold text-white">Invite friends!</h2>
      <h4 className="text-sm text-white mt-2">
        And get <span className="text-[#E7E02E] font-semibold">FREE CLASSES</span>
      </h4>

      <AdaptiveDialog
        classNameDrawer="max-h-[97%]"
        button={
          <Button theme="dark_purple" className="h-10 px-4 mt-4">
            <span className="text-[13px] font-medium">Learn more</span>
          </Button>
        }
      >
        <Info />
      </AdaptiveDialog>
    </div>
  );
};
