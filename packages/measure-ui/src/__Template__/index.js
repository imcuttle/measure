/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/6/17
 * @description
 * edam 模板配置文件
 */

module.exports = {
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Input Name🎨',
      default: 'Component',
      transformer: val => val[0].toUpperCase() + val.slice(1)
    }
  ],
  variables: ({ name }) => ({
    classname: name.replace(/(?!^)(?=[A-Z])/g, '-').toLowerCase()
  }),
  move: ({ name }) => ({
    '**': name + '/'
  })
}
