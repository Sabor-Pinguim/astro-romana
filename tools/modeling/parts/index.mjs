import engines from './engines.mjs';
import tanks from './tanks.mjs';
import equipment from './equipment.mjs';
import cabin from './cabin.mjs';

export { engines, tanks, equipment, cabin };
export default [...engines, ...tanks, ...equipment, ...cabin];
