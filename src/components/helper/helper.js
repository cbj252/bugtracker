const { DateTime } = require("luxon");

exports.responseTimeFormat = function (response) {
  for (let i = 0; i < response.length; i++) {
    response[i].time = new Date(response[i].time).toLocaleString(
      DateTime.DATETIME_MED
    );
  }
  return response;
};
