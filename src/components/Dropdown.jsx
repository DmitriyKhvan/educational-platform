import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const Dropdown = ({
  icon,
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
      <img
        src={icon}
        alt=""
        className={className}
        onClick={() => (onClick ? onClick() : setVisible(!visible))}
      />
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
                    to={item.href || '#'}
                    className={`menu-item ${active === index ? 'active' : ''}`}
                    onClick={() => {
                      setActive(index);
                      setVisible(false);
                      if (item.onClick) {
                        item.onClick(index);
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    <span className="icon">
                      <img
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
