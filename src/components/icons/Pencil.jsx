import React from 'react';

const SvgPencil = ({ style, ...props }) => (
  <svg
    width={19}
    height={19}
    style={{ cursor: 'pointer', ...style }}
    {...props}
  >
    <defs>
      <path id="pencil_svg__a" d="M0 .156h17.843V18H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 .844)">
        <mask id="pencil_svg__b" fill="#fff">
          <use xlinkHref="#pencil_svg__a" />
        </mask>
        <path
          d="M16.901 1.342c.596.595 1.523 2.089.448 3.163L4.406 17.45 0 18l.55-4.408S12.21 1.93 13.493.649c1.074-1.074 2.567-.146 3.162.448l.245.245z"
          fill="#404041"
          mask="url(#pencil_svg__b)"
        />
      </g>
      <path
        d="M14.528 2.323c-.243-.021-.553.242-.708.396-.155.153-9.983 9.896-10.516 10.42-.53.529-1.019 1.374-.535 1.856.66.659 1.283.393 1.727.262-.134.438-.396 1.063.314 1.769.484.482 1.28-.06 1.811-.586.531-.527 10.36-10.27 10.515-10.422.155-.153.42-.461.4-.701-.287-.154-1.305-.558-1.876-1.127-.57-.57-.98-1.583-1.132-1.867"
        fill="#FCC010"
      />
    </g>
  </svg>
);

export default SvgPencil;
