import { shallow } from 'enzyme'
import Navigation from './'

describe('Component: Navigation', function() {
  it.skip('should Navigation render', () => {
    const wrapper = shallow(<Navigation />)
    expect(wrapper.find('.abc')).to.have.length(3)
  })

  it.skip('should Navigation component click', () => {
    const wrapper = shallow(<Navigation />)
    wrapper.find('button').simulate('click')
    expect(wrapper.find('.acb')).to.have.length(3)
  })
})
