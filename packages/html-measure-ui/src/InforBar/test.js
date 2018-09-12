import { shallow } from 'enzyme'
import InforBar from './'

describe('Component: InforBar', function() {
  it.skip('should InforBar render', () => {
    const wrapper = shallow(<InforBar />)
    expect(wrapper.find('.abc')).to.have.length(3)
  })

  it.skip('should InforBar component click', () => {
    const wrapper = shallow(<InforBar />)
    wrapper.find('button').simulate('click')
    expect(wrapper.find('.acb')).to.have.length(3)
  })
})
