import prodConfig from './prod-config';
import devConfig from './dev-config';

export default  process.env.NODE_ENV=='production' ? prodConfig : devConfig