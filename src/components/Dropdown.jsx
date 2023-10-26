import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';

// import { useOutsideClick } from 'src/utils/useOutsideClick';

const Dropdown = ({
  icon,
  label,
  className,
  items,
  onClick,
  badge,
  viewMore,
  maxCount,
  renderChild,
  popupClassName,
  showNotification,
}) => {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(-1);
  const [isViewTotal, setIsViewTotal] = useState(false);
  const history = useHistory();
  const [filterItems, setFilterItems] = useState(items);

  // const ref = useOutsideClick(() => setVisible(true));

  useEffect(() => {
    if (isViewTotal) {
      setFilterItems(items);
    } else {
      setFilterItems(
        items.filter((item, index) => index < (maxCount ? maxCount : 1000)),
      );
    }
  }, [isViewTotal, items]);

  useEffect(() => {
    if (items) {
      items.forEach((item, index) => {
        if (item.href === history.location.pathname) setActive(index);
      });
    }
  }, [items]);
  return (
    <div
      className={`dropdown ml-[20px] ${
        showNotification && items.length > 0 ? 'ws-notification-bell' : ''
      }`}
    >
      <div
        // ref={ref}
        onClick={() => (onClick ? onClick() : setVisible(!visible))}
        className="flex items-center cursor-pointer"
      >
        {typeof icon === 'string' ? (
          <img src={icon} alt="" className={className} />
        ) : (
          <div>{icon}</div> || null
        )}

        {label && (
          <>
            <span className="font-bold mr-[5px]">{label}</span>
            {visible ? (
              <FaAngleUp className="text-2xl" />
            ) : (
              <FaAngleDown className="text-2xl" />
            )}
          </>
        )}
      </div>

      {badge > 0 && <span className="badge">{badge}</span>}
      {visible && (
        <>
          <div className="background" onClick={() => setVisible(false)} />
          <div className={!popupClassName ? 'menu' : popupClassName}>
            {filterItems &&
              filterItems.map((item, index) =>
                renderChild ? (
                  renderChild(item, index, active, setActive, setVisible)
                ) : (
                  <Link
                    key={index}
                    to={item.href || '#'}
                    // className={`menu-item ${active === index ? 'active' : ''}`}
                    className={`flex items-center justify-between px-[15px] py-[7px] font-semibold text-[15px] cursor-pointer group transition ease-in-out delay-150 hover:bg-color-purple ${
                      active === index ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActive(index);
                      setVisible(false);
                      if (item.onClick) {
                        item.onClick(index);
                      }
                    }}
                  >
                    <span className="transition ease-in-out delay-150 group-hover:text-white">
                      {item.label}
                    </span>
                    <span>
                      {typeof item.activeIcon === 'string' ||
                      typeof item.icon === 'string' ? (
                        <img
                          className="w-[24px] h-auto"
                          src={
                            item.activeIcon && active === index
                              ? item.activeIcon
                              : item.icon
                          }
                          alt=""
                        />
                      ) : active === index ? (
                        item.customIconActive
                      ) : (
                        item.customIcon
                      )}
                    </span>
                  </Link>
                ),
              )}
            {viewMore && !isViewTotal && (
              <p className="view-more" onClick={() => setIsViewTotal(true)}>
                {viewMore}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
