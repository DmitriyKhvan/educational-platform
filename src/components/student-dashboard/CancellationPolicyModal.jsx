import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft } from 'react-icons/fa6';
import { useAuth } from 'src/app/providers/AuthProvider';
import { Roles } from 'src/shared/constants/global';

const CancellationPolicyModal = ({ setTabIndex }) => {
  const { user } = useAuth();
  const [t] = useTranslation('modals');
  return (
    <div className="flex flex-col max-w-[410px] w-full mx-auto p-4">
      <h2 className="text-[22px] font-bold mb-6 justify-center relative flex items-center">
        <button className="absolute left-0 ms-0" onClick={() => setTabIndex(0)}>
          <FaChevronLeft className="w-5 h-5" />
        </button>
        Cancellation Policy
      </h2>
      {user?.role === Roles.STUDENT ? (
        <>
          <div className="font-normal text-sm mb-4">
            {t('cancellation_policy_1')}
          </div>
          <div className="font-normal text-sm mb-4">
            {t('cancellation_policy_2')}
          </div>
          <div className="font-normal text-sm mb-4">
            {t('cancellation_policy_3')}
          </div>
          <div className="font-normal text-sm mb-4">
            {t('cancellation_policy_4')}
          </div>
        </>
      ) : (
        <div className="space-y-5">
          <div>
            <h4>Lesson Cancellation Policies</h4>
            <ul className="list-disc pl-5">
              <li>Mentors can cancel up to 6 times in 6 months.</li>
              <li>One cancellation equates to one day of approved classes.</li>
              <li>
                Cancellations within 24 hours result in a strike and a fine.
              </li>
              <li>
                Cancellations outside 24 hours but within 2 weeks result in a
                strike without a fine.
              </li>
              <li>
                Cancellations outside 2 weeks will not incur a strike or fine.
              </li>
              <li>
                Exceeding 6 cancellations in 6 months leads to contract review
                and fines for each additional cancellation.
              </li>
            </ul>
          </div>

          <div>
            <h4>Last-Minute Cancellation Fines (within 24 hours)</h4>
            <p>$5 per 25-minute class / $10 per 50-minute class</p>
          </div>

          {/* <div>
            <h4>Mentor No Show Fines</h4>
            <p>$10 for a 25-minute class / $20 for a 50-minute class.</p>
          </div> */}

          <div>
            <h4>Lesson Feedback</h4>
            <ul className="list-disc pl-5">
              <li>
                Feedback submission within 12-23 hours: Fine equivalent to 25%
                of base pay.
              </li>
              <li>
                No feedback submission after 24 hours: No compensation for
                lesson.
              </li>
              <li>
                Accumulating three fines for missing feedback exceeding 24 hours
                within a month results in forfeiture of the ability to take on
                new students.
              </li>
              <li>
                Incomplete lesson trackers within 12 hours will result in a $2
                fine per lesson tracker.
              </li>
            </ul>
          </div>

          <div>
            <h4>Technical difficulties</h4>
            <ul className="list-disc pl-5">
              <li>
                If a mentor experiences technical difficulties for more than 5
                minutes at the start of class, they won&apos;t be compensated
                for the lesson.
              </li>
              <li>
                NAONOW will provide a free lesson for the student in such cases.
              </li>
            </ul>
          </div>

          {/* <div>
            <h4>Mentor Tardiness</h4>
            <ul className="list-disc pl-5">
              <li>
                If a mentor is late, they&apos;re expected to stay overtime and
                complete the full 25-50 minute lesson.
              </li>
              <li>
                At the 4-minute mark, the button to join the lesson will be
                disabled.
              </li>
              <li>
                Failure to join the lesson at this point is considered a mentor
                no-show, and fines will be applied accordingly.
              </li>
            </ul>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default CancellationPolicyModal;
