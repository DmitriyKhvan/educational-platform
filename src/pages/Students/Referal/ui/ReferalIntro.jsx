import topLeft from 'src/shared/assets/images/samples/top-left.jpg';
import topMid from 'src/shared/assets/images/samples/top-mid.jpg';
import topRight from 'src/shared/assets/images/samples/top-right.jpg';
import botLeft from 'src/shared/assets/images/samples/bot-left.jpg';
import botMid from 'src/shared/assets/images/samples/bot-mid.jpg';
import botRight from 'src/shared/assets/images/samples/bot-right.jpg';

function ReferalIntro({ student }) {
  return (
    <section className="max-w-[768px] text-center space-y-6">
      <h1 className="font-bold text-[64px] leading-[73px] text-center">
        {student?.firstName ?? 'Friend'} invited you to try Nao Now for free!
      </h1>
      <p className="text-lg">
        {student?.firstName ?? 'Friend'} just gifted you our most generous free
        trial offer! Sign up on this page, and get{' '}
        <span className="text-color-purple font-medium">
          a free trial plus a 15% discount
        </span>{' '}
        on your first purchase.
      </p>
      <p className="text-lg italic">Offer available for new students only.</p>

      <div className="flex flex-wrap gap-6 mb-3">
        <img src={topLeft} alt="mentor" className="rounded-xl" />
        <img src={topMid} alt="mentor" className="rounded-xl" />
        <img src={topRight} alt="mentor" className="rounded-xl" />
        <img src={botLeft} alt="mentor" className="rounded-xl" />
        <img src={botMid} alt="mentor" className="rounded-xl" />
        <img src={botRight} alt="mentor" className="rounded-xl" />
      </div>
    </section>
  );
}

export default ReferalIntro;
