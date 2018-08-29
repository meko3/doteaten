/*DataManager*///-----------------------------------------------------------------
function DataManager(){
  throw new Error("This is a static class");
}

DataManager.loadDatabase = function(){
  console.log("This is a data load function")
};
