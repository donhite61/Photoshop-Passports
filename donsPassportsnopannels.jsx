var thePath = 'C:\\DonsScripts\\photoshopPassports\\savedPassports.txt';
var cnArr = readSavedArray (thePath);
var cntrlArr = new Array(10);

var win = createWindow();
win.show();

function createWindow(){
    w = new Window ("dialog", "Hite Photo Passports", undefined);
    w.orientation = "column";
    w.alignChildren = "left";
    cntrlArr[9]= w.add ("dropdownlist", undefined);
    loadDropDown();
    cntrlArr[9].selection = 0
    cntrlArr[9].onChange = reloadFields;

     var nameGrp = w.add ("group");
    var lbl1= nameGrp.add ("statictext", undefined,"Name");
     lbl1.characters =6;
     cntrlArr[0]= nameGrp.add ("edittext", undefined,cnArr[0][0]);
     cntrlArr[0].characters =26;
     
     var photoGrp = w.add ("group");
    var lbl2=  photoGrp.add ("statictext", undefined, "Photo Width/Height");
     lbl2.characters =19;
     cntrlArr[1]= photoGrp.add ("edittext", undefined, cnArr[0][1]);
     cntrlArr[1].characters =5;
     cntrlArr[2]= photoGrp.add ("edittext", undefined, cnArr[0][2]);
     cntrlArr[2].characters =5;

    var headGrp = w.add ("group");
     var lbl3=headGrp.add ("statictext", undefined, "Head Min/Max");
     lbl3.characters =19;
     cntrlArr[3]= headGrp.add ("edittext", undefined, cnArr[0][3]);
     cntrlArr[3].characters =5;
     cntrlArr[4]= headGrp.add ("edittext", undefined, cnArr[0][4]);
     cntrlArr[4].characters =5;
     
    var spaceGrp = w.add ("group");     
     var lbl4= spaceGrp.add ("statictext", undefined, "Top Space Min/Max");
     lbl4.characters =19;
     cntrlArr[5]= spaceGrp.add ("edittext", undefined, cnArr[0][5]);
     cntrlArr[5].characters =5;
     cntrlArr[6]= spaceGrp.add ("edittext", undefined, cnArr[0][6]);
     cntrlArr[6].characters =5;
     
     var quantGrp = w.add ("group");     
     var lbl5= quantGrp.add ("statictext", undefined, "Quantity");
     lbl5.characters =19;
     cntrlArr[7]= quantGrp.add ("edittext", undefined, cnArr[0][7]);
     cntrlArr[7].characters =5;
     
     cntrlArr[8] = w.add ("edittext", [0, 0, 300, 150], cnArr[0][8], {multiline: true}); 

     
     var butGrp = w.add ("group"); 
      butMake = butGrp.add ("button", undefined, "Make PP");
      butMake.onClick = makePP;
      butSave = butGrp.add ("button", undefined, "Save PP");
      butSave.onClick = saveData;
      butDelete = butGrp.add ("button", undefined, "Delete PP");
      butDelete.onClick = delData;
      butAdd = butGrp.add ("button", undefined, "New PP");
      butAdd.onClick = newPP;

      return w;
      }
  
function makePP(){
    alert('but make pressed');
    var doc = app.activeDocument;
    var doc2 = app.activeDocument;
    var startDisplayDialogs = displayDialogs;
	var startRulerUnits = preferences.rulerUnits;
	var startTypeUnits = preferences.typeUnits;
	
	var displayDialogs = DialogModes.NO;
	preferences.rulerUnits = Units.MM;
	//preferences.typeUnits = TypeUnits.MM;

	if ( doc.width < doc.height) {
        alert('this script expects a horizontal photo');
        }
    else{
		displayDialogs = DialogModes.NO;
		activeDocument.resizeImage( null, 50.8, 300, ResampleMethod.BICUBIC );
	}
	preferences.rulerUnits = startRulerUnits;
	preferences.typeUnits = startTypeUnits;
    displayDialogs = startDisplayDialogs;

}

function newPP(){
    var indx = parseInt(cntrlArr[9].selection.index)+1;
    cnArr.splice(indx, 0, ['','','','','','','','','']);
    var existingNew = cntrlArr[9].find ("New");
    if(existingNew != null){
        cntrlArr[9].selection = existingNew;
    }
    else{
        cntrlArr[9].add("item",'New',indx);
        cntrlArr[9].selection = indx;
    }
    
    return;
}

function delData(key, value){
    var i = parseInt(cntrlArr[9].selection.index);
    cnArr.splice(i, 1);
    cntrlArr[9].remove(cntrlArr[9].items[i]);
    if(i>0){cntrlArr[9].selection = i-1};
    saveData();
}

function saveData(){
    readFieldsToArray();
    updateDropDown();
    var fh = new File(thePath);
    fh.open('w')
    
    if(fh!=-1) {// If the file has been successfully opened
       for (var i = 0; i <cnArr.length; i++) {
            var line='';
            for (var j = 0; j <=8; j++) {
                line += cnArr[i][j];
                if (j != 8) line += '|';
             }
             fh.writeln(line); // Write the string to a file
       }
        fh.close(); // Close the file 
        return
    }
}

function reloadFields(){
   var sel = parseInt(cntrlArr[9].selection.index);
   for (var i = 0; i <=8; i++) {
       cntrlArr[i].text = cnArr[sel][i];
   }
    return
}


function readSavedArray (thePath){
    var arr = [];
     if (File(thePath).exists == true){
        var file = new File(thePath);
        file.open('r');
        while(!file.eof){
            var line = file.readln();
            var split = line.split('|');
            if (split[8] == ''){split[8] = 'Notes'};
            if(split.length == 9){arr.push(split);}
        }
        file.close();
    }
    if(arr.length < 1){arr.push (['','','','','','','','','Notes']);}
    return arr;
}


function updateDropDown(){
    var i = parseInt(cntrlArr[9].selection.index);
    var line = 'Size '+cnArr[i][1]+'x'+cnArr[i][2] +'  Head '+ cnArr[i][3]+'x'+cnArr[i][4] +'   '+ cnArr[i][0];
    cntrlArr[9].items[i].text = line;
}

function loadDropDown(){
    for (var i = 0; i < cnArr.length; i++) {
        var line = 'Size '+cnArr[i][1]+'x'+cnArr[i][2] +'  Head '+ cnArr[i][3]+'x'+cnArr[i][4] +'   '+ cnArr[i][0];
        cntrlArr[9].add("item",line);
    }
}



function readFieldsToArray(){
   var sel = parseInt(cntrlArr[9].selection);
   for (var i = 0; i <=8; i++) {
       var item = cntrlArr[i].text;
       if(item == undefined) {
           item = '';
       }
       cnArr[sel][i] = cntrlArr[i].text;
   }
    return
}



//array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
