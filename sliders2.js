const express = require('express');
const Datastore = require('nedb');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: "1mb" }));
// GET method route, respond with 'hello world' when a get request is made to the homepage
// app.get('/', function(req, res){
//   res.send('hello world')
// });
const database = new Datastore('database.db');
database.loadDatabase();


app.post('/api', (request, response) => {
  console.log("I got a request!");
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json({
    status: "success woohoo",
    timestamp: timestamp,
    airflow: data.airflow
  });
});

// function setSliderTo(name, value) {
//   var slider = document.getElementsByName(name)[0];
//   value = parseFloat(value);

//   var min = parseFloat(slider.min);
//   var max = parseFloat(slider.max);
//   if (min !== "" && max !== "" && min < max) {
//     var range = [min, max];
//   } else {
//     var range = default_range;
//   }

//   if (value >= range[0] && value <= range[1] && !isNaN(value)) {
//     var data_round =
//       slider.getAttribute("round") !== null
//         ? slider.getAttribute("round")
//         : default_round;
//     if (slider.getAttribute("smooth") !== "yes")
//       value = round(value, data_round);
//     slider_percentages[name] =
//       (100 * (value - range[0])) / (range[1] - range[0]);
//     slider.parentNode.childNodes[2].firstChild.firstChild.firstChild.style.width =
//       round(slider_percentages[name], 2) + "%";
//     slider.parentNode.childNodes[2].firstChild.lastChild.style.left =
//       "calc(" + round(slider_percentages[name], 2) + "% - 11px )";
//     value = round(value, data_round);
//     slider.value = value;
//     slider_values[name] = value;
//   } else {
//     //console.log('Value ['+value+'] is out of slider range: '+range[0]+'-'+range[1] || default_range[1]);
//     if (value < range[0] && !isNaN(value)) setSliderTo(name, range[0]);
//     else if (value > range[1] && !isNaN(value)) setSliderTo(name, range[1]);
//     else slider.value = slider_values[name];
//   }

//   try {
//     slider.onchange();
//   } catch (err) {}
// }

// function my_offset(elem) {
//   if (!elem) elem = this;

//   var x = elem.offsetLeft;
//   var y = elem.offsetTop;

//   while ((elem = elem.offsetParent)) {
//     x += elem.offsetLeft;
//     y += elem.offsetTop;
//   }

//   return { left: x, top: y };
// }
// // Sets decimals for sliders
// function round(value, precision) {
//   var multiplier = Math.pow(10, precision || 0);
//   var num32 = (value * multiplier) / multiplier;
//   return num32.toFixed(2);
// }