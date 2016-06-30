import 'babel-polyfill'
import { TabEventsPage } from './tab-events-page'


/**
 * @author john
 * @version 4/21/16 2:09 PM
 */

let page = new TabEventsPage()
page.register()
window.bg = page
