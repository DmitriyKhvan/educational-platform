import { Link } from 'react-router-dom';

const CTACard = ({ icon, title, subtitle, button, color, disabled, bgIcon }) => (
  <div
    style={{ background: color }}
    className={`p-4 sm:p-5 2xl:p-[30px] rounded-[10px] relative ${
      disabled && 'cursor-no-drop'
    } flex-1`}
  >
    <div>
      <section className="flex flex-row gap-4 2xl:gap-5 mb-5">
        <div style={{ background: bgIcon }} className="min-w-[65px] w-[65px] h-[65px] rounded-lg flex items-center justify-center gap-5">
          <img src={icon} alt="icon" />
        </div>
        <h3 className="text-white text-xl font-semibold">{title}</h3>
      </section>
      {button ? (
        <Link to={button.to} className={`rounded bg-white inline-block p-4 text-color-dark-violet text-[15px] font-semibold ${disabled && 'cursor-no-drop'}`}>
          {button.text}
        </Link>
      ) : null}
      {subtitle ? <p className="subtitle text-white">{subtitle}</p> : null}
    </div>
    {disabled && <div className="absolute p-[7px] -top-[14px] rounded-lg w-[100px] right-5 text-center text-white z-[2] bg-purple-600">
      soon...
    </div>}
    {disabled && <div className="w-full h-full rounded-lg bg-[#0006] absolute z-[1] top-0 left-0">
    </div>}
  </div>
);

export default CTACard;
