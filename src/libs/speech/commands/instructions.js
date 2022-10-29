
 import { getInstructionsText, getSettings } from '../utils';


 const resolver = (data, options) =>
   getInstructionsText(options.triggers, options.title, getSettings());
 
 export default resolver;
 