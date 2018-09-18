/**
 * @file utils
 * @author Cuttle Cong
 * @date 2018/9/18
 *
 */

export function upload({ onChange, multiple, accept } = {}) {
  const ipt = document.createElement('input')
  ipt.setAttribute('type', 'file')
  multiple && ipt.setAttribute('multiple', 'multiple')
  accept && ipt.setAttribute('accept', accept)
  ipt.style.display = 'none'
  document.body.appendChild(ipt)
  ipt.addEventListener('change', function (evt) {
    typeof onChange === 'function' && onChange(evt)
    ipt.value = ''
    ipt.reset && ipt.reset()
    ipt.parentNode && ipt.parentNode.removeChild(ipt)
  })
  ipt.click()
}
