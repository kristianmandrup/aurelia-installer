import environment from './environment';
import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config) {
  if (environment.debug) {
    config.developmentLogging();
  }

  if (environment.testing) {
    config.plugin('aurelia-testing');
  }

  // more plugins here
}
