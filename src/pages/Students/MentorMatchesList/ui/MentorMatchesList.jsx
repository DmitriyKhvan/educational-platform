import { useQuery } from '@apollo/client';
import { useAuth } from 'src/app/providers/AuthProvider';
import { TopMentorCard } from 'src/entities/TopMentorCard';
import { FIND_MATCHES } from 'src/shared/apollo/mutations/matching/findMatches';

export default function MentorMatchesList() {
  const { user } = useAuth();
  const { id: matchingId } = user.matchingProfile || {};
  const { data } = useQuery(FIND_MATCHES, {
    fetchPolicy: 'network-only',
    variables: {
      matchingProfileId: matchingId,
    },
  });

  return (
    <div className="max-w-[584px] mx-auto space-y-10">
      <h2 className="text-center text-[30px] font-bold leading-[120%]">
        Top mentor matches for you
      </h2>

      <div className="w-full flex justify-center flex-wrap gap-6">
        {data?.findMatches?.map((mentor) => {
          return <TopMentorCard key={mentor.id} mentor={mentor} />;
        })}
      </div>
    </div>
  );
}
