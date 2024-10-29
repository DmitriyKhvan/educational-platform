import { useAuth } from '@/app/providers/auth-provider';
import { TopMentorCard } from '@/entities/top-mentor-card';
import { useFindMatchesQuery } from '@/shared/apollo/mutations/matching/findMatches.generated';
import type { Mentor } from '@/types/types.generated';

export default function MentorMatchesList() {
  const { user } = useAuth();
  const { id: matchingId } = user?.matchingProfile || {};
  const { data } = useFindMatchesQuery({
    fetchPolicy: 'network-only',
    variables: {
      matchingProfileId: matchingId ?? '',
    },
  });

  return (
    <div className="max-w-[584px] mx-auto space-y-10">
      <h2 className="text-center text-[30px] font-bold leading-[120%]">
        Top mentor matches for you
      </h2>

      <div className="w-full flex justify-center flex-wrap gap-6">
        {data?.findMatches?.map((mentor) => {
          return <TopMentorCard key={mentor?.id} mentor={mentor as Mentor} />;
        })}
      </div>
    </div>
  );
}
