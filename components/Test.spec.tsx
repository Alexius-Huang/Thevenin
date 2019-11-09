import * as React from 'react';
import { mount } from 'enzyme';
import TestComponent from './Test';

describe('Components', () => {
  describe('Test component', () => {
    it('should render without throwing an error', function () {
      const wrap = mount(<TestComponent/>);
      expect(wrap.find('div').text()).toBe('Hello Next.js')
    });
  });
});
