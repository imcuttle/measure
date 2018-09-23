import defaultState from './background-script/defaultState'

/**
 * @file options
 * @author Cuttle Cong
 * @date 2018/9/23
 *
 */

const form = document.querySelector('#form')
form.addEventListener('change', evt => {
  const t = evt.target

  if (t) {
    const name = t.getAttribute('name')
    const val = t.type === 'checkbox' ? t.checked : t.value

    chrome.storage.sync.set({ [name]: val }, function() {
      console.log('Value is set to ' + val)
    })
  }
})

const state = defaultState
chrome.storage.sync.get(Object.keys(defaultState), function(data) {
  Object.keys(data).forEach(name => {
    if (data[name] === undefined) {
      delete data[name]
    }
  })

  Object.assign(state, data)
  if (state.excludes && typeof state.excludes !== 'string') {
    state.excludes = state.excludes.join('\n')
  }
  if (state.includes && typeof state.includes !== 'string') {
    state.includes = state.includes.join('\n')
  }
  console.log('state', state)
  Object.keys(state).forEach(name => {
    const ele = document.querySelector(`[name=${name}]`)
    if (ele.type === 'checkbox') {
      ele.checked = !!state[name]
    } else {
      ele.value = state[name]
    }
  })

  document.querySelector('.loader-container').style.display = 'none'
  document.querySelector('#container').style.display = ''
})
