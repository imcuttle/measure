import { shallow } from 'enzyme'
import {{{name}}} from './'

describe('Component: {{{name}}}', function() {
    it.skip('should {{{name}}} render', () => {
        const wrapper = shallow(<{{{name}}} />)
        expect(wrapper.find('.abc')).to.have.length(3)
    })

    it.skip('should {{{name}}} component click', () => {
        const wrapper = shallow(<{{{name}}}/>)
        wrapper.find('button').simulate('click')
        expect(wrapper.find('.acb')).to.have.length(3)
    })
})
