import engines from './engines.mjs';
import tanks from './tanks.mjs';
import equipment from './equipment.mjs';
import cabin from './cabin.mjs';
import cockpit from './cockpit.mjs';

export { engines, tanks, equipment, cabin, cockpit };
export default [...engines, ...tanks, ...equipment, ...cabin, ...cockpit];
