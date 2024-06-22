import { BiSolidUserVoice } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa6';
import { IoGameController } from 'react-icons/io5';
import { MdInsertChart } from 'react-icons/md';

function WhyNaoNow() {
  return (
    <section className="text-center">
      <h2 className="font-bold text-[64px] mb-16">Why Nao Now</h2>
      <div className="flex gap-10">
        <div className="flex flex-col items-center">
          <span className="bg-color-purple bg-opacity-10 p-4 block rounded-lg mb-6">
            <FaStar className="text-color-purple text-[32px]" />
          </span>{' '}
          <p className="font-semibold text-xl mb-3 h-[2lh]">
            Expertise Meets Excellence
          </p>
          <span>
            Our mentors are knowledgeable experts and distinguished educators,
            who serve as role models for our students
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="bg-color-purple bg-opacity-10 p-4 block rounded-lg mb-6">
            <BiSolidUserVoice className="text-color-purple text-[32px]" />
          </span>{' '}
          <p className="font-semibold text-xl mb-3 h-[2lh]">
            Speaking-Focused Curriculum
          </p>
          <span>
            Our goal is to engage students so deeply in interesting topics that
            they naturally begin to speak English
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="bg-color-purple bg-opacity-10 p-4 block rounded-lg mb-6">
            <IoGameController className="text-color-purple text-[32px]" />
          </span>{' '}
          <p className="font-semibold text-xl mb-3 h-[2lh]">
            Engagement Through Interactivity
          </p>
          <span>
            Our platform uses interactive simulations, games, and real-world
            scenarios to keep you engaged
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="bg-color-purple bg-opacity-10 p-4 block rounded-lg mb-6">
            <MdInsertChart className="text-color-purple text-[32px]" />
          </span>{' '}
          <p className="font-semibold text-xl mb-3 h-[2lh]">
            Real-time Progress Tracking
          </p>
          <span>
            With our intuitive dashboard, you can monitor your learning
            milestones and course completions in real-time
          </span>
        </div>
      </div>
    </section>
  );
}

export default WhyNaoNow;
