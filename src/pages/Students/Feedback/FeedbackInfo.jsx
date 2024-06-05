import { Avatar } from 'src/widgets/Avatar/Avatar';

function FeedbackInfo({ data }) {
  return (
    <div className="mt-6 p-6 border border-color-dashboard-bg rounded-xl shadow-[0px_0px_16px_0px_#00000014]">
      <div className="flex items-center mb-6 text-color-dark-violet font-bold">
        <div className="w-[48px] h-[48px] rounded-full overflow-hidden  mr-3">
          <Avatar avatarUrl={data?.mentor?.avatar?.url} />
        </div>
        {data?.mentor?.firstName}{' '}
        {data?.mentor?.lastName && `${data?.mentor?.lastName[0]}.`}
      </div>
      <div className="mb-4">
        <p className="text-color-light-grey text-sm mb-2">Summary of lesson</p>
        <p>
          Great job today! I can see that you&apos;re putting a lot of effort
          into your English lessons. Your enthusiasm is wonderful, and it&apos;s
          clear that you enjoy learning.
        </p>
      </div>

      <div className="mb-4">
        <p className="text-color-light-grey text-sm mb-2">Vocabulary</p>
        <ul className="list-disc list-inside">
          <li>Statue</li>
          <li>Statue</li>
          <li>Statue</li>
          <li>Statue</li>
        </ul>
      </div>
    </div>
  );
}

export default FeedbackInfo;
