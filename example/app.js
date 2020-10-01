const JungleJS = require('junglejs');
const jungleConfig = require('./jungle.config');
new JungleJS({config: jungleConfig}).run(__dirname);
