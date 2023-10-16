import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const Dropdown = ({
  icon,
  customIcon,
  className,
  items,
  onClick,
  badge,
  viewMore,
  maxCount,
  renderChild,
  popupClassName,
}) => {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(-1);
  const [isViewTotal, setIsViewTotal] = useState(false);
  const history = useHistory();
  const [filterItems, setFilterItems] = useState(items);

  useEffect(() => {
    if (isViewTotal) {
      setFilterItems(items);
    } else {
      setFilterItems(
        items.filter((item, index) => index < (maxCount ? maxCount : 1000)),
      );
    }
  }, [isViewTotal]);

  useEffect(() => {
    if (items) {
      items.forEach((item, index) => {
        if (item.href === history.location.pathname) setActive(index);
      });
    }
  }, [items]);

  return (
    <div className="dropdown">
      {typeof icon === 'string' ? (
        <img
          src={icon}
          alt=""
          className={className}
          onClick={() => (onClick ? onClick() : setVisible(!visible))}
        />
      ) : (
        customIcon(onClick, setVisible, visible)
      )}

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
                    className={`flex items-center justify-between p-[13px] font-semibold text-[15px] cursor-pointer ${
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
                    <span>{item.label}</span>
                    <span>
                      <img
                        className="w-[20px] h-auto"
                        src={
                          item.activeIcon && active === index
                            ? item.activeIcon
                            : item.icon
                        }
                        alt=""
                      />
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
