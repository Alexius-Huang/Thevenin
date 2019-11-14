import React, { Fragment } from 'react';
import classnames from 'classnames';

type ResistorProps = {
  className?: string;
  coordinate: [number, number];
  unitSize: number;
};

export const Resistor: React.FC<ResistorProps> = ({ coordinate, unitSize, className = '' }) => {
  const translation = `translate(${[
    unitSize * (coordinate[0] - .5),
    unitSize * (coordinate[1] + .5)
  ]})`;

  const wireDirective = `M 0 0 L ${unitSize * 2} 0`;
  const halfUnitSize = unitSize / 2;
  const quarterUnitSize = unitSize / 4;
  const iconTranslation = `translate(${[halfUnitSize, -quarterUnitSize]})`;

  const electronicName = 'resistor';

  return (
    <Fragment>
      <g
        className={classnames('electronics', electronicName, className)}
        transform={translation}
      >
        <path d={wireDirective} stroke="#333" strokeWidth="1" />

        <rect
          className="electronic-bg"
          width={unitSize}
          height={halfUnitSize}
          transform={iconTranslation}
        />
        <image
          xlinkHref="/static/circuit/resistor-error.svg"
          width={unitSize}
          height={halfUnitSize}
          transform={iconTranslation}
        />
      </g>

      <style jsx>{`
      `}</style>
    </Fragment>
  );
};
