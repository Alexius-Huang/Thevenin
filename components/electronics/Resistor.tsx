import React from 'react';
import classnames from 'classnames';

type ResistorProps = {
  className?: string;
  coordinate: [number, number];
  unitSize: number;
  rotations?: number;
};

export const Resistor: React.FC<ResistorProps> = ({ coordinate, unitSize, className = '', rotations = 0 }) => {
  const halfUnitSize = unitSize / 2;

  const translation = `translate(${[
    unitSize * (coordinate[0]),
    unitSize * (coordinate[1] + .5)
  ]}) rotate(${rotations * 90}, ${halfUnitSize}, 0)`;

  const wireDirective = `M ${-halfUnitSize} 0 L ${unitSize * 1.5} 0`;
  const iconTranslation = `translate(${[0, -unitSize / 4]})`;

  const electronicName = 'resistor';
  const error = className.includes('invalid');

  return (
    <g
      className={classnames('electronics', electronicName, className)}
      transform={translation}
    >
      <path className="wire" d={wireDirective} />

      <rect
        className="electronic-bg"
        width={unitSize}
        height={halfUnitSize}
        transform={iconTranslation}
      />
      <image
        xlinkHref={`/static/circuit/resistor${error ? '-error' : ''}.svg`}
        width={unitSize}
        height={halfUnitSize}
        transform={iconTranslation}
      />
    </g>
  );
};
