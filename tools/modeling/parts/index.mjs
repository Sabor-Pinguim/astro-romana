import engines from './engines.mjs';
import tanks from './tanks.mjs';
import equipment from './equipment.mjs';
import cabin from './cabin.mjs';
import cockpit from './cockpit.mjs';
import structures from './structures.mjs';

export { engines, tanks, equipment, cabin, cockpit, structures };
export default [...engines, ...tanks, ...equipment, ...cabin, ...cockpit, ...structures];
