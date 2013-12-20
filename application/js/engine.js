/**
* Explorer for FirefoxOS v0.1
*
* Copyright Sebastián Rajo 2013.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*
* References:
* 
* - https://wiki.mozilla.org/WebAPI/DeviceStorageAPI
*/

(function () {

  isPicking = false;
  activityRequest = "";


var tam="";
var dir="";
var nombredelista="";
var nombre="";
var tama="";
var fecha="";
var tipo="";
var tipe="";
var dircrea="";
var nomtexto="";

  function runApp() {

    SDCARD = "sdcard";
    filesToImport = [];
    folders = [];
    root = "";
    isBacking = false;
    foldersAdded = [];



    refreshBtn = document.querySelector("#refreshBtn");
    refreshBtn.addEventListener ('click', function () {
$('#menu').popup('close');
      load();
    });


    btncrear = document.querySelector("#btncrear");
    btncrear.addEventListener ('click', function () {
$('#crea').popup('close');
      creatxt();
    });



    eliminarBtn = document.querySelector("#eliminarBtn");
    eliminarBtn.addEventListener ('click', function () {
$('#opciones').popup('close');
      eliminartxt();
    });


    //compart.style.display = 'block';


    compartirsistemBtn = document.querySelector("#compartirsistemBtn");
    compartirsistemBtn.addEventListener ('click', function () {
$('#opciones').popup('close');
      compartir();
    });


    salirBtn = document.querySelector("#salirBtn");
    salirBtn.addEventListener ('click', function () {
$('#menu').popup('close');
      salir();
    });

    backhBtn = document.querySelector("#backBtn");
    backhBtn.addEventListener ('click', function () {
      back();
    });

    // Open the default device storage
    storage = navigator.getDeviceStorage(SDCARD);
    storages = [];
    
    deviceStoragesList = document.querySelector("#deviceStoragesList");
    // Check that getDeviceStorages is available (only for FxOS >=1.1)
    if (navigator.getDeviceStorages) {
        storages = navigator.getDeviceStorages(SDCARD);
        if (storages.length > 1) {
            // Display the dropdown list only if there are more than one device storage available
            deviceStoragesList.style.display = "block";
            for (var i = 0; i < storages.length; i++) {
                var storageName = storages[i].storageName;
                deviceStoragesList.options[i] = new Option(storageName, storageName);
                if (storages[i].default === true) {
                        deviceStoragesList.options[i].selected = true;
                }
            }
        }
        deviceStoragesList.addEventListener("change", function() {
            changeDeviceStorage(this.options[this.selectedIndex].value);
        });
    }
   


    function creatxt(){
var nombre=document.getElementById('nombre').value;
var ext=document.getElementById('ext').value;


	var file   = new Blob(["este es el contenido de este archivo."], {type: "text/plain"});
if (dircrea==""){
	var fmname = dircrea+nombre+ext;
	var request = storage.addNamed(file,fmname);
}else{
	var fmname = dircrea+"/"+nombre+ext;
	var request = storage.addNamed(file,fmname);
}

	request.onsuccess = function () {
	  var name = this.result;
	  alert("El archivo " + name + " ha sido creado.");
	  load();
	}

	// An error typically occur if a file with the same name already exist
	request.onerror = function () {
	  alert("No es posible crear el archivo debido a la existencia de este o los permisos de la aplicacion");
	  load();
	}


    }

    function eliminartxt(){
	var sdcard = navigator.getDeviceStorage('sdcard');
	var request = sdcard.delete(nomtexto);

	request.onsuccess = function () {
	  alert("Archivo " + nomtexto + " eliminado");
	  load();
	}

	request.onerror = function () {
	  alert("No es posible eliminar el archivo debido a la inexistencia de este o los permisos de la aplicacion.");
	  load();
	}

     }


    function salir(){
	window.close();
     }


    function back(){
      isBacking = true;
      folders = root.split("/");
      folders.splice(folders.length - 1, 1)
      root = folders.join("/");
      load();
    }
    
    /**
     * Switches to another device storage, based on the given name
     * @param {String} deviceStorageName Name of the device storage to switch to
     */
    function changeDeviceStorage(deviceStorageName) {
        for (var i=0; i< storages.length; i++) {
            if (deviceStorageName === storages[i].storageName) {
                storage = storages[i];
                // Go back to the root of the device storage, and load its content
                root = "";
                load();
                return;
            }
        }
    }



    function load(){


      foldersToSort = [];
      filesToSort = [];
      filesToSorta = [];
      pathsToSort = [];
      sizes = [];

      alreadyAdded = [];
      if(root == ""){
        backhBtn.style.display = 'none';
      } else {
        backhBtn.style.display = 'block';
      }

      root_ = document.querySelector("#path_root");
      root_.innerHTML = '<label><span class="home"></span></label>' + root;
dircrea=root;
      $('#item-list li').remove();
      var cursor = storage.enumerate(root); 

      cursor.onsuccess = function() {
        if (!cursor.result)  {
          execute();
          return; 
        }

         var file = cursor.result;
        var prefix = "/" + storage.storageName + "/";
        if (root != "") {
           prefix += root + "/";
        }
        var fname = file.name.replace(prefix, "");
        if(fname.split("/").length > 1) {
          pathsToSort.push(fname);
        } else {
          filesToSort.push("<table><tr style='font-size: 13pt;font-family: arial;color:#202020'><td width='250px'>" + fname + " <td>" + (file.size /1000000).toFixed(2) + "Mb");
          filesToSorta.push("<table><tr style='font-size: 8pt;font-family: arial;color:#899096'><td>" + file.lastModifiedDate + "");

//fecha=file.lastModifiedDate;
//tipo=file.type;

        }
        cursor.continue(); 

      }

      function execute() {


        filesWithImage = ['doc', 'xls', 'ppt', 'psd', 'ai', 'pdf', 'html', 'xml', 'txt', 'mp3', 'jpg', 'png', 'zip'];

        pathsToSort.sort(
          function(a, b) {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
          }
          );


        for (var s = 0; s < pathsToSort.length; s++)  {
          n = pathsToSort[s].split("/");
          if(n.length == 1) {
            filesToSort.push(n[0]);
            filesToSorta.push(n[0]);
          } else {
            foldersToSort.push(n[0]);
          }
        }

        for (var g = 0; g < foldersToSort.length; g++)  {
          path = foldersToSort[g].split("/");
          if(alreadyAdded.lastIndexOf(path[0] + "/") == -1) {
            alreadyAdded.push(path[0] + "/");
            $("#item-list").append('<li><br><label><input type="checkbox"><span class="folder"></span></label>' + path[0] + "/" + '</li>');
          }
        }
        for (var f = 0; f < filesToSort.length; f++)  {
          path = filesToSort[f].split("/");
fileType = path.toString().substring(0, path.toString().lastIndexOf(' ')).split(".")[1];
          if(filesWithImage.indexOf(fileType) == -1){
            fileType = 'unk';
          }
//tipe=fileType;
          patho = filesToSorta[f].split("/");
          $("#item-list").append('<li><br><table><tr><td width="15px"><label><input type="checkbox"><span class="' + fileType + '"></span>'
            + '</label></td><td>' + path + '</td></tr><tr><td width="15px">'+patho+'</td></tr></table></li>');



	

	}


        flagOk = true;


        $('#item-list li').click(function(event) {

          var target = $(event.target);
          if(flagOk && target.text() != ""){
            if(target.text().split("/").length > 1){
              if(!isBacking){
                if(root == ""){
                  root = target.text().substring(0, target.text().lastIndexOf('/'));
//AQUI alert(root);
                } else {
                  root = root + "/" + target.text().substring(0, target.text().lastIndexOf('/'));
//alert(root);
                }
              }
              load();
            } else {
              var fname = target.text();


//alert(root);
//alert(fname);


              if (fname.lastIndexOf(' ') >= 0) {
                fname = fname.substring(0, fname.lastIndexOf(' '))

//tipe=fname.type;

//alert(fname);
nombredelista=fname;
nomtexto=fname;


              }
              console.log("File to share: " + fname);
              //importFiles(fname);    
$('#opciones').popup('open');
		load();

            }
            flagOk = false;
          }
        });
      };
      isBacking = false;
    }

    load();



function compartir(){
importFiles(nombredelista);
load();
}







    function importFiles(filesToImport) {

      a_file = (root == "") ? storage.get(filesToImport) : a_file = storage.get(root + "/" + filesToImport); 

      a_file.onerror = function() {
        var afterNotification = function(){
          alert("Problemas encontrando el archivo en tu SDCARD.");
          load();
        };
        console.error("Error in: ", a_file.error.name);
      };

      a_file.onsuccess = function() { 

        if(isPicking){
          isPicking = false;
          activityRequest.postResult.type = a_file.result.type;
          activityRequest.postResult({
            type: a_file.result.type,
            blob: a_file.result
          });
        } else {
          blob = a_file.result;
          item = new Object();
          item.isVideo = true;
          item.filename = blob.name;
          item.blob = blob;
          var type = blob.type;
          var nameonly = item.filename.substring(item.filename.lastIndexOf('/') + 1);

           var activity = new MozActivity({
            name: 'share',
            data: {
              // this is ugly; all share options with images are shown. But right now is the
              // only way to share with the email.
              type: 'image/*',
              number: 1,
              blobs: [item.blob],
              filenames: [nameonly],
              filepaths: [item.filename]
            }
          });





        }
      };
    }
  }

  runApp();

  navigator.mozSetMessageHandler('activity', function(activityReq) {
    activityRequest = activityReq;
    var option = activityRequest.source;

    if (option.name === "pick") {
      isPicking = true;
    }
  });

})();

