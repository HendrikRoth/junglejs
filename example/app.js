const JungleJS = require('junglejs').default;
const jungleConfig = require('./jungle.config');
new JungleJS({config: jungleConfig}).run(__dirname);
