/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/12
 *
 */
import { createIsolateI18n } from 'tiny-i18n'
const i18n = createIsolateI18n()

i18n.setLanguage('en-us')
i18n.setDictionary(require('./en-us'), 'en-us')
i18n.setDictionary(require('./zh-cn'), 'zh-cn')

export default i18n
