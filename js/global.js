//Global variables

var development = false;
var host = "https://us-central1-isenhas-3088d.cloudfunctions.net";
//var host = "http://localhost:5001/isenhas-3088d/us-central1";

function getListIconFromText(text){
  throw new Error("Proprietary module");
}
function isMatch(searchOnString, searchText) {
    searchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return searchOnString.match(new RegExp("\\b"+searchText+"\\b", "i")) != null;
}