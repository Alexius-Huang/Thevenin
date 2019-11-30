import React, { useMemo } from 'react';
import classnames from 'classnames';
import { ElectronicProps } from './index.types';

export const Ground: React.FC<ElectronicProps> = ({ unitSize, className = '', electronic }) => {
  const { coordinate, rotations } = electronic;
  const halfUnitSize = unitSize / 2;

  const translation = `translate(${[
    unitSize * (coordinate[0]),
    unitSize * (coordinate[1] + .5)
  ]}) rotate(${rotations * 90}, ${halfUnitSize}, 0)`;

  const wireDirective = `M ${halfUnitSize} ${-unitSize} L ${halfUnitSize} 0`;
  const iconTranslation = `translate(${[0, -unitSize / 4]})`;

  const electronicName = 'ground';
  const GroundPathDirective = useMemo(() => {
    const step = unitSize / 10;
    return `
      M${unitSize / 4} 0 L${unitSize * (3 / 4)} 0
      M${unitSize * (5 / 16)} ${step} L${unitSize * (11 / 16)} ${step}
      M${unitSize * (3 / 8)} ${step * 2} L${unitSize * (5 / 8)} ${step * 2}
      M ${unitSize / 2} 0 L ${unitSize / 2} -${unitSize / 4}`;
  }, [unitSize]);

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

      <path
        className="path-ground"
        d={GroundPathDirective}
      />
    </g>
  );
};
