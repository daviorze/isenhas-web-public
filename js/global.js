//Global variables

var development = false;
var host = "https://example";
//var host = "http://localhost:5001/";

function getListIconFromText(text){
  throw new Error("Proprietary module");
}
function isMatch(searchOnString, searchText) {
    searchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return searchOnString.match(new RegExp("\\b"+searchText+"\\b", "i")) != null;
}