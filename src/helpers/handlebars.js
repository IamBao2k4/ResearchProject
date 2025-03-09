const Handlebars = require('handlebars');

Handlebars.registerHelper('isToday', function (surveyDate, options) {
    if(!surveyDate) return options.inverse(this);
    const today = new Date().toISOString().split('T')[0];
    const surveyDateString = new Date(surveyDate).toISOString().split('T')[0];
    return today === surveyDateString ? options.fn(this) : options.inverse(this);
});