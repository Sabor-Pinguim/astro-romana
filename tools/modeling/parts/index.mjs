import engines from './engines.mjs';
import tanks from './tanks.mjs';
import equipment from './equipment.mjs';

export { engines, tanks, equipment };
export default [...engines, ...tanks, ...equipment];
