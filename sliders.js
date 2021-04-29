var mousePosition, active_element;
var offset = [0, 0];
var isDown = false;
var slider_min = -11;

var default_range = [0, 100];
var default_round = 0;
var default_color = "#7ef4ff";

var slider_positions = {};
var slider_percentages = {};
var slider_values = {};

//Allows you to let go of slider, otherwise all mouse movement moves slider
document.addEventListener(
  "mouseup",
  function () {
    isDown = false;
    document.body.style.webkitUserSelect = "";
    document.body.style.mozUserSelect = "";
    document.body.style.msUserSelect = "";
  },
  true
);
//Allows for the slider ball to move when clicked
document.addEventListener(
  "mousemove",
  function (event) {
    if (isDown) {
      mousePosition = { x: event.clientX, y: event.clientY };

      var current_input =
        active_element.parentElement.parentElement.parentElement.childNodes[1];
      var slider_groover = active_element.parentElement.firstChild;
      var name = current_input.name;
      var slider_max = slider_groover.clientWidth + slider_min;
      var min = parseFloat(current_input.min);
      var max = parseFloat(current_input.max);
      if (min !== "" && max !== "" && min < max) {
        var range = [min, max];
      } else {
        var range = default_range;
      }
      var left_pos = mousePosition.x + offset[0];

      if (left_pos < slider_min) {
        slider_positions[name] = slider_min;
      } else if (left_pos > slider_max) {
        slider_positions[name] = slider_max + 2;
      } else {
        slider_positions[name] = left_pos;
      }

      var percentages =
        (100 * (slider_positions[name] - slider_min - 2)) /
        slider_groover.clientWidth;
      var value = range[0] + ((range[1] - range[0]) * percentages) / 100;

      setSliderTo(name, value);
    }
  },
  true
);

var sliders = document.getElementsByClassName("slider1");

for (var i = 0; i < sliders.length; i++) {
  var slider_parent = createSuperElement("div", { class: "slider1_parent" });
  sliders[i].parentNode.insertBefore(slider_parent, sliders[i]);
  slider_parent.appendChild(sliders[i]);

  if (sliders[i].getAttribute("text")) {
    var text = createSuperElement(
      "p",
      { class: "title" },
      sliders[i].getAttribute("text")
    );
  } else {
    var text = createSuperElement("span");
  }

  slider_parent.insertBefore(text, sliders[i]);

  var color =
    sliders[i].getAttribute("color") !== null
      ? sliders[i].getAttribute("color")
      : default_color;

  var slider_main_block = createSuperElement("div", { class: "main_block" });
  var slider_groove_parent = createSuperElement("div", {
    class: "groove_parent",
  });
  var slider_groove = createSuperElement("div", { class: "groove" });
  var slider_fill = createSuperElement("div", { class: "fill" }, "", {
    "background-color": color,
  });
  var slider_rider = createSuperElement("div", { class: "rider" });

  var min = parseFloat(sliders[i].min);
  var max = parseFloat(sliders[i].max);
  if (min !== "" && max !== "" && min < max) {
    var range = [min, max];
  } else {
    var range = default_range;
  }

  var table_data = [
    [
      [range[0], { class: "left" }],
      [range[1], { class: "right" }],
    ],
  ];
  var slider_range = createSuperTable(table_data, { class: "slider_range" });

  slider_groove.appendChild(slider_fill);
  slider_groove_parent.appendChild(slider_groove);
  slider_groove_parent.appendChild(slider_rider);
  slider_main_block.appendChild(slider_groove_parent);
  slider_main_block.appendChild(slider_range);
  slider_parent.appendChild(slider_main_block);

  slider_rider.addEventListener(
    "mousedown",
    function (e) {
      var current_input = this.parentElement.parentElement.parentElement
        .childNodes[1];

      isDown = true;
      offset[0] = this.offsetLeft - e.clientX;
      active_element = this;

      if (current_input.getAttribute("animate") !== "no") {
        this.parentNode.lastChild.style.transition = "";
        this.parentNode.firstChild.firstChild.style.transition = "";
      }

      document.body.style.webkitUserSelect = "none";
      document.body.style.mozUserSelect = "none";
      document.body.style.msUserSelect = "none";
    },
    true
  );

  slider_groove.addEventListener(
    "click",
    function (e) {
      var current_input = this.parentElement.parentElement.parentElement
        .childNodes[1];
      var name = current_input.name;
      var click_position = e.clientX - my_offset(this).left;

      var min = parseFloat(current_input.min);
      var max = parseFloat(current_input.max);
      if (min !== "" && max !== "" && min < max) {
        var range = [min, max];
      } else {
        var range = default_range;
      }

      if (current_input.getAttribute("animate") !== "no") {
        this.parentNode.lastChild.style.transition = "left 0.2s ease-in-out";
        this.parentNode.firstChild.firstChild.style.transition =
          "width 0.2s ease-in-out";
      }

      var percentages = (100 * click_position) / (this.clientWidth + 2);
      var value = range[0] + ((range[1] - range[0]) * percentages) / 100;
      setSliderTo(name, value);
    },
    true
  );
// changes slider value based on number entered in input field
  sliders[i].addEventListener(
    "change",
    function (e) {
      setSliderTo(this.name, this.value);
    },
    true
  );

  if (!sliders[i].value) sliders[i].value = 0;
  setSliderTo(sliders[i].name, sliders[i].value);
}

function setSliderTo(name, value) {
  var slider = document.getElementsByName(name)[0];
  value = parseFloat(value);

  var min = parseFloat(slider.min);
  var max = parseFloat(slider.max);
  if (min !== "" && max !== "" && min < max) {
    var range = [min, max];
  } else {
    var range = default_range;
  }

  if (value >= range[0] && value <= range[1] && !isNaN(value)) {
    var data_round =
      slider.getAttribute("round") !== null
        ? slider.getAttribute("round")
        : default_round;
    if (slider.getAttribute("smooth") !== "yes")
      value = round(value, data_round);
    slider_percentages[name] =
      (100 * (value - range[0])) / (range[1] - range[0]);
    slider.parentNode.childNodes[2].firstChild.firstChild.firstChild.style.width =
      round(slider_percentages[name], 2) + "%";
    slider.parentNode.childNodes[2].firstChild.lastChild.style.left =
      "calc(" + round(slider_percentages[name], 2) + "% - 11px )";
    value = round(value, data_round);
    slider.value = value;
    slider_values[name] = value;
  } else {
    //console.log('Value ['+value+'] is out of slider range: '+range[0]+'-'+range[1] || default_range[1]);
    if (value < range[0] && !isNaN(value)) setSliderTo(name, range[0]);
    else if (value > range[1] && !isNaN(value)) setSliderTo(name, range[1]);
    else slider.value = slider_values[name];
  }

  try {
    slider.onchange();
  } catch (err) {}
}

function my_offset(elem) {
  if (!elem) elem = this;

  var x = elem.offsetLeft;
  var y = elem.offsetTop;

  while ((elem = elem.offsetParent)) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
  }

  return { left: x, top: y };
}
// Sets decimals for sliders
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  var num32 = (value * multiplier) / multiplier;
  return num32.toFixed(2);
}

var element;
var table;

function createSuperElement(type, attributes, innerHTML, style) {
  if (attributes === undefined) attributes = "";
  if (innerHTML === undefined) innerHTML = "";
  if (style === undefined) style = "";

  element = document.createElement(type);

  if (innerHTML !== "" && typeof innerHTML === "object")
    element.appendChild(innerHTML);
  else if (innerHTML !== "") element.innerHTML = innerHTML;

  if (attributes !== "") {
    for (var i in attributes) {
      element.setAttribute(i, attributes[i]);
    }
  }

  if (style !== "") {
    var styles = "";
    for (var i in style) {
      styles += i + ":" + style[i] + ";";
    }
    element.setAttribute("style", styles);
  }

  return element;
}

// Creates table - deleted sliders if commented out
function createSuperTable(data, attributes) {
  if (attributes === undefined) attributes = "";
  table = createSuperElement("table", attributes);

  for (var i in data) {
    // rows
    table.appendChild(createSuperElement("tr"));

    for (var j in data[i]) {
      // cells
      table.lastChild.appendChild(
        createSuperElement("td", data[i][j][1], data[i][j][0], data[i][j][2])
      );
    }
  }

  return table;
};
bsm2 = 83;
bsm3 = 124;
calculate;
// on click re-calculate batch size and change markers and marker values
document.getElementById("bulk").addEventListener("click", function () {
  if (document.getElementById("bulk").value == "0.7") {
    console.log(document.getElementById("bulk").value);
    document.getElementById("slider1").min = 55;
    document.getElementById("bsMarker1").innerHTML = 55;
    document.getElementById("bsMarker2").innerHTML = 83;
    bsm2 = parseInt(document.getElementById("bsMarker2").innerHTML);
    document.getElementById("bsMarker3").innerHTML = 124;
    bsm3 = parseInt(document.getElementById("bsMarker3").innerHTML);
    document.getElementById("slider1").max = 138;
    document.getElementById("bsMarker4").innerHTML = 138;
    document.getElementById("slider1").value = 97;
    coatingTime.value;
  } else if (document.getElementById("bulk").value != "0.7") {
    console.log("False");
    document.getElementById("slider1").min = (
      197.03 *
      document.getElementById("bulk").value *
      0.4
    ).toFixed(1);
    document.getElementById("bsMarker1").innerHTML = (
      197.03 *
      document.getElementById("bulk").value *
      0.4
    ).toFixed(1);
    document.getElementById("bsMarker2").innerHTML = (
      197.03 *
      document.getElementById("bulk").value *
      0.6
    ).toFixed(1);
    bsm2 = parseInt(document.getElementById("bsMarker2").innerHTML);
    document.getElementById("bsMarker3").innerHTML = (
      197.03 *
      document.getElementById("bulk").value *
      0.9
    ).toFixed(1);
    bsm3 = parseInt(document.getElementById("bsMarker3").innerHTML);
    document.getElementById("slider1").max = (
      197.03 * document.getElementById("bulk").value
    ).toFixed(1);
    document.getElementById("bsMarker4").innerHTML = (
      197.03 * document.getElementById("bulk").value
    ).toFixed(1);
   document.getElementById("slider1").value = (
     197.03 * document.getElementById("bulk").value *0.7).toFixed(1);
     coatingTime.value;
  }
});
// on keyup re-calculate batch size and change marker values
document.getElementById("bulk").addEventListener("keyup", function () {
  if (document.getElementById("bulk").value == "0.7" && document.getElementById("bulk").value <= 1){
    console.log(document.getElementById("bulk").value);
    document.getElementById("slider1").min = 55;
    document.getElementById("bsMarker1").innerHTML = 55;
    document.getElementById("bsMarker2").innerHTML = 83;
    bsm2 = parseInt(document.getElementById("bsMarker2").innerHTML);
    document.getElementById("bsMarker3").innerHTML = 124;
    bsm3 = parseInt(document.getElementById("bsMarker3").innerHTML);
    document.getElementById("slider1").max = 138;
    document.getElementById("bsMarker4").innerHTML = 138;
    document.getElementById("slider1").value = 97;
    coatingTime.value;
  } else if (
    document.getElementById("bulk").value != "0.7" &&
    document.getElementById("bulk").value <= 1
  ) {
    console.log("False");
    document.getElementById("slider1").min = (
      197.03 *
      document.getElementById("bulk").value *
      0.4
    ).toFixed(1);
    document.getElementById("bsMarker1").innerHTML = (
      197.03 *
      document.getElementById("bulk").value *
      0.4
    ).toFixed(1);
    document.getElementById("bsMarker2").innerHTML = (
      197.03 *
      document.getElementById("bulk").value *
      0.6
    ).toFixed(1);
    bsm2 = parseInt(document.getElementById("bsMarker2").innerHTML);
    document.getElementById("bsMarker3").innerHTML = (
      197.03 *
      document.getElementById("bulk").value *
      0.9
    ).toFixed(1);
    bsm3 = parseInt(document.getElementById("bsMarker3").innerHTML);
    document.getElementById("slider1").max = (
      197.03 * document.getElementById("bulk").value
    ).toFixed(1);
    document.getElementById("bsMarker4").innerHTML = (
      197.03 * document.getElementById("bulk").value
    ).toFixed(1);
    document.getElementById("slider1").value = (
      197.03 *
      document.getElementById("bulk").value *
      0.7
    ).toFixed(1);
    coatingTime.value;
  } else document.getElementById("bulk").value = "N/A";
});
// change calculations when bulk density value is changed by click
document.getElementById("bulk").addEventListener("click", function () {
  coatingTime =
    (document.getElementById("slider1").value *
      parseFloat(1000) *
      (document.getElementById("slider3").value / 100)) /
    (document.getElementById("slider7").value / parseFloat(100)) /
    parseFloat(document.getElementById("slider2").value);
  document.getElementById("coatingTime").value = coatingTime.toFixed(2);
  panFill =
    (document.getElementById("slider1").value /
      document.getElementById("slider1").max) *
    100;
  document.getElementById("panFill").value = parseFloat(panFill).toFixed(2);
});

// change calculations when bulk density value is changed by keyup
document.getElementById("bulk").addEventListener("keyup", function () {
    panFill =
      (document.getElementById("slider1").value /
        document.getElementById("slider1").max) *
      100;
    document.getElementById("panFill").value = parseFloat(panFill).toFixed(2);
    calcMm2 =
      document.getElementById("perTablet").value /
      document.getElementById("surfaceArea").value;
    document.getElementById("perMm2").value = parseFloat(calcMm2).toFixed(3);
});

// change calculations when number of guns value is changed by click
document.getElementById("numGuns").addEventListener("click", function () {
  calcSprayPerGun =
    document.getElementById("slider2").value /
    document.getElementById("numGuns").value;
  document.getElementById("perGun").value = calcSprayPerGun.toFixed(0);
  changeColor4 = function (obj) {
    if (obj.value > 75 && obj.value < 100) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > 115) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < 65) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor4(document.getElementById("perGun"));
});

// change calculations when number of guns value is changed by keyup
document.getElementById("numGuns").addEventListener("keyup", function () {
    calcSprayPerGun =
      document.getElementById("slider2").value /
      document.getElementById("numGuns").value;
    document.getElementById("perGun").value = calcSprayPerGun.toFixed(0);
changeColor4 = function (obj) {
  if (obj.value > 75 && obj.value < 100) {
    obj.style.backgroundColor = "#84f415f0";
  } else if (obj.value > 115) {
    obj.style.backgroundColor = "red";
  } else if (obj.value < 65) {
    obj.style.backgroundColor = "red";
  } else obj.style.backgroundColor = "yellow";
};
changeColor4(document.getElementById("perGun"));
});
// change calculations when tablet weight is entered
document.getElementById("tablet").addEventListener("keyup", function () {
  calcCoatPerTab =
    document.getElementById("tablet").value *
    (document.getElementById("slider3").value / 100);
  document.getElementById("perTablet").value = parseFloat(calcCoatPerTab).toFixed(2);
  perBatch =
    (document.getElementById("slider1").value * 1000) /
    (document.getElementById("tablet").value / 1000);
  document.getElementById("perBatch").value = parseFloat(perBatch).toFixed(0);
});
// change calculation when surface area is entered
document.getElementById("surfaceArea").addEventListener("keyup", function () {
  calcMm2 =
    document.getElementById("perTablet").value /
    document.getElementById("surfaceArea").value;
  document.getElementById("perMm2").value = parseFloat(calcMm2).toFixed(3);
});

// document.getElementById("slider2").addEventListener("click", function () {
//   numGuns =
//      document.getElementById("slider2").value /
//      document.getElementById("numGuns").value;
//    document.getElementById("slider8").value = numGuns.toFixed(2);
//   return document.getElementById("slider8").value;
// });


    // var cpt = function (obj) {
    //   if (obj.value != "") {
    //     document.getElementById("perTablet").value =
    //       document.getElementById("Tablet").value *
    //       (document.getElementById("slider3").value / 100);
    //   } else
    //     document.getElementById("perTablet").value = "Tablet weight needed";
    // };
    // cpt(document.getElementById("perTablet"));

function calculate() {
  var slider1 = document.getElementById("slider1").value;
  var slider2 = document.getElementById("slider2").value;
  var slider3 = document.getElementById("slider3").value;
  var slider4 = document.getElementById("slider4").value;
  var slider5 = document.getElementById("slider5").value;
  var slider6 = document.getElementById("slider6").value;
  var slider7 = document.getElementById("slider7").value;
  var slider8 = document.getElementById("slider8").value;

  //Change Your Code here
  var coatingTime =
    (slider1 * parseFloat(1000) * (slider3 / 100)) /
    (slider7 / parseFloat(100)) /
    parseFloat(slider2);
  document.getElementById("coatingTime").value = coatingTime.toFixed(2);
  // var result2 = parseFloat(slider1) + parseFloat(slider2) - parseFloat(slider3);
  // document.getElementById("output2").value =
  //   slider1 + "+" + slider2 + "-" + slider3 + "=" + result2;
  var sprayAmount =
    (parseFloat(slider1) *
      parseFloat(1000) *
      (parseFloat(slider3) / parseFloat(100))) /
    (parseFloat(slider7) / parseFloat(100)) /
    parseFloat(1000);
  document.getElementById("sprayAmount").value = sprayAmount.toFixed(3);

  var panFill =
    (document.getElementById("slider1").value /
      document.getElementById("slider1").max) *
    100;
  document.getElementById("panFill").value = panFill.toFixed(1);
  var calcCoatPerTab =
    document.getElementById("tablet").value *
    (document.getElementById("slider3").value / 100);
  document.getElementById("perTablet").value = parseFloat(
    calcCoatPerTab
  ).toFixed(2);
  var perBatch =
    (document.getElementById("slider1").value * 1000) /
    (document.getElementById("tablet").value / 1000);
  document.getElementById("perBatch").value = parseFloat(perBatch).toFixed(0);
  var calcMm2 =
    document.getElementById("perTablet").value /
    document.getElementById("surfaceArea").value;
  document.getElementById("perMm2").value = parseFloat(calcMm2).toFixed(3);
  var calcSprayPerGun =
    document.getElementById("slider2").value /
    document.getElementById("numGuns").value;
  document.getElementById("perGun").value = calcSprayPerGun.toFixed(0);

  // Change slider1 value field background based on value entered
  var bsm2 = 83;
  var bsm3 = 124;
  var changeColor1 = function (obj) {
    if (obj.value > bsm2 && obj.value < bsm3) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > document.getElementById("slider1").max * 0.95) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < document.getElementById("slider1").min * 1.2585) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor1(document.getElementById("slider1"));

  // Change Spray Rate value field background based on value entered
  var changeColor2 = function (obj) {
    if (obj.value > 1599 && obj.value < 1899) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > 2100) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < 1300) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor2(document.getElementById("slider6"));

  // Change weight gain value field background based on value entered
  var changeColor3 = function (obj) {
    if (obj.value > 324 && obj.value < 411) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > 450) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < 250) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor3(document.getElementById("slider2"));

  // Change spray per gun value field background based on value entered
  var changeColor4 = function (obj) {
    if (obj.value > 75 && obj.value < 100) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > 115) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < 65) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor4(document.getElementById("perGun"));

  // Change % weight gain field background based on value entered
  var changeColor5 = function (obj) {
    if (obj.value > 2 && obj.value < 4) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > 6) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < 1.5) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor5(document.getElementById("slider3"));

  // Change % pan fill field background based on value entered
  var changeColor5 = function (obj) {
    if (obj.value > 60 && obj.value < 90) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > 95) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < 50) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor5(document.getElementById("panFill"));

  // Change Bed Temp field background based on value entered
  var changeColor6 = function (obj) {
    if (obj.value > 40 && obj.value < 45) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > 47) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < 35) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor6(document.getElementById("slider4"));

  // Change Pan Speed field background based on value entered
  var changeColor7 = function (obj) {
    if (obj.value > 5 && obj.value < 8) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > 9) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < 4) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor7(document.getElementById("slider5"));
  
  // Change Pan Speed field background based on value entered
  var changeColor8 = function (obj) {
    if (obj.value > 12 && obj.value < 20) {
      obj.style.backgroundColor = "#84f415f0";
    } else if (obj.value > 25) {
      obj.style.backgroundColor = "red";
    } else if (obj.value < 8) {
      obj.style.backgroundColor = "red";
    } else obj.style.backgroundColor = "yellow";
  };
  changeColor8(document.getElementById("slider7"));
  // enter risks1
  var enterRisk1 = function (obj) {
    if (obj.value > 60 && obj.value < 90) {
      document.getElementById("Risk1").innerHTML = "";
    } else if (obj.value > 95) {
      document.getElementById("Risk1").innerHTML =
        "High Batch Size: Risk - Tablets spilling out of front of pan.<br> High Batch Size: Risk - Airflow impeded. Negative pan pressure not maintained.";
    } else if (obj.value < 50) {
      document.getElementById("Risk1").innerHTML =
        "Low Batch Size: Risk - Exhaust plenum not covered diverting airflow. <br> Low Batch Size: Risk - Baffles exposed impeding flow and receiving coating.";
    } else if (obj.value < 60 && obj.value > 50) {
      document.getElementById("Risk1").innerHTML =
        "Batch Size may be low, look for exposed baffles and improper tablet flow.";
    } else if (obj.value > 90 && obj.value < 95) {
      document.getElementById("Risk1").innerHTML =
        "Batch Size may be high, look for tablets falling out of front of pan and ensure negative pan pressure.";
    } else document.getElementById("Risk1").innerHTML = "";
  };
  enterRisk1(document.getElementById("panFill"));
}
