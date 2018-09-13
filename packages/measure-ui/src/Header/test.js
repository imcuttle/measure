import { shallow } from 'enzyme'
import Header from './'

describe('Component: Header', function() {
  it.skip('should Header render', () => {
    const wrapper = shallow(<Header />)
    expect(wrapper.find('.abc')).to.have.length(3)
  })

  it.skip('should Header component click', () => {
    const wrapper = shallow(<Header />)
    wrapper.find('button').simulate('click')
    expect(wrapper.find('.acb')).to.have.length(3)
  })
})
