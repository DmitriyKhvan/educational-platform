import Indicator from '@/components/indicator';
import { LangLevelType } from '@/shared/constants/global';

const levelDict = {
  [LangLevelType.PRE_LEVEL]: 'bg-[#19BBFE] text-[#19BBFE] border border-[#19BBFE]',
  [LangLevelType.LEVEL_1]: 'bg-[#FF9335] text-[#FF9335] border border-[#FF9335]',
  [LangLevelType.LEVEL_2]: 'bg-[#FF5F4B] text-[#FF5F4B] border border-[#FF5F4B]',
  [LangLevelType.LEVEL_3]: 'bg-[#02C97E] text-[#02C97E] border border-[#02C97E]',
  [LangLevelType.LEVEL_4]: 'bg-[#E72EB3] text-[#E72EB3] border border-[#E72EB3]',
  [LangLevelType.LEVEL_5]: 'bg-[#862EE7] text-[#862EE7] border border-[#862EE7]',
};

const LevelBadge = ({ level }: { level: LangLevelType }) => {
  const color = levelDict[level];

  return <Indicator className={color}>{level}</Indicator>;
};

export default LevelBadge;
