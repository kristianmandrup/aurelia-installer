import {Aurelia} from 'aurelia-framework'
import environment from './environment';

export function plugins(aurelia: Aurelia) {
  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  // more plugins here
}