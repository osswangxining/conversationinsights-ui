

function sortArrayByDate(arr, dt_property) {
  arr.sort(function(a, b) {
    a = new Date(a[dt_property]);
    b = new Date(b[dt_property]);
    return a>b ? -1 : a<b ? 1 : 0;
  });
  return arr;
}

function objectFindByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
          return array[i];
      }
  }
  return null;
}

function parseModelFolderDate(folder) {
  var p = folder.substring(folder.lastIndexOf("_") + 1)
  console.log(isNaN(p.substring(0,4)) + "p:"+p)
  if(isNaN(p.substring(0,4))) {
    //return current time
    var date = new Date();
    //return new XDate(date.getFullYear(), (date.getMonth() + 1), date.getDate(), date.getHours(), date.getMinutes())
    return ""
  } else {
    var d = p.substring(0,4) + '-' + p.substring(4,6) + '-' + p.substring(6,8) + 'T' + p.substring(9,11) + ':' + p.substring(11,13);
    var s = p.substring(4,6) + '-' + p.substring(6,8) + '-' + p.substring(0,4);
    var t = p.substring(9,11) + ':' + p.substring(11,13);
    return new XDate(p.substring(0,4), p.substring(4,6) - 1, p.substring(6,8), p.substring(9,11), p.substring(11,13))
  }
}

function getAvailableModels(models) {
  var arrModels = [];
  for (var i = 0; i <= models.length - 1; i++) {
    var name = models[i].substring(models[i].lastIndexOf("/") + 1);
    var xdate = parseModelFolderDate(models[i]);
    if(xdate == "") {
      arrModels.push({name: name, folder: models[i], xdate: xdate, date: "N/A"});
    } else {
      arrModels.push({name: name, folder: models[i], xdate: xdate, date: xdate.toString("MM/dd/yy h(:mm)TT")});
    }

  }
  arrModels.sort(function(a, b){
    return a.xdate[0] > b.xdate[0];
  });
  return arrModels;
}

function getLoadedModels(models) {
  var arrModels = [];
  if (models instanceof Object) {
    var arrVals = Object.keys(models).map(function (key) { return models[key]; });
    var arrKeys = Object.keys(models).map(function (key) { return key; });
    for (var z = 0; z <= arrVals.length - 1; z++) {
      arrModels.push({name: arrKeys[z], folder: arrVals[z]});
    }
  } else {
    arrModels.push({name: 'Default', folder: models});
  }
  return arrModels;
}

function pastelColors(){
  var hue = Math.floor(Math.random() * 360);
  return 'hsl(' + hue + ', 100%, 87.5%)';
}
