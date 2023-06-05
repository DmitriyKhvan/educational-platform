import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MultipleToggle = ({ label, items, defaultActiveIndex, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(
    defaultActiveIndex !== undefined ? defaultActiveIndex : -1,
  );
  const [t] = useTranslation('common');

  const onClick = (index) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
    onChange && onChange(index);
  };

  return (
    <div className="multiple-toggle">
      {label && <label>{label}</label>}
      <div>
        {items.map((item, index) => (
          <div
            className={`item ${index === activeIndex ? 'active' : ''}`}
            key={`item-${index}`}
            onClick={() => onClick(index)}
          >
            {t(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleToggle;
