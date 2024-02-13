import React from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, subtitle, children, hrefTo }) => {
  return (
    <section className="bg-white w-full shadow-sm p-5 sm:p-6 sm:rounded-xl mx-auto sm:max-w-[524px]">
      <div className="flex justify-between mb-6">
        <div>
          <h4 className="text-2xl font-bold tracking-tight mb-3 text-color-dark-purple">
            {title}
          </h4>
          <p className="text-[15px] text-color-light-grey tracking-tight">
            {subtitle}
          </p>
        </div>

        {hrefTo && (
          <Link
            to={hrefTo}
            className="text-color-purple font-medium flex items-center gap-1"
          >
            View All <FaChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
};

export default DashboardCard;
