import React, { useMemo } from 'react';
import classnames from 'classnames';
import { ElectronicProps } from './types';

export const DCSource: React.FC<ElectronicProps> = ({ unitSize, className = '', electronic }) => {
  const halfUnitSize = unitSize / 2;
  const { coordinate, rotations } = electronic;

  const translation = `translate(${[
    unitSize * (coordinate[0]),
    unitSize * (coordinate[1] + .5)
  ]}) rotate(${rotations * 90}, ${halfUnitSize}, 0)`;

  const wireDirective = `M ${-halfUnitSize} 0 L ${unitSize * 1.5} 0`;
  const iconTranslation = `translate(${[0, -unitSize / 4]})`;

  const electronicName = 'dc-source';
  const DCSourcePathDirective = useMemo(() => {
    const positivePinSize = unitSize / 4;
    const negativePinSize = unitSize / 8;
    const positivePinLocation = unitSize * (.5 -  (1 / 20));
    const nagativePinLocation = unitSize * (.5 +  (1 / 20));
    return `
      M0 0 L${positivePinLocation} 0
      M${positivePinLocation} ${positivePinSize} L${positivePinLocation} -${positivePinSize}
      M${nagativePinLocation} ${negativePinSize} L${nagativePinLocation} -${negativePinSize}
      M${nagativePinLocation} 0 L${unitSize} 0`;
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
        className="path-dc-source"
        d={DCSourcePathDirective}
      />
    </g>
  );
};
