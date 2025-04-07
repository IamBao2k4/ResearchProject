const Handlebars = require('handlebars');

Handlebars.registerHelper('isToday', function (surveyDate, options) {
    if(!surveyDate) return options.inverse(this);
    const today = new Date().toISOString().split('T')[0];
    const surveyDateString = new Date(surveyDate).toISOString().split('T')[0];
    return today === surveyDateString ? options.fn(this) : options.inverse(this);
});

// kiểm tra xem ngày khảo sát có nhiều hơn 3 ngày trước không
Handlebars.registerHelper('isLessThan3Days', function (surveyDate, options) {
    if(!surveyDate) return options.inverse(this);
    const today = new Date();
    const surveyDateObj = new Date(surveyDate);
    const diffTime = Math.abs(today - surveyDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 3 ? options.fn(this) : options.inverse(this);
});