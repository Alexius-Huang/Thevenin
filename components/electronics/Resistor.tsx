import React, { useMemo } from 'react';
import classnames from 'classnames';
import { ElectronicProps } from './types';

export const Resistor: React.FC<ElectronicProps> = ({ unitSize, className = '', electronic }) => {
  const halfUnitSize = unitSize / 2;
  const { coordinate, rotations } = electronic;

  const translation = `translate(${[
    unitSize * (coordinate[0]),
    unitSize * (coordinate[1] + .5)
  ]}) rotate(${rotations * 90}, ${halfUnitSize}, 0)`;

  const wireDirective = `M ${-halfUnitSize} 0 L0 0 M${unitSize} 0 L${unitSize * 1.5} 0`;

  const electronicName = 'resistor';
  const resistorPathDirective = useMemo(() => {
    let directive = 'M0 0 ';
    const step = unitSize / 10;
    const amp = unitSize / 8;
    const ampArr = [-amp, 0, amp, 0, -amp, 0, amp, 0, -amp, 0];

    for (let i = 1; i <= 10; i += 1) {
      directive += `L${step * i} ${ampArr[i - 1]}`;
    }

    return directive;
  }, [unitSize]);

  return (
    <g
      className={classnames('electronics', electronicName, className)}
      transform={translation}
    >
      <path className="wire" d={wireDirective} />

      <path
        className="path-resistor"
        d={resistorPathDirective}
      />
    </g>
  );
};
