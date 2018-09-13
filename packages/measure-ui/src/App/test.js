import { shallow } from 'enzyme'
import App from './'

describe('Component: App', function() {
  it.skip('should App render', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('.abc')).to.have.length(3)
  })

  it.skip('should App component click', () => {
    const wrapper = shallow(<App />)
    wrapper.find('button').simulate('click')
    expect(wrapper.find('.acb')).to.have.length(3)
  })
})
