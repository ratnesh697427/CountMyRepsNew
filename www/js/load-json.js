var chk_numeric = /^[0-9]+$/;
var chk_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/;

var excType;
var posArr = new Array();
var tagArr = new Array();
var langArr = new Array();
var countVal;
var countType;
var getStr;
var getBrthStr;
var cntdwntmr;
var tmr;
var tmcounter;
var i = 1;
var k = 1;
var j = 0;
var n = 0;
var secs = 0;
var mins = 1;
var voiceLang = 'en-US';
var exerciseType = 'Workout';
var exerciseStr;
var tabType;
var delaytimer;
var delaysecs = 10;
var startdelay;
var dbobj;
var favID;
var favName = "";
var curset = 1;
var appStatus;
var x = 0, y = 0; z = 0;
var timeInterval = 1;
var countVals;

var lastroutineid = 0;
var routinesIStr = "";
var routinesTStr = "";
var pauseTime = 0;
var totalRoutineTimeArr = new Array();
var itemArray = new Array();
var timeArray = new Array();
var ritemid = 0;
var rLen = 0;
var iT=0;
var rtnID;
var rtnitmid = 0;
var clocktimer;
var uptimer = 0;
var upseconds = 0;
var routineState = 1;
var oprmode;
var levelindex = 0;
var intervalDD = "";
var selectedFavID = 0;
var routineName = "";
var getInterval = "";
var rcntr = 0;
var routineItemsArr = new Array();
var routineTimesArr = new Array();
var routineItemIndex = 0;
var routineItemName = "";
var FavItemType = "";

//New Section for Database Issue -------

function createDatabaseAS()
{
    
    dbobj = window.openDatabase("cmr", "4", "CMR DB",'');
    dbobj.transaction(createSchema, errorInSchema, successInSchema);
    
}

function createSchema(tx)
{
    //tx.executeSql("DROP TABLE IF EXISTS `EXERCIZE`");
    tx.executeSql('CREATE TABLE IF NOT EXISTS `EXERCIZE` (`vLang` VARCHAR, `aStatus` VARCHAR)');
    //tx.executeSql("DROP TABLE IF EXISTS `FAVRATIO`");
    tx.executeSql('CREATE TABLE IF NOT EXISTS `FAVRATIO` (`nID` INTEGER PRIMARY KEY AUTOINCREMENT, `eType` VARCHAR, `eRatio` TEXT, `cType` VARCHAR, `cValue` VARCHAR, `tDelay` VARCHAR, `tInterval` VARCHAR, `fName` VARCHAR)');
    //tx.executeSql("DROP TABLE IF EXISTS `ROUTINELIST`");
    tx.executeSql('CREATE TABLE IF NOT EXISTS `ROUTINELIST` (`rlID` INTEGER PRIMARY KEY AUTOINCREMENT, `rfName` VARCHAR, `reType` VARCHAR, `reRatio` TEXT, `rcType` VARCHAR, `rcValue` VARCHAR, `rcInterval` VARCHAR, `rtInterval` VARCHAR, `rtnID` INTEGER, `riOrder` INTEGER)');
    //tx.executeSql("DROP TABLE IF EXISTS `ROUTINEZ`");
    tx.executeSql('CREATE TABLE IF NOT EXISTS `ROUTINEZ` (`rID` INTEGER PRIMARY KEY AUTOINCREMENT, `rName` VARCHAR, `rTime` VARCHAR, `rStatus` VARCHAR)');
}

function errorInSchema()
{
    //alert("Error to create schema");
}
                  
function successInSchema()
{
    //alert("Schema creation successful");
    dbobj.transaction(selectRecords, errorInsert, successDB2);
}

function insertRecord(tx)
{
    //navigator.notification.alert('Inserting Language');
    tx.executeSql("INSERT INTO `EXERCIZE`(`vLang`, `aStatus`) VALUES('en-US', 'P')",[],SuccessInsert,errorInsert);
}

function insertRecordFAV(tx)
{
    if(favName == ''){
        navigator.notification.alert('Favorites not saved');
    }else{
        tx.executeSql("INSERT INTO `FAVRATIO`(`eType`, `eRatio`, `cType`, `cValue`, `tDelay`, `tInterval`, `fName`) VALUES('"+exerciseType+"', '"+exerciseStr+"','"+countType+"','"+countVal+"','"+delaysecs+"','"+timeInterval+"','"+favName+"')",[],SuccessInsertFAV,errorInsert);
    }
    
}

function SuccessInsert(tx,result){
    //navigator.notification.alert('Inserted');
}

function SuccessInsertFAV(tx,result){
    navigator.notification.alert('Item saved to Favorites',  // message
                                 alertDismissed,         // callback
                                 'Save as Favorites',            // title
                                 'Done'                  // buttonName
                                 );
}

function alertDismissed(){
    
    _goFavorites(exerciseType,0);
    
}


function SuccessUpdateFAV(tx,result){
    navigator.notification.alert('Favorite item updated',  // message
                                 alertDismissedF,         // callback
                                 'Save as Favorites',            // title
                                 'Done'                  // buttonName
                                 );
}


function errorInsert(error){
    //alert("Error processing SQL: "+error.message);
}


function selectRecords(tx)
{
    tx.executeSql('SELECT * FROM `EXERCIZE`', [], successResults,errorInsert);
}


function successDB2()
{
    
}


function successResults(tx,results){
    
    var nLength = results.rows.length;
    
    if(nLength==0)
    {
        dbobj.transaction(insertRecord, errorInsert, successDB2);
    }
    else
    {
        
        voiceLang = results.rows.item(0).vLang;
        appStatus = results.rows.item(0).aStatus;
        
    }
    
    $('#vlangGrp').val(voiceLang);
    ttsPlugin.initTTS();
    ttsPlugin.setRate(0.55);
    ttsPlugin.setLanguage(voiceLang);
    ttsPlugin.speak(" ");
    
}
                  
function selectRecordsFAV(tx)
{
   tx.executeSql('SELECT * FROM `FAVRATIO`', [], successResultsFAV,errorInsert);
}
                  
function successResultsFAV(tx,results)
{
    
    x = 0; y = 0;
    var wfavlist = "";
    var bfavlist = "";
    
    $('#favsubdiv').empty();
    if(levelindex == 0){
        $('#favscreen').css('height','535px');
        $('#favsubdiv').html('<td align="center" width="33.3%"><a id="wdiv" class="activec" href="javascript:void(0);" onclick="_goFavorites('+"'"+'Workout'+"'"+',0);">WORKOUT</a></td><td align="center" width="33.4%"><a id="bdiv" href="javascript:void(0);" onclick="_goFavorites('+"'"+'Breathing'+"'"+',0);">BREATHING</a></td><td align="center" width="33.3%"><a id="rdiv" href="javascript:void(0);" onclick="_goFavorites('+"'"+'Routines'+"'"+',0);">ROUTINES</a></td>');
        
    }else{
        $('#favscreen').css('height','430px');
        $('#favsubdiv').html('<td align="center" width="33.3%"><a id="wdiv" class="activec" href="javascript:void(0);" onclick="_goFavorites('+"'"+'Workout'+"'"+',1);">WORKOUT</a></td><td align="center" width="33.4%"><a id="bdiv" href="javascript:void(0);" onclick="_goFavorites('+"'"+'Breathing'+"'"+',1);">BREATHING</a></td><td align="center" width="33.3%"><a id="rdiv" href="javascript:void(0);" onclick="_goFavorites('+"'"+'Routines'+"'"+',0);">ROUTINES</a></td>');
        
    }
    
   if(results.rows.length == 0)
   {
       $("#noItem").show();
   }
   else
   {

       wfavlist = '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">';
       bfavlist = '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">';
       
       for(c=0;c<results.rows.length;c++)
       {
           
           var erat = (results.rows.item(c).eRatio).split('-');
           
           if(results.rows.item(c).cType == 'Time')
           {
           
               var cUnit = '&nbsp;min.';
               var minp = Math.floor((results.rows.item(c).cValue) / 60);
               var secp = (results.rows.item(c).cValue) % 60;
               var currentMinutes = (minp > 9) ? minp : "0" + minp;
               var currentSeconds = (secp > 9) ? secp : "0" + secp;
               var countValue = currentMinutes+':'+currentSeconds;
               
           }else{
               
               var cUnit = '';
               var countValue = results.rows.item(c).cValue;
               
           }
               
           if(results.rows.item(c).eType=='Workout')
           {
               x++;
               if(levelindex == 0){
                   
                   wfavlist += '<tr class="ttllst"><td width="62%" align="left"><a href="#" onClick="_doOpenFavorites('+results.rows.item(c).nID+');"><img src="img/circle-play.png" width="24" border="0"/>&nbsp;&nbsp;'+results.rows.item(c).fName+'</a></td><td width="18%" align="left"><input type="button" class="favbtn2" id="wbtn'+results.rows.item(c).nID+'" onclick="_doOpenFavDetails('+results.rows.item(c).nID+');" value="Details" /></td><td width="10%" align="right"><a onclick="updateFAV('+results.rows.item(c).nID+')"><img src="img/circle-pencil.png" width="24" border="0"/></a></td><td width="10%" align="right"><a onclick="deletefmFAV('+results.rows.item(c).nID+','+"'"+'Workout'+"'"+')"><img src="img/circle-cross.png" width="24" border="0"/></a></td></tr><tr class="ttlfav" id="fav'+results.rows.item(c).nID+'"><td>Reps:&nbsp;'+erat[0]+'&nbsp;&nbsp;&nbsp;Rest:&nbsp;'+erat[1]+'&nbsp;&nbsp;&nbsp;'+results.rows.item(c).cType+':&nbsp;'+countValue+''+cUnit+'&nbsp;&nbsp;&nbsp;Interval:&nbsp;'+results.rows.item(c).tInterval+'&nbsp;sec.</td></tr>';
                   
               }else{
                   
                   wfavlist += '<tr class="ttllst"><td width="82%" align="left"><input type="radio" name="favitemID" value="'+results.rows.item(c).nID+'" />&nbsp;&nbsp;'+results.rows.item(c).fName+'</td><td width="18%" align="left"><input type="button" class="favbtn2" id="wbtn'+results.rows.item(c).nID+'" onclick="_doOpenFavDetails('+results.rows.item(c).nID+');" value="Details" /></td></tr><tr class="ttlfav" id="fav'+results.rows.item(c).nID+'"><td>Reps:&nbsp;'+erat[0]+'&nbsp;&nbsp;&nbsp;Rest:&nbsp;'+erat[1]+'&nbsp;&nbsp;&nbsp;'+results.rows.item(c).cType+':&nbsp;'+countValue+''+cUnit+'&nbsp;&nbsp;&nbsp;Interval:&nbsp;'+results.rows.item(c).tInterval+'&nbsp;sec.</td></tr>';
                   
               }
           }
           else
           {
               y++;
               if(levelindex == 0){
                   
                   bfavlist += '<tr class="ttllst"><td width="62%" align="left"><a href="#" onClick="_doOpenFavorites('+results.rows.item(c).nID+');"><img src="img/circle-play.png" width="24" border="0"/>&nbsp;&nbsp;'+results.rows.item(c).fName+'</a></td><td width="18%" align="left"><input type="button" class="favbtn2" id="wbtn'+results.rows.item(c).nID+'" onclick="_doOpenFavDetails('+results.rows.item(c).nID+');" value="Details" /></td><td width="10%" align="right"><a onclick="updateFAV('+results.rows.item(c).nID+')"><img src="img/circle-pencil.png" width="24" border="0"/></a></td><td width="10%" align="right"><a onclick="deletefmFAV('+results.rows.item(c).nID+','+"'"+'Breathing'+"'"+')"><img src="img/circle-cross.png" width="24" border="0"/></a></td></tr><tr class="ttlfav" id="fav'+results.rows.item(c).nID+'"><td>Inhale:&nbsp;'+erat[0]+'&nbsp;&nbsp;&nbsp;Hold:&nbsp;'+erat[1]+'&nbsp;&nbsp;&nbsp;Exhale:&nbsp;'+erat[2]+'&nbsp;&nbsp;&nbsp;Hold:&nbsp;'+erat[3]+'&nbsp;&nbsp;&nbsp;'+results.rows.item(c).cType+':&nbsp;'+countValue+''+cUnit+'</td></tr>';
                   
               }else{
                   
                   bfavlist += '<tr class="ttllst"><td width="82%" align="left"><input type="radio" name="favitemID" value="'+results.rows.item(c).nID+'" />&nbsp;&nbsp;'+results.rows.item(c).fName+'</a></td><td width="18%" align="left"><input type="button" class="favbtn2" id="wbtn'+results.rows.item(c).nID+'" onclick="_doOpenFavDetails('+results.rows.item(c).nID+');" value="Details" /></td></tr><tr class="ttlfav" id="fav'+results.rows.item(c).nID+'"><td>Inhale:&nbsp;'+erat[0]+'&nbsp;&nbsp;&nbsp;Hold:&nbsp;'+erat[1]+'&nbsp;&nbsp;&nbsp;Exhale:&nbsp;'+erat[2]+'&nbsp;&nbsp;&nbsp;Hold:&nbsp;'+erat[3]+'&nbsp;&nbsp;&nbsp;'+results.rows.item(c).cType+':&nbsp;'+countValue+''+cUnit+'</td></tr>';
               }
           }
               
               //if(x == 0){$("#noItem").show();}else{$("#noItem").hide();}
               
           }
    
                wfavlist += '</table>';
                bfavlist += '</table>';
                $('#savedItemsW').empty();
                $('#savedItemsW').append(wfavlist);
                $('#savedItemsB').empty();
                $('#savedItemsB').append(bfavlist);
       
       }
    
       if(exerciseType == 'Workout'){
           
           $("#wdiv").addClass('activec');
           $("#bdiv").removeClass('activec');
           $("#rdiv").removeClass('activec');
           
           if(x > 0){
               
               $("#savedItemsW").show();
               $("#noItem").hide();
               if(levelindex == 0){$("#createbtn").hide();$("#intervalDiv").hide();}else{$("#createbtn").show();$("#intervalDiv").show();}
               
           }else{
               
               $("#savedItemsW").hide();
               $("#noItem").show();
               
           }
           
           $("#addrdiv").hide();
           $("#savedItemsR").hide();
           $("#savedItemsB").hide();
           
           
       }else{
           
           $("#bdiv").addClass('activec');
           $("#wdiv").removeClass('activec');
           $("#rdiv").removeClass('activec');
           
           if(y > 0){
               
               $("#savedItemsB").show();
               $("#noItem").hide();
               if(levelindex == 0){$("#createbtn").hide();$("#intervalDiv").hide();}else{$("#createbtn").show();$("#intervalDiv").show();}
               
           }else{
               
               $("#savedItemsB").hide();
               $("#noItem").show();
               
           }
           
           $("#addrdiv").hide();
           $("#savedItemsR").hide();
           $("#savedItemsW").hide();
   
       }

}


function _doOpenFavDetails(index){
    
    $("#fav"+index).show();
    $("#wbtn"+index).val('Hide');
    $("#wbtn"+index).attr("onclick", "_doHideFavDetails("+index+")");
    
}


function _doHideFavDetails(index){
    
    $("#fav"+index).hide();
    $("#wbtn"+index).val('Details');
    $("#wbtn"+index).attr("onclick", "_doOpenFavDetails("+index+")");
    
}


function updateFAV(id){
    
    favID = id;
    dbobj.transaction(openFAVitem, errorInsert, successDB2);
    
}


//Delete item from favorites
function openFAVitem(tx) {
    
    tx.executeSql('SELECT * FROM `FAVRATIO` WHERE `nID`='+favID, [], openselectedFAV,errorInsert);
    
}


function openselectedFAV(tx,results){
    
    $("div[data-role='page']").hide();
    $('#pagesix').show();
    $('#openfRatio').empty();
    $('#openftype').text(results.rows.item(0).eType);
    
    exerciseType = results.rows.item(0).eType;
    var exratio = (results.rows.item(0).eRatio).split('-');
    
    
    $('#openfname').html('<input type="text" id="itemfName" class="form-input" maxlength="255" data-clear-btn="true" onClick=$("#itemfName").val($("#itemfName").val());>');
    $('#itemfName').val(results.rows.item(0).fName);
    
    
    if(results.rows.item(0).eType == 'Workout'){
        
        $('#openfRatio').html('<tr><td class="tdstyle" width="50%" align="left" style="padding-top:15px; border:none;"># REPS</td><td align="right" style="padding-top:15px; border:none;" class="tdstyle"><input type="number" pattern="[0-9]*" id="repsfDigits" class="form-input" maxlength="4" placeholder="0" onClick=$("#repsDigits").val($("#repsDigits").val());></td></tr><tr><td align="left" style="padding-top:15px;" class="tdstyle">REST</td><td align="right" style="padding-top:15px;" class="tdstyle"><input type="number" pattern="[0-9]*" id="restfDigits" class="form-input" maxlength="2" placeholder="0" onClick=$("#restfDigits").val($("#restfDigits").val());></td></tr>');
        
        $('#repsfDigits').val(exratio[0]);
        $('#restfDigits').val(exratio[1]);
        
    }else{
        
        $('#openfRatio').html('<tr><td class="tdstyle" width="50%" align="left" style="padding-top:15px; border:none;">INHALE</td><td class="tdstyle" align="right" style="padding-top:15px; border:none;"><input type="number" pattern="[0-9]*" id="inhalefDigits" class="form-input" maxlength="4" placeholder="0" onClick=$("#inhalefDigits").val($("#inhalefDigits").val());></td></tr><tr><td align="left" style="padding-top:15px;" class="tdstyle">HOLD</td><td align="right" style="padding-top:15px;" class="tdstyle"><input type="number" pattern="[0-9]*" id="holdfDigits" class="form-input" maxlength="2" placeholder="0" onClick=$("#holdfDigits").val($("#holdfDigits").val());></td></tr><tr><td align="left" style="padding-top:15px;" class="tdstyle">EXHALE</td><td align="right" style="padding-top:15px;" class="tdstyle"><input type="number" pattern="[0-9]*" id="exhalefDigits" class="form-input" maxlength="2" placeholder="0" onClick=$("#exhalefDigits").val($("#exhalefDigits").val());></td></tr><tr><td align="left" style="padding-top:15px;" class="tdstyle">HOLD</td><td align="right" style="padding-top:15px;" class="tdstyle"><input type="number" pattern="[0-9]*" id="hold2fDigits" class="form-input" maxlength="2" placeholder="0" onClick=$("#hold2fDigits").val($("#hold2fDigits").val());></td></tr>');
        
        $('#inhalefDigits').val(exratio[0]);
        $('#holdfDigits').val(exratio[1]);
        $('#exhalefDigits').val(exratio[2]);
        $('#hold2fDigits').val(exratio[3]);
        
    }
    
    countVal = results.rows.item(0).cValue;
    
    $('#openfcounttext').empty();
    $('#openfcounttext').html('<select id="settimerfradio" class="ddbox" style="color:#224275"><option value="Sets"># SETS</option><option value="Time">TIME</option></select>');
    $('#settimerfradio').val(results.rows.item(0).cType);
    
    if(results.rows.item(0).cType == 'Sets'){
        
        $('#openfCountdigit').empty();
        $('#openfCountdigit').html('<input type="number" pattern="[0-9]*" id="settimerfDigits" class="form-input" maxlength="2" data-clear-btn="true" placeholder="1" onClick=$("#settimerfDigits").val($("#settimerfDigits").val());>');
        $('#settimerfDigits').val(countVal);
        
    }else{
        
        var minc = Math.floor(countVal / 60);
        var secc = countVal % 60;
        
        var minDropdown;
        var secDropdown;
        var tmin = 0;
        var tsec = 0;
        
        for(var tmmins = 0; tmmins <= 60; tmmins++){
            if(tmmins > 9){var tmin = tmmins;}else{var tmin = "0"+tmmins;}
            minDropdown += '<option value="'+tmmins+'">'+tmin+'</option>';
        }
        
        for(var tmsecs = 0; tmsecs <= 59; tmsecs++){
            if(tmsecs > 9){var tsec = tmsecs;}else{var tsec = "0"+tmsecs;}
            secDropdown += '<option value="'+tmsecs+'">'+tsec+'</option>';
        }
        
        $('#openfCountdigit').empty();
        $('#openfCountdigit').html('<select id="setminfDigits" class="ddbox"><option value="mm" Selected>MM</option>'+minDropdown+'</select><select id="setsecfDigits" class="ddbox"><option value="ss" Selected>SS</option>'+secDropdown+'</select>');
        
        $('#setminfDigits').prop('selectedIndex', minc+1);
        $('#setsecfDigits').prop('selectedIndex', secc+1);
        
    }
    
    
    $('#settimerfradio').change(
                               function(){
                               
        if(this.value == 'Sets'){
                               
        $('#openfCountdigit').empty();
        $('#openfCountdigit').html('<input type="number" pattern="[0-9]*" id="settimerfDigits" class="form-input" maxlength="2" data-clear-btn="true" placeholder="1" onClick=$("#settimerfDigits").val($("#settimerfDigits").val());>');
                               
        }else{
                               
        var minDropdown;
        var secDropdown;
        var tmin = 0;
        var tsec = 0;
                               
        for(var tmmins = 0; tmmins <= 60; tmmins++){
                if(tmmins > 9){var tmin = tmmins;}else{var tmin = "0"+tmmins;}
                minDropdown += '<option value="'+tmmins+'">'+tmin+'</option>';
                }
                               
        for(var tmsecs = 0; tmsecs <= 59; tmsecs++){
                if(tmsecs > 9){var tsec = tmsecs;}else{var tsec = "0"+tmsecs;}
                secDropdown += '<option value="'+tmsecs+'">'+tsec+'</option>';
                }
                               
        $('#openfCountdigit').empty();
        $('#openfCountdigit').html('<select id="setminfDigits" class="ddbox"><option value="mm" Selected>MM</option>'+minDropdown+'</select><select id="setsecfDigits" class="ddbox"><option value="ss" Selected>SS</option>'+secDropdown+'</select>');
                               
        }
                               
    });
    
    //Counter Interval Dropdown
    var intervalDropdown;
    
    for(var idecs = 0.5; idecs <= 5; idecs+= 0.25){
        if(idecs.toString().length == 1){var idm = '.00'}
        else if(idecs.toString().length == 3){var idm = '0';}
        else{var idm = '';}
        intervalDropdown += '<option value="'+idecs+'">'+idecs+''+idm+'&nbsp;sec.</option>';
    }
    
    $('#openfInterval').empty();
    
    if(results.rows.item(0).eType == 'Workout'){
    $('#CIdiv').show();
    $('#openfInterval').html('<select id="ifSlider" class="ddbox">'+intervalDropdown+'</select>');
    }else{
    $('#CIdiv').hide();
    $('#openfInterval').html('<select id="ifSlider" class="ddbox" disabled>'+intervalDropdown+'</select>');
    }
    
    $('#ifSlider').val(results.rows.item(0).tInterval);
    
    
    //Start Delay Dropdown
    var delaypDropdown;
    var dsp = 0;
    var dmp = 0;
    
    for(var decsp = 1; decsp <= 60; decsp++){
        if(decsp > 9){var dsp = decsp;}else{var dsp = '0'+decsp;}
        if(decsp % 60 == 0){dmp++;dsp='00';}
        delaypDropdown += '<option value="'+decsp+'">0'+dmp+':'+dsp+'</option>';
    }
    
    //disable it here
    
    $('#openfdelay').empty();
    $('#openfdelay').html('<select id="dfSlider" class="ddbox"><option value="0">MM:SS</option>'+delaypDropdown+'</select>');
    $('#dfSlider').prop('selectedIndex', results.rows.item(0).tDelay);
    
    
    $('#editbtndiv').html('<button style="width:50%; border-right:1px solid #FEFFFF;" onClick="_doSaveFavorites('+results.rows.item(0).nID+');" class="actionbtn">SAVE</button><button id="resetTimer" onClick="_goBack('+"'"+tabType+"'"+')"; class="actionbtn" style="width:50%;">BACK</button>');
    
}


function _doSaveFavorites(fid){
    
    favID = fid;
    
    countVal = '';
    exerciseStr = '';
    countType = '';
    delaysecs = '';
    timeInterval = 1;
    
    tabType = 'Favorites';
    $('#tabspan').empty();
    $('#tabspan').text(tabType);
    
    delaysecs = ($('#dfSlider option:selected').val()=="")? 0 : $('#dfSlider option:selected').val();
    timeInterval = $('#ifSlider option:selected').val();
    
    countType = $('#settimerfradio option:selected').val();
    
    favName = $('#itemfName').val();
                              
    if(favName.length == 0){
        navigator.notification.alert('Please put ITEM name');
        $('#itemfName').focus();
        return false;
    }
    
    favName = favName.replace(/'/g, "''");
    
    if(exerciseType == 'Breathing'){
        
        var inhalefDigits = $('#inhalefDigits').val();
        var holdfDigits = $('#holdfDigits').val();
        var exhalefDigits = $('#exhalefDigits').val();
        var hold2fDigits = $('#hold2fDigits').val();
        
        if(holdfDigits.length==0){holdfDigits=0;}
        if(hold2fDigits.length==0){hold2fDigits=0;}
        
        if(inhalefDigits.length == 0){
            navigator.notification.alert('INHALE is a required field');
            $('#inhalefDigits').focus();
            $('#inhalefDigits').val('');
            return false;
        }else if(inhalefDigits < 1){
            navigator.notification.alert('Please put INHALE value greater than 0');
            $('#inhalefDigits').focus();
            $('#inhalefDigits').val('');
            return false;
        }else if(!chk_numeric.test(inhalefDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#inhalefDigits').focus();
            $('#inhalefDigits').val('');
            return false;
        }else if(inhalefDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#inhalefDigits').focus();
            return false;
        }
        
        if(exhalefDigits.length == 0){
            navigator.notification.alert('EXHALE is a required field');
            $('#exhalefDigits').focus();
            $('#exhalefDigits').val('');
            return false;
        }else if(exhalefDigits < 1){
            navigator.notification.alert('Please put EXHALE value greater than 0');
            $('#exhalefDigits').focus();
            $('#exhalefDigits').val('');
            return false;
        }else if(!chk_numeric.test(exhalefDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#exhalefDigits').focus();
            $('#exhalefDigits').val('');
            return false;
        }else if(exhalefDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#exhalefDigits').focus();
            return false;
        }
        
        if(!chk_numeric.test(holdfDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#holdfDigits').focus();
            $('#holdfDigits').val('');
            return false;
        }else if(holdfDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#holdfDigits').focus();
            return false;
        }
        
        if(!chk_numeric.test(hold2fDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#hold2fDigits').focus();
            $('#hold2fDigits').val('');
            return false;
        }else if(hold2fDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#hold2fDigits').focus();
            return false;
        }
        
        exerciseStr = inhalefDigits+'-'+holdfDigits+'-'+exhalefDigits+'-'+hold2fDigits;
        
    }else{
        
        var repsfDigits = $('#repsfDigits').val();
        var restfDigits = $('#restfDigits').val();
        
        if(restfDigits.length==0){restfDigits=0;}
        
        if(repsfDigits.length == 0){
            navigator.notification.alert('REPS is a required field');
            $('#repsfDigits').focus();
            $('#repsfDigits').val('');
            return false;
        }else if(repsfDigits < 1){
            navigator.notification.alert('Please put REPS value greater than 0');
            $('#repsfDigits').focus();
            $('#repsfDigits').val('');
            return false;
        }else if(!chk_numeric.test(repsfDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#repsfDigits').focus();
            $('#repsfDigits').val('');
            return false;
        }else if(repsfDigits.length > 3){
            navigator.notification.alert('Please put maximum 3 digits number');
            $('#repsfDigits').focus();
            return false;
        }
        
        if(!chk_numeric.test(restfDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#restfDigits').focus();
            $('#restfDigits').val('');
            return false;
        }else if(restfDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#restfDigits').focus();
            return false;
        }
        
        exerciseStr = repsfDigits+'-'+restfDigits;
        
    }
    
    
    if(countType == 'Time'){
        
        var countfValmin = $('#setminfDigits option:selected').val();
        
        if(countfValmin == 'mm'){
            navigator.notification.alert('Please select minute');
            $('#setminfDigits').focus();
            return false;
        }
        
        var countfValsec = $('#setsecfDigits option:selected').val();
        
        if(countfValsec == 'ss'){
            navigator.notification.alert('Please select second');
            $('#setsecfDigits').focus();
            return false;
        }
        
        countVal = (countfValmin * 60) + parseInt(countfValsec);
        
    }else{
        
        countVal = $('#settimerfDigits').val();
        if(countVal.length==0){countVal=1;}
        
        if(countVal < 1){
            navigator.notification.alert('Please put SETS value greater than 0');
            $('#settimerfDigits').focus();
            $('#settimerfDigits').val('');
            return false;
        }else if(!chk_numeric.test(countVal)){
            navigator.notification.alert('Please enter numeric only');
            $('#settimerfDigits').focus();
            $('#settimerfDigits').val('');
            return false;
        }else if(settimerfDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#settimerfDigits').focus();
            return false;
        }
        
    }
    
    countVals = countVal;
    
    if(($('#repsfDigits').val() > 50) && ($('#ifSlider').val() == 0.5))
    {
        navigator.notification.alert('Please put upto 50 Reps for the selected counter interval');
        $('#repsfDigits').focus();
        $('#repsfDigits').val('');
        return false;
    }
    if(($('#repsfDigits').val() > 150) && ($('#ifSlider').val() == 0.75))
    {
        navigator.notification.alert('Please put upto 150 Reps for the selected counter interval');
        $('#repsfDigits').focus();
        $('#repsfDigits').val('');
        return false;
    }
    
    dbobj.transaction(_doUpdateFavorites, errorInsert, successDB2);
    
}


function _doUpdateFavorites(tx) {
                              
    tx.executeSql("UPDATE `FAVRATIO` SET `eRatio`=?, `cType`=?, `cValue`=?, `tDelay`=?, `tInterval`=?, `fName`=? WHERE `nID`=?", [exerciseStr, countType, countVal, delaysecs, timeInterval, favName, favID], SuccessUpdateFAV, errorInsert);
    
}


function deletefmFAV(index,index2){
    
    favID = index;
    exerciseType = index2;
    navigator.notification.confirm(
                                  'Do you want to delete this item from Favorites?',  // message
                                  function(buttonIndex){
                                  if(buttonIndex==1)
                                  {
                                  dbobj.transaction(removeRecordFAV, errorInsert, successDB2);
                                  }
                                  },                  // callback to invoke
                                  'Confirm Delete',    // title
                                  ['Yes','No']          // buttonLabels
                                  );
    
}


//Delete item from favorites
function removeRecordFAV(tx) {
    tx.executeSql('DELETE FROM `FAVRATIO` WHERE `nID`='+favID, [], successRemoveFAV,errorInsert);
}
                              

function successRemoveFAV(tx,result){
    navigator.notification.alert(
                                 'Item removed from Favorites',  // message
                                 alertDismissedF,         // callback
                                 'Confirm Delete',            // title
                                 'Done'                  // buttonName
                                 );
}

function alertDismissedF(){
    
    _goFavorites(exerciseType,0);
    
}




// ----- OTHER FUNCTIONS ------------

function _goCounter(){
    
    $("div[data-role='page']").hide();
    $('#pageone').show();
    
}
                              

function _goFavorites(index,index2){
    
    exerciseType = index;
    levelindex = index2;
    $('.inactivelink').show();
    $('.headerimg').show();
    $('#noItem').hide();
    $('#savedItemsW').hide();
    $('#savedItemsB').hide();
    $("div[data-role='page']").hide();
    $('#pagenine').show();
    if(exerciseType == 'Routines')
    {
        $('#favscreen').css('height','498px');
        dbobj.transaction(selectRecordsRTN, errorInsert, successDB2);
    }else{
        //$('#favscreen').css('height','535px');
        dbobj.transaction(selectRecordsFAV, errorInsert, successDB2);
    }
                              
}
                              
                              
function _go2Feedback(){

    $("div[data-role='page']").hide();
    $('#pageseven').show();

}

                              
function _goSettings(){
    
    $("div[data-role='page']").hide();
    $('#pagefour').show();
    
}

                              
function _back2Settings(){
    
    $("div[data-role='page']").hide();
    $('#msg3').hide();
    $('#otherNews').hide();
    $('#userNews').val('0');
    $('#pagefour').show();
    
}
                              
                         
function selectRecordsRTN(tx)
{
    tx.executeSql('SELECT * FROM `ROUTINEZ`', [], successResultsRTN,errorInsert);
}
                              
                              
function successResultsRTN(tx,results){
    
  z = 0;
  var rfavlist = "";
  totalRoutineTimeArr.length = 0;
                              
  $('#favsubdiv').empty();
  $('#favsubdiv').html('<td align="center" width="33.3%"><a id="wdiv" class="activec" href="javascript:void(0);" onclick="_goFavorites('+"'"+'Workout'+"'"+',0);">WORKOUT</a></td><td align="center" width="33.4%"><a id="bdiv" href="javascript:void(0);" onclick="_goFavorites('+"'"+'Breathing'+"'"+',0);">BREATHING</a></td><td align="center" width="33.3%"><a id="rdiv" href="javascript:void(0);" onclick="_goFavorites('+"'"+'Routines'+"'"+',0);">ROUTINES</a></td>');
                              
  if(results.rows.length == 0)
  {
      $("#noItem").show();
  }
  else
  {
      
      rfavlist = '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">';
      
      for(c=0;c<results.rows.length;c++)
      {
      
        totalRoutineTimeArr[results.rows.item(c).rID] = results.rows.item(c).rTime;
      
        z++;
        rfavlist += '<tr class="ttllst"><td width="72%" align="left"><a href="#" onClick="_doOpenRoutine('+results.rows.item(c).rID+');"><img src="img/circle-play.png" width="24" border="0"/>&nbsp;&nbsp;'+results.rows.item(c).rName+'</a></td><td width="18%" align="left"><input type="button" class="favbtn2" id="rbtn'+results.rows.item(c).rID+'" onclick="_doOpenRDetails('+results.rows.item(c).rID+');" value="Details" /></td><!--<td width="10%" align="right"><a onclick="_doEditRoutine('+results.rows.item(c).rID+')"><img src="img/circle-pencil.png" width="24" border="0"/></a></td>--><td width="10%" align="right"><a onclick="_doDelRoutine('+results.rows.item(c).rID+')"><img src="img/circle-cross.png" width="24" border="0"/></a></td></tr><tr class="ttlfav" id="r'+results.rows.item(c).rID+'"></tr>';
                              
      //if(z == 0){$("#noItem").show();}else{$("#noItem").hide();}
                              
      }
      
                              
      rfavlist += '</table>';
      
      $('#savedItemsR').empty();
      $('#savedItemsR').append(rfavlist);
                              
      }
                              
      $('#rdiv').addClass('activec');
      $('#wdiv').removeClass('activec');
      $('#bdiv').removeClass('activec');
      
      if(z > 0){
      
          $("#savedItemsR").show();
          $("#noItem").hide();
      
      }else{
      
          $("#savedItemsR").hide();
          $("#noItem").show();
      
      }
      
    $('#savedItemsW').hide();
    $('#savedItemsB').hide();
    $('#addrdiv').show();
    $('#createbtn').hide();
    $('#intervalDiv').hide();
                              
}
                              
                              
                              
function _doOpenRDetails(index)
{
    
    rtnID = index;
    dbobj.transaction(findSelectedRoutine, errorInsert, successDB2);

}
                              
                              
function findSelectedRoutine(tx)
{
    
    tx.executeSql('SELECT * FROM `ROUTINELIST` WHERE `rtnID` ='+rtnID, [], getSelectedRdata,errorInsert);
                              
}

                              
function getSelectedRdata(tx,resultrd)
{
    
    if(parseInt(totalRoutineTimeArr[rtnID]) > 0)
    {
        var mintt = Math.floor(parseInt(totalRoutineTimeArr[rtnID]) / 60);
        var sectt = parseInt(totalRoutineTimeArr[rtnID]) % 60;
        var currentMinutes = (mintt > 9) ? mintt : "0" + mintt;
        var currentSeconds = (sectt > 9) ? sectt : "0" + sectt;
        var executionValue = currentMinutes+'&nbsp;min.&nbsp;'+currentSeconds+'&nbsp;sec.';
    }
    else
    {
        var executionValue = "Will show after the full execution of the routine once";
    }
                              
  var rdetaillist = "";
                              
  rdetaillist = '<td colspan="4"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="left">Total items:&nbsp;'+resultrd.rows.length+'</td></tr><tr><td align="left">Execution time:&nbsp;'+executionValue+'</td></tr>';
                              
  for(c=0;c<resultrd.rows.length;c++)
  {
  
      var minp = Math.floor((resultrd.rows.item(c).rtInterval) / 60);
      var secp = (resultrd.rows.item(c).rtInterval) % 60;
      var currentMinutes = (minp > 9) ? minp : "0" + minp;
      var currentSeconds = (secp > 9) ? secp : "0" + secp;
      var intervalValue = currentMinutes+'&nbsp;min.&nbsp;'+currentSeconds+'&nbsp;sec.';
      
      rdetaillist += '<tr><td align="left">'+resultrd.rows.item(c).rfName+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Interval:&nbsp;'+intervalValue+'</td></tr>';
  
  }
                              
  rdetaillist += '</table></td>';
  
  $('#r'+rtnID).empty();
  $('#r'+rtnID).append(rdetaillist);
  $('#r'+rtnID).show();
  $('#rbtn'+rtnID).val('Hide');
  $('#rbtn'+rtnID).attr("onclick", "_doHideRDetails("+rtnID+")");

}


function _doHideRDetails(index){

    $("#r"+index).hide();
    $("#rbtn"+index).val('Details');
    $("#rbtn"+index).attr("onclick", "_doOpenRDetails("+index+")");

}
                              
                              
                              
/*function _doEditRoutine(index)
{
    
    rtnID = index;
    dbobj.transaction(editRecordRTN, errorInsert, successDB2);

}
                              
                              
function editRecordRTN()
{

    tx.executeSql('SELECT * FROM `ROUTINELIST` WHERE `rtnID` = '+rtnID+' ORDER BY `riOrder` ASC', [], showRoutineItems, errorInsert);

}
                              
                              
function showRoutineItems(tx,result)
{

    for(var orange = 1; orange <= result.rows.length; orange++){
    var orderDD += '<option value="'+orange+'">'+orange+'</option>';
    }
                              
    rfavlist = '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">';

    for(c=0;c<results.rows.length;c++)
    {

    totalRoutineTimeArr[results.rows.item(c).rID] = results.rows.item(c).rTime;

    z++;
    rfavlist += '<tr class="ttllst"><td width="62%" align="left"><a href="#" onClick="_doOpenRoutine('+results.rows.item(c).rID+');"><img src="img/circle-play.png" width="24" border="0"/>&nbsp;&nbsp;'+results.rows.item(c).rName+'</a></td><td width="18%" align="left"><input type="button" class="favbtn2" id="rbtn'+results.rows.item(c).rID+'" onclick="_doOpenRDetails('+results.rows.item(c).rID+');" value="Details" /></td><td width="10%" align="right"><a onclick="_doEditRoutine('+results.rows.item(c).rID+')"><img src="img/circle-pencil.png" width="24" border="0"/></a></td><td width="10%" align="right"><a onclick="_doDelRoutine('+results.rows.item(c).rID+')"><img src="img/circle-cross.png" width="24" border="0"/></a></td></tr><tr class="ttlfav" id="r'+results.rows.item(c).rID+'"></tr>';

    //if(z == 0){$("#noItem").show();}else{$("#noItem").hide();}

    }


    rfavlist += '</table>';

    $('#savedItemsR').empty();
    $('#savedItemsR').append(rfavlist);

    $("#intervalDiv").empty();
    $("#createbtn").empty();
    $("#createbtn").html('<button onClick="_doSelectFAVitem();" class="actionbtn" style="width:50%; border-right:1px solid #FEFFFF;">ADD MORE ITEM</button><button onClick="_doSelectFAVitem();" class="actionbtn" style="width:50%;">SAVE CHANGES</button>');

}*/
                              

function _doCreateRoutine()
{
    
    var minuteDD;
    var secondDD;
    var tmin = 0;
    var tsec = 0;
    itemArray.length = 0;
    timeArray.length = 0;
    routinesIStr = "";
    routinesTStr = "";
    rcntr = 0;
    $(".inactivelink").hide();
    $(".headerimg").hide();

    for(var tmmins = 0; tmmins <= 60; tmmins++){

    if(tmmins > 9){var tmin = tmmins;}else{var tmin = "0"+tmmins;}
    minuteDD += '<option value="'+tmmins+'">'+tmin+'</option>';

    }

    for(var tmsecs = 0; tmsecs <= 59; tmsecs++){

    if(tmsecs > 9){var tsec = tmsecs;}else{var tsec = "0"+tmsecs;}
    secondDD += '<option value="'+tmsecs+'">'+tsec+'</option>';

    }
                              
    $("#intervalDiv").html('<table class="fixbottomstyle" border="0" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;"><tr><td class="tdstyle" width="50%" align="left">INTERVAL:</td><td class="tdstyle" width="50%" align="right"><select id="intvalMin" class="ddbox"><option value="mm" Selected>Min</option>'+minuteDD+'</select><select id="intvalSec" class="ddbox"><option value="ss" Selected>Sec</option>'+secondDD+'</select></td></tr></table>');
    $("#createbtn").html('<button onClick="_doSelectFAVitem();" class="actionbtn" style="width:100%;">NEXT</button>');

                              
    _goFavorites('Workout',1);
                              
}
                              
                              
function _doDelRoutine(index){
                              
    rtnID = index;
                              
    navigator.notification.confirm(
        'Do you want to delete this routine?',  // message
            function(buttonIndex){
                if(buttonIndex==1)
                {
                dbobj.transaction(removeRecordRTN, errorInsert, successDB2);
                }
            },                  // callback to invoke
            'Confirm Delete',    // title
            ['Yes','No']          // buttonLabels
    );
                              
}
                              
                              
//Delete item from favorites
function removeRecordRTN(tx){
                              
    tx.executeSql('DELETE FROM `ROUTINEZ` WHERE `rID`='+rtnID, [], successRemoveRTN,errorInsert);
                              
}
                              
function successRemoveRTN(tx,result)
{
                              
    navigator.notification.alert(
                                 
        'Routine deleted',  // message
        alertDismissedR,   // callback
        'Deleted',  // title
        'Done'             // buttonName
    
    );
                              
}
                              
function alertDismissedR(){
                              
    _goFavorites('Routines',0);
                              
}
                              

function _doSelectFAVitem(){
                              
    itemArray.length = 0;
    var selectedFavItem = "";
    var selectedIntMin = "";
    var selectedIntSec = "";
    var selectedInterval = "";
                              
    selectedFavItem = $('input:radio[name="favitemID"]:checked').val();

    if(selectedFavItem == ""){
        navigator.notification.alert('Please select any item');
        return false;
    }
    
    selectedIntMin = $('#intvalMin').val();

    if(selectedIntMin == 'mm'){
        navigator.notification.alert('Please select minute');
        $('#intvalMin').focus();
        return false;
    }

    selectedIntSec = $('#intvalSec').val();

    if(selectedIntSec == 'ss'){
        navigator.notification.alert('Please select second');
        $('#intvalSec').focus();
        return false;
    }
                              
    selectedInterval = (selectedIntMin * 60) + parseInt(selectedIntSec);
                              
    if(routinesIStr == ""){routinesIStr = selectedFavItem;}else{routinesIStr = routinesIStr+'|'+selectedFavItem;}
    if(routinesTStr == ""){routinesTStr = selectedInterval;}else{routinesTStr = routinesTStr+'|'+selectedInterval;}
    
    itemArray = routinesIStr.split('|');
                              
    if(itemArray.length >= 2)
    {
        $("#createbtn").html('<button onClick="_doSelectFAVitem();" class="actionbtn" style="width:50%; border-right:1px solid #FEFFFF;">NEXT</button><button onClick="_doSaveRoutine();" class="actionbtn" style="width:50%;">SAVE</button>');
    }
                              
    $('#intvalMin').val('mm');
    $('#intvalSec').val('ss');
    $('input:radio[name="favitemID"]').prop('checked', false);

}
                              
            
function _doSaveRoutine()
{
    
    var selectedFavItem = "";
    var selectedIntMin = "";
    var selectedIntSec = "";
    var selectedInterval = "";
    itemArray.length = 0;

    selectedFavItem = $('input:radio[name="favitemID"]:checked').val();
    selectedIntMin = $('#intvalMin').val();
    selectedIntSec = $('#intvalSec').val();
                              
    if(selectedFavItem != "" && selectedIntMin != 'mm' && selectedIntSec != 'ss'){
    
        selectedInterval = (selectedIntMin * 60) + parseInt(selectedIntSec);
        
        routinesIStr = routinesIStr+'|'+selectedFavItem;
        routinesTStr = routinesTStr+'|'+selectedInterval;
        
        itemArray = routinesIStr.split('|');
        
    }
     //alert(routinesTStr);
    navigator.notification.prompt(
    'Please enter a name',  // message
        function(resultD){
            if(resultD.buttonIndex==1)
            {
                routineName = resultD.input1;
                routineName = routineName.replace(/'/g, "''");
                dbobj.transaction(createNewRoutine, errorInsert, successDB2);
            }
        },                 // callback to invoke
        'Save as Routine', // title
        ['Save','Cancel'], // buttonLabels
        ''                 // defaultText
    );
                              
}


function createNewRoutine(tx)
{
    
    tx.executeSql("INSERT INTO `ROUTINEZ`(`rName`, `rTime`, `rStatus`) VALUES('"+routineName+"', 0, 0)", [], getLatestRoutine, errorInsert);
                    
}
                  
                  
function getLatestRoutine(tx)
{
                  
    tx.executeSql("SELECT `rID` FROM `ROUTINEZ` WHERE `rName` = '"+routineName+"'", [], createRoutineList, errorInsert);

}


function createRoutineList(tx,resultr)
{
    
    lastroutineid = resultr.rows.item(0).rID;
    timeArray.length = 0;
    timeArray = routinesTStr.split('|');
                                  
    for(var k=0;k<itemArray.length;k++)
    {
        tx.executeSql('SELECT * FROM `FAVRATIO` WHERE `nID` = '+ itemArray[k], [], getFavData, errorInsert);
    }

}


function getFavData(tx,resultf2r)
{
        
    favName = resultf2r.rows.item(0).fName;
    exerciseType = resultf2r.rows.item(0).eType;
    exerciseStr = resultf2r.rows.item(0).eRatio;
    countType = resultf2r.rows.item(0).cType;
    countVal = resultf2r.rows.item(0).cValue;
    timeInterval = resultf2r.rows.item(0).tInterval;
                                  
    tx.executeSql("INSERT INTO `ROUTINELIST`(`rfName`, `reType`, `reRatio`, `rcType`, `rcValue`, `rcInterval`, `rtInterval`, `rtnID`) VALUES('"+favName+"','"+exerciseType+"','"+exerciseStr+"','"+countType+"','"+countVal+"','"+timeInterval+"','"+timeArray[rcntr]+"',"+lastroutineid+")", [], getRoutineList, errorInsert);
                                  
    rcntr++;
    
}


function getRoutineList(tx)
{

    _goFavorites('Routines',0);
                                  
}
                                  
                                  
function _doOpenRoutine(index)
{

    clearTimeout(delaytimer);
    clearTimeout(tmcounter);
    clearTimeout(cntdwntmr);
    clearTimeout(clocktimer);

    j = 0;
    k = 1;
    i = 1;
    curset = 1;
                                  
    routineItemsArr.length = 0;
    routineTimesArr.length = 0;
    
    rtnID = index;
    dbobj.transaction(getRoutineItem1, errorInsert, successDB2);

}


function getRoutineItem1(tx)
{
    tx.executeSql('SELECT * FROM `ROUTINELIST` WHERE `rtnID` = '+rtnID+' ORDER BY `rlID` ASC', [], getRoutineItem1Data, errorInsert);
}
                                  
                                  
function getRoutineItem1Data(tx,result)
{
    
    routineItemName = "";
    $("div[data-role='page']").hide();
    $('#pageten').show();
    $('#openItem').empty();
    $('#intertvalfdiv').text(result.rows.item(0).rcInterval);
    $('#typespanf').text(result.rows.item(0).reType);
    
    routineItemName = result.rows.item(0).rfName;
                                  
    var exratio = (result.rows.item(0).reRatio).split('-');

    var dbstring = '10'+'|'+(result.rows.item(0).rcInterval)+'|'+(result.rows.item(0).reType)+'|'+(result.rows.item(0).rcType);

    if(result.rows.item(0).reType == 'Workout'){

        $('#sliderFF').show();
        $('#openItem').html('<tr><td align="left" class="tdstyle" style="border-top:none;"># REPS</td><td align="right" class="tdstyle" style="border-top:none;"><span style="color:#66665E;">'+exratio[0]+'</span></td></tr><tr><td align="left" class="tdstyle">REST</td><td class="tdstyle" align="right"><span style="color:#66665E;">'+exratio[1]+'</span></td></tr>');

    }else{

        $('#sliderFF').hide();
        $('#openItem').html('<tr><td align="left" class="tdstyle" style="border-top:none;">INHALE</td><td align="right" class="tdstyle" style="border-top:none;"><span style="color:#66665E;">'+exratio[0]+'</span></td></tr><tr><td align="left" class="tdstyle">HOLD</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+exratio[1]+'</span></td></tr><tr><td align="left" class="tdstyle">EXHALE</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+exratio[2]+'</span></td></tr><tr><td align="left" class="tdstyle">HOLD</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+exratio[3]+'</span></td></tr>');

    }

    $('#countingTypef').text(result.rows.item(0).rcType);
    $('#delayftext').text('INTERVAL');
    $('#delayfdiv').text(result.rows.item(0).rtInterval);
                                  
    countVal = result.rows.item(0).rcValue;

    if(result.rows.item(0).rcType == 'Time'){

        var minc = Math.floor(countVal / 60);
        var secc = countVal % 60;
        var currentMinutes = (minc > 9) ? minc : "0" + minc;
        var currentSeconds = (secc > 9) ? secc : "0" + secc;
        countVals = currentMinutes+':'+currentSeconds;

    }else{

        countVals = countVal;

    }

    $('#totalCountingf').text(countVals);
    $('#favbtndiv').empty();
    $('#favbtndiv').html('<button style="width:50%; border-right:1px solid #FEFFFF;" onClick="_doStartFavorites('+"'"+dbstring+"'"+','+"'"+result.rows.item(0).reRatio+"'"+','+"'"+result.rows.item(0).rcValue+"'"+','+"'"+'Routines'+"'"+');" class="actionbtn">START</button><button onClick="_goFavorites('+"'"+'Routines'+"'"+',0);" class="actionbtn" style="width:50%;">BACK</button>');

}


$(document).ready(function(){
                  
                  
    var delayDropdown;
    var ds = 0;
    var dm = 0;
                  
    for(var decs = 1; decs <= 60; decs++){
    if(decs > 9){var ds = decs;}else{var ds = '0'+decs;}
    if(decs % 60 == 0){dm++;ds='00';}
    delayDropdown += '<option value="'+decs+'">0'+dm+':'+ds+'</option>';
    }
                  
    $("#delaydiv").empty();
    $("#delaydiv").html('<select id="dSlider" class="ddbox"><option value="0">MM:SS</option>'+delayDropdown+'</select>');
    $("#dSlider").prop('selectedIndex', 10);
                  
                  
    
    var intervalDropdown;
                  
    for(var idecs = 0.5; idecs <= 5; idecs+= 0.25){
    if(idecs.toString().length == 1){var idm = '.00';}
    else if(idecs.toString().length == 3){var idm = '0';}
    else{var idm = '';}
    intervalDropdown += '<option value="'+idecs+'">'+idecs+''+idm+'&nbsp;sec.</option>';
    }
                  
    
    $("#intervaldiv").empty();
    $("#intervaldiv").html('<select id="iSlider" class="ddbox">'+intervalDropdown+'</select>');
    $("#iSlider").prop('selectedIndex', 2);
                  
                  
                  
$('#exerciseradio').change(
                           function(){
                                             
                                              
    if(this.value == 'Breathing'){
                                        
        $("#exercisediv").empty();
        $("#exercisediv").html('<tr><td class="tdstyle" width="50%" align="left" style="padding-top:15px; border:none;">INHALE</td><td class="tdstyle" align="right" style="padding-top:15px; border:none;"><input type="number" pattern="[0-9]*" id="inhaleDigits" class="form-input" maxlength="4" placeholder="0" onClick=$("#inhaleDigits").val($("#inhaleDigits").val());></td></tr><tr><td align="left" style="padding-top:15px;" class="tdstyle">HOLD</td><td align="right" style="padding-top:15px;" class="tdstyle"><input type="number" pattern="[0-9]*" id="holdDigits" class="form-input" maxlength="2" placeholder="0" onClick=$("#holdDigits").val($("#holdDigits").val());></td></tr><tr><td align="left" style="padding-top:15px;" class="tdstyle">EXHALE</td><td align="right" style="padding-top:15px;" class="tdstyle"><input type="number" pattern="[0-9]*" id="exhaleDigits" class="form-input" maxlength="2" placeholder="0" onClick=$("#exhaleDigits").val($("#exhaleDigits").val());></td></tr><tr><td align="left" style="padding-top:15px;" class="tdstyle">HOLD</td><td align="right" style="padding-top:15px;" class="tdstyle"><input type="number" pattern="[0-9]*" id="hold2Digits" class="form-input" maxlength="2" placeholder="0" onClick=$("#hold2Digits").val($("#hold2Digits").val());></td></tr>');
                           
        $('#iSlider').attr('disabled', true);
        $('#iSlider').prop('selectedIndex', 2);
        $('#sliderCC').hide();
                                              
    }else{
                                              
        $("#exercisediv").empty();
        $("#exercisediv").html('<tr><td class="tdstyle" width="50%" align="left" style="padding-top:15px; border:none;"># REPS</td><td align="right" style="padding-top:15px; border:none;" class="tdstyle"><input type="number" pattern="[0-9]*" id="repsDigits" class="form-input" maxlength="4" placeholder="0" onClick=$("#repsDigits").val($("#repsDigits").val());></td></tr><tr><td align="left" style="padding-top:15px;" class="tdstyle">REST</td><td align="right" style="padding-top:15px;" class="tdstyle"><input type="number" pattern="[0-9]*" id="restDigits" class="form-input" maxlength="2" placeholder="0" onClick=$("#restDigits").val($("#restDigits").val());></td></tr>');
                           
        $('#iSlider').removeAttr('disabled');
        $('#iSlider').prop('selectedIndex', 2);
        $('#sliderCC').show();
                                              
    }
            
    });
                  
                  
$('#settimerradio').change(
                          function(){
                                              
    if(this.value == 'Sets'){
                                                                
        $("#settimerdiv").empty();
        $("#settimerdiv").html('<input type="number" pattern="[0-9]*" id="settimerDigits" class="form-input" maxlength="2" data-clear-btn="true" placeholder="1" onClick=$("#settimerDigits").val($("#settimerDigits").val());>');
                                                                
    }else{
                           
        var minDropdown;
        var secDropdown;
        var tmin = 0;
        var tsec = 0;
                           
        for(var tmmins = 0; tmmins <= 60; tmmins++){
                           
        if(tmmins > 9){var tmin = tmmins;}else{var tmin = "0"+tmmins;}
                           
        minDropdown += '<option value="'+tmmins+'">'+tmin+'</option>';
        }
                           
        for(var tmsecs = 0; tmsecs <= 59; tmsecs++){
                           
        if(tmsecs > 9){var tsec = tmsecs;}else{var tsec = "0"+tmsecs;}
                           
        secDropdown += '<option value="'+tmsecs+'">'+tsec+'</option>';
        }
                                                                
        $("#settimerdiv").empty();
        $("#settimerdiv").html('<select id="setminDigits" class="ddbox"><option value="mm" Selected>MM</option>'+minDropdown+'</select><select id="setsecDigits" class="ddbox"><option value="ss" Selected>SS</option>'+secDropdown+'</select>');
                                                                
    }
                                                                
    });
                  
});
                              
                              
function _doOpenFavorites(fid)
{
    
    clearTimeout(delaytimer);
    clearTimeout(tmcounter);
    clearTimeout(cntdwntmr);

    j = 0;
    k = 1;
    i = 1;
    curset = 1;
                                  
    favID = fid;
    dbobj.transaction(openItemFAV, errorInsert, successDB2);
    
}


function openItemFAV(tx)
{
    tx.executeSql('SELECT * FROM `FAVRATIO` WHERE `nID` ='+favID, [], successResultFAV, errorInsert);
}


function successResultFAV(tx,result){
    
    $("div[data-role='page']").hide();
    $('#pageten').show();
    $('#openItem').empty();
    $('#intertvalfdiv').text(result.rows.item(0).tInterval);
    $('#delayftext').text('START DELAY');
    $('#delayfdiv').text(result.rows.item(0).tDelay);
    $('#typespanf').text(result.rows.item(0).eType);
    
    var exratio = (result.rows.item(0).eRatio).split('-');
    
    var dbstring = (result.rows.item(0).tDelay)+'|'+result.rows.item(0).tInterval+'|'+(result.rows.item(0).eType)+'|'+(result.rows.item(0).cType);
    
    if(result.rows.item(0).eType == 'Workout'){
        
        $('#sliderFF').show();
        $('#openItem').html('<tr><td align="left" class="tdstyle" style="border-top:none;"># REPS</td><td align="right" class="tdstyle" style="border-top:none;"><span style="color:#66665E;">'+exratio[0]+'</span></td></tr><tr><td align="left" class="tdstyle">REST</td><td class="tdstyle" align="right"><span style="color:#66665E;">'+exratio[1]+'</span></td></tr>');
        
    }else{
        
        $('#sliderFF').hide();
        $('#openItem').html('<tr><td align="left" class="tdstyle" style="border-top:none;">INHALE</td><td align="right" class="tdstyle" style="border-top:none;"><span style="color:#66665E;">'+exratio[0]+'</span></td></tr><tr><td align="left" class="tdstyle">HOLD</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+exratio[1]+'</span></td></tr><tr><td align="left" class="tdstyle">EXHALE</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+exratio[2]+'</span></td></tr><tr><td align="left" class="tdstyle">HOLD</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+exratio[3]+'</span></td></tr>');
        
    }
    
    $('#countingTypef').text(result.rows.item(0).cType);
    
    countVal = result.rows.item(0).cValue;
    
    if(result.rows.item(0).cType == 'Time'){
        
        var minc = Math.floor(countVal / 60);
        var secc = countVal % 60;
        var currentMinutes = (minc > 9) ? minc : "0" + minc;
        var currentSeconds = (secc > 9) ? secc : "0" + secc;
        countVals = currentMinutes+':'+currentSeconds;
        
    }else{
        
        countVals = countVal;
        
    }
    
    $('#totalCountingf').text(countVals);
    
    $('#favbtndiv').html('<button style="width:50%; border-right:1px solid #FEFFFF;" onClick="_doStartFavorites('+"'"+dbstring+"'"+','+"'"+result.rows.item(0).eRatio+"'"+','+"'"+result.rows.item(0).cValue+"'"+','+"'"+result.rows.item(0).eType+"'"+');" class="actionbtn">START</button><button id="resetTimer" onClick="_goBack('+"'"+tabType+"'"+')"; class="actionbtn" style="width:50%;">BACK</button>');
    
}


/************************************** Start favorite counter ****************************************/
                              

function _doStartFavorites(index,index2,index3,index4){

    countVal = '';
    exerciseStr = '';
    countType = '';
    delaysecs = '';
    timeInterval = 1;
    FavItemType = '';
                                  
    FavItemType = index4;
    
    tabType = 'Favorites';
    $('#tabspan').empty();
    $('#tabspan').text(tabType);
    
    var dbarray2 = index2.split('-');
    var dbarray = index.split('|');
    
    delaysecs = dbarray[0];
    timeInterval = dbarray[1];
    exerciseType = dbarray[2];
    countType = dbarray[3];
    
    if(exerciseType == 'Breathing'){
        
        var inhaleDigits = dbarray2[0];
        var holdDigits = dbarray2[1];
        var exhaleDigits = dbarray2[2];
        var hold2Digits = dbarray2[3];
        
        exerciseStr = inhaleDigits+'-'+holdDigits+'-'+exhaleDigits+'-'+hold2Digits;
        
    }else{
        
        var repsDigits = dbarray2[0];
        var restDigits = dbarray2[1];
        
        exerciseStr = repsDigits+'-'+restDigits;
        
    }
    
    countVal = index3;
    
    if(countType == 'Time'){
        
        var minc = Math.floor(countVal / 60);
        var secc = countVal % 60;
        var currentMinutes = (minc > 9) ? minc : "0" + minc;
        var currentSeconds = (secc > 9) ? secc : "0" + secc;
        countVals = currentMinutes+':'+currentSeconds;
        
    }else{
        
        countVals = countVal;
        
    }
    
    $('#typespan').empty();
    $('#typespan').text(exerciseType);
    $('#cntr').empty();
    $('#cntr').text(0);
    
    if(FavItemType == 'Routines'){
                                  
        dbobj.transaction(getRoutineItems, errorInsert, successDB2);
                                  
    }else{

        delay2ready(delaysecs);
                                  
    }
    

}

/************************************** Go to previous *****************************************/

function _goBack(tpe){
    
    $("#btndiv").empty();
    $("#cntr").empty();
    $("#currentStage").empty();
    $("#countType").empty();
    $("#currentSet").empty();
    $("#totalCount").empty();
    
    clearTimeout(delaytimer);
    clearTimeout(tmcounter);
    clearTimeout(cntdwntmr);
    
    j = 0;
    k = 1;
    i = 1;
    curset = 1;
    
    delaysecs = startdelay;
    
       $("div[data-role='page']").hide();
	   
	   if(tpe == 'Counter'){
           $("#pageone").show();
       }else{
           $("#pagenine").show();
       }
    
}

/************************************** Fill required fields to save as favorite ***************************************/

function saveAsFAV()
{
    
    countVal = '';
    exerciseStr = '';
    countType = '';
    delaysecs = '';
    timeInterval = 1;
    
    tabType = 'Counter';
    $('#tabspan').empty();
    $('#tabspan').text(tabType);
    
    delaysecs = ($('#dSlider option:selected').val()=="")? 0 : $('#dSlider option:selected').val();
    timeInterval = $('#iSlider option:selected').val();
    
    exerciseType = $('#exerciseradio option:selected').val();
    countType = $('#settimerradio option:selected').val();
    
    if(exerciseType == 'Breathing'){
        
        var inhaleDigits = $('#inhaleDigits').val();
        var holdDigits = $('#holdDigits').val();
        var exhaleDigits = $('#exhaleDigits').val();
        var hold2Digits = $('#hold2Digits').val();
        
        if(holdDigits.length==0){holdDigits=0;}
        if(hold2Digits.length==0){hold2Digits=0;}
        
        if(inhaleDigits.length == 0){
            navigator.notification.alert('INHALE is a required field');
            $('#inhaleDigits').focus();
            $('#inhaleDigits').val('');
            return false;
        }else if(inhaleDigits < 1){
            navigator.notification.alert('Please put INHALE value greater than 0');
            $('#inhaleDigits').focus();
            $('#inhaleDigits').val('');
            return false;
        }else if(!chk_numeric.test(inhaleDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#inhaleDigits').focus();
            $('#inhaleDigits').val('');
            return false;
        }else if(inhaleDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#inhaleDigits').focus();
            return false;
        }
        
        if(exhaleDigits.length == 0){
            navigator.notification.alert('EXHALE is a required field');
            $('#exhaleDigits').focus();
            $('#exhaleDigits').val('');
            return false;
        }else if(exhaleDigits < 1){
            navigator.notification.alert('Please put EXHALE value greater than 0');
            $('#exhaleDigits').focus();
            $('#exhaleDigits').val('');
            return false;
        }else if(!chk_numeric.test(exhaleDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#exhaleDigits').focus();
            $('#exhaleDigits').val('');
            return false;
        }else if(exhaleDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#exhaleDigits').focus();
            return false;
        }
        
        if(!chk_numeric.test(holdDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#holdDigits').focus();
            $('#holdDigits').val('');
            return false;
        }else if(holdDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#holdDigits').focus();
            return false;
        }
        
        if(!chk_numeric.test(hold2Digits)){
            navigator.notification.alert('Please enter numeric only');
            $('#hold2Digits').focus();
            $('#hold2Digits').val('');
            return false;
        }else if(hold2Digits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#hold2Digits').focus();
            return false;
        }
        
        exerciseStr = inhaleDigits+'-'+holdDigits+'-'+exhaleDigits+'-'+hold2Digits;
        
    }else{
        
        var repsDigits = $('#repsDigits').val();
        var restDigits = $('#restDigits').val();
        
        if(restDigits.length==0){restDigits=0;}
        
        if(repsDigits.length == 0){
            navigator.notification.alert('REPS is a required field');
            $('#repsDigits').focus();
            $('#repsDigits').val('');
            return false;
        }else if(repsDigits < 1){
            navigator.notification.alert('Please put REPS value greater than 0');
            $('#repsDigits').focus();
            $('#repsDigits').val('');
            return false;
        }else if(!chk_numeric.test(repsDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#repsDigits').focus();
            $('#repsDigits').val('');
            return false;
        }else if(repsDigits.length > 3){
            navigator.notification.alert('Please put maximum 3 digits number');
            $('#repsDigits').focus();
            return false;
        }
        
        if(!chk_numeric.test(restDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#restDigits').focus();
            $('#restDigits').val('');
            return false;
        }else if(restDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#restDigits').focus();
            return false;
        }
        
        exerciseStr = repsDigits+'-'+restDigits;
        
    }
    
    
    if(countType == 'Time'){
        
        var countValmin = $('#setminDigits option:selected').val();
        
        if(countValmin == 'mm'){
            navigator.notification.alert('Please select minute');
            $('#setminDigits').focus();
            return false;
        }
        
        var countValsec = $('#setsecDigits option:selected').val();
        
        if(countValsec == 'ss'){
            navigator.notification.alert('Please select second');
            $('#setsecDigits').focus();
            return false;
        }
        
        countVal = (countValmin * 60) + parseInt(countValsec);
        
    }else{
        
        countVal = $('#settimerDigits').val();
        if(countVal.length==0){countVal=1;}
        
        if(countVal < 1){
            navigator.notification.alert('Please put SETS value greater than 0');
            $('#settimerDigits').focus();
            $('#settimerDigits').val('');
            return false;
        }else if(!chk_numeric.test(countVal)){
            navigator.notification.alert('Please enter numeric only');
            $('#settimerDigits').focus();
            $('#settimerDigits').val('');
            return false;
        }else if($('#settimerDigits').length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#settimerDigits').focus();
            return false;
        }
        
    }
    
    if(($('#repsDigits').val() > 50) && ($('#iSlider').val() == 0.5))
    {
        navigator.notification.alert('Please put upto 50 Reps for the selected counter interval');
        $('#repsDigits').focus();
        $('#repsDigits').val('');
        return false;
    }
    if(($('#repsDigits').val() > 150) && ($('#iSlider').val() == 0.75))
    {
        navigator.notification.alert('Please put upto 150 Reps for the selected counter interval');
        $('#repsDigits').focus();
        $('#repsDigits').val('');
        return false;
    }
    
    countVals = countVal;
    
    
    navigator.notification.prompt(
                                  'Please enter a name',  // message
                                  function(resultD){
                                  if(resultD.buttonIndex==1)
                                  {
                                  favName = resultD.input1;
                                  favName = favName.replace(/'/g, "''");
                                  dbobj.transaction(insertRecordFAV, errorInsert, successDB2);
                                  }
                                },                  // callback to invoke
                                  'Save as Favorites',            // title
                                  ['Save','Cancel'],             // buttonLabels
                                  ''                 // defaultText
                                  );
    
}
                                  

/************************************** Set required fields to start counter *********************************/
                                  

function _doStartCounter(){
    
    countVal = '';
    exerciseStr = '';
    countType = '';
    delaysecs = '';
    timeInterval = 1;
    
    delaysecs = ($('#dSlider option:selected').val()=="")? 10 : $('#dSlider option:selected').val();
    timeInterval = $('#iSlider option:selected').val();
    
    tabType = 'Counter';
    $('#tabspan').empty();
    $('#tabspan').text(tabType);
    
    exerciseType = $('#exerciseradio option:selected').val();
    countType = $('#settimerradio option:selected').val();
    
    if(exerciseType == 'Breathing'){
            
        var inhaleDigits = $('#inhaleDigits').val();
        var holdDigits = $('#holdDigits').val();
        var exhaleDigits = $('#exhaleDigits').val();
        var hold2Digits = $('#hold2Digits').val();
        
        if(holdDigits.length==0){holdDigits=0;}
        if(hold2Digits.length==0){hold2Digits=0;}
        
        if(inhaleDigits.length == 0){
            navigator.notification.alert('INHALE is a required field');
            $('#inhaleDigits').focus();
            $('#inhaleDigits').val('');
            return false;
        }else if(inhaleDigits < 1){
            navigator.notification.alert('Please put INHALE value greater than 0');
            $('#inhaleDigits').focus();
            $('#inhaleDigits').val('');
            return false;
        }else if(!chk_numeric.test(inhaleDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#inhaleDigits').focus();
            $('#inhaleDigits').val('');
            return false;
        }else if(inhaleDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#inhaleDigits').focus();
            return false;
        }
        
        if(exhaleDigits.length == 0){
            navigator.notification.alert('EXHALE is a required field');
            $('#exhaleDigits').focus();
            $('#exhaleDigits').val('');
            return false;
        }else if(exhaleDigits < 1){
            navigator.notification.alert('Please put EXHALE value greater than 0');
            $('#exhaleDigits').focus();
            $('#exhaleDigits').val('');
            return false;
        }else if(!chk_numeric.test(exhaleDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#exhaleDigits').focus();
            $('#exhaleDigits').val('');
            return false;
        }else if(exhaleDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#exhaleDigits').focus();
            return false;
        }
        
        if(!chk_numeric.test(holdDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#holdDigits').focus();
            $('#holdDigits').val('');
            return false;
        }else if(holdDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#holdDigits').focus();
            return false;
        }
        
        if(!chk_numeric.test(hold2Digits)){
            navigator.notification.alert('Please enter numeric only');
            $('#hold2Digits').focus();
            $('#hold2Digits').val('');
            return false;
        }else if(hold2Digits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#hold2Digits').focus();
            return false;
        }
        
    exerciseStr = inhaleDigits+'-'+holdDigits+'-'+exhaleDigits+'-'+hold2Digits;
        
    }else{
        
        var repsDigits = $('#repsDigits').val();
        var restDigits = $('#restDigits').val();
        
        if(restDigits.length==0){restDigits=0;}
        
        if(repsDigits.length == 0){
            navigator.notification.alert('REPS is a required field');
            $('#repsDigits').focus();
            $('#repsDigits').val('');
            return false;
        }else if(repsDigits < 1){
            navigator.notification.alert('Please put REPS value greater than 0');
            $('#repsDigits').focus();
            $('#repsDigits').val('');
            return false;
        }else if(!chk_numeric.test(repsDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#repsDigits').focus();
            $('#repsDigits').val('');
            return false;
        }else if(repsDigits.length > 3){
            navigator.notification.alert('Please put maximum 3 digits number');
            $('#repsDigits').focus();
            return false;
        }
        
        if(!chk_numeric.test(restDigits)){
            navigator.notification.alert('Please enter numeric only');
            $('#restDigits').focus();
            $('#restDigits').val('');
            return false;
        }else if(restDigits.length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#restDigits').focus();
            return false;
        }
        
    exerciseStr = repsDigits+'-'+restDigits;
        
    }
    
        
    if(countType == 'Time'){
        
        var countValmin = $('#setminDigits option:selected').val();
        
        if(countValmin == 'mm'){
            navigator.notification.alert('Please select minute');
            $('#setminDigits').focus();
            return false;
        }
        
        var countValsec = $('#setsecDigits option:selected').val();
        
        if(countValsec == 'ss'){
            navigator.notification.alert('Please select second');
            $('#setsecDigits').focus();
            return false;
        }
        
        countVal = (countValmin * 60) + parseInt(countValsec);
        
    }else{
        
        countVal = $('#settimerDigits').val();
        if(countVal.length==0){countVal=1;}
        
        if(countVal < 1){
            navigator.notification.alert('Please put SETS value greater than 0');
            $('#settimerDigits').focus();
            $('#settimerDigits').val('');
            return false;
        }else if(!chk_numeric.test(countVal)){
            navigator.notification.alert('Please enter numeric only');
            $('#settimerDigits').focus();
            $('#settimerDigits').val('');
            return false;
        }else if($('#settimerDigits').length > 2){
            navigator.notification.alert('Please put maximum 2 digits number');
            $('#settimerDigits').focus();
            return false;
        }
        
    }
    
    if(countType == 'Time'){
        
        var minc = Math.floor(countVal / 60);
        var secc = countVal % 60;
        var currentMinutes = (minc > 9) ? minc : "0" + minc;
        var currentSeconds = (secc > 9) ? secc : "0" + secc;
        countVals = currentMinutes+':'+currentSeconds;
        
    }else{
        
        countVals = countVal;
        
    }
    
    if(($('#repsDigits').val() > 50) && ($('#iSlider').val() == 0.5))
    {
        navigator.notification.alert('Please put upto 50 Reps for the selected counter interval');
        $('#repsDigits').focus();
        $('#repsDigits').val('');
        return false;
    }
    if(($('#repsDigits').val() > 150) && ($('#iSlider').val() == 0.75))
    {
        navigator.notification.alert('Please put upto 150 Reps for the selected counter interval');
        $('#repsDigits').focus();
        $('#repsDigits').val('');
        return false;
    }
    
    
    if((voiceLang != 'en-US') && ($('#iSlider').val() == 0.5 || $('#iSlider').val() == 0.75)){
    navigator.notification.confirm(
                                   'Please select ENGLISH for the selected counter interval for optimal performance',  // message
                                   function(buttonIndex){
                                   if(buttonIndex==1)
                                   {
                                   $("div[data-role='page']").hide();
                                   $('#pagefour').show();
                                   }
                                   else
                                   {
                                   $("#iSlider").prop('selectedIndex', 2);
                                   }
                                   },                  // callback to invoke
                                   'Confirm your language',    // title
                                   ['Settings','Cancel']          // buttonLabels
                                   );
        return false;
    }
    
    $('#typespan').empty();
    $('#typespan').text(exerciseType);
    $('#cntr').empty();
    $('#cntr').text(0);
    
    delay2ready(delaysecs);
    
}



/************************************** Start Delay Timer ********************************************/
                                  
                                  
function delay2ready(wp) {
    
    ttsPlugin.setRate(0.60);
    ttsPlugin.setLanguage(voiceLang);
    ttsPlugin.speak(" ");
    
    delaysecs = wp;
                                  
    $("div[data-role='page']").hide();
    $("#pagethree").show();
    $("#currentStage").empty();
    $("#countType").empty();
    $("#currentSet").empty();
    $("#countWord").empty();
    $("#totalCount").empty();
    $("#btndiv").empty();
                                  
    if(tabType == 'Counter')
    {
                                  
        $("#btndiv").html("<button id='pauseTimer' onClick='pauseStartDealy();' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>PAUSE</button><button id='resetTimer' href='#' onClick=_goBack('"+tabType+"') class='actionbtn' style='width:50%;'>RESET</button>");
                                  
    }else{
                                  
        if(FavItemType == 'Routines')
        {
                                  
            $("#btndiv").html("<button id='pauseTimer' onClick='pauseStartDealy();' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>PAUSE</button><button id='resetTimer' onClick=_doOpenRoutine("+rtnID+") class='actionbtn' style='width:50%;'>RESET</button>");
                                  
        }else{
                                  
            $("#btndiv").html("<button id='pauseTimer' onClick='pauseStartDealy();' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>PAUSE</button><button id='resetTimer' href='#' onClick=_doOpenFavorites("+favID+") class='actionbtn' style='width:50%;'>RESET</button>");
                                  
        }
                                  
    }
                                  
    
    var valarr = exerciseStr.split('-');
    if(exerciseType == 'Workout'){
              
        tagArr = ["Reps","Rest"];
        $('#CntrIntDiv').show();
        $('#cntrIntVal').empty();
        $('#cntrIntVal').text(timeInterval);
        $('#edetaildiv').empty();
        $('#edetaildiv').html('<tr><td align="left" class="tdstyle" style="border-top:none;"># REPS</td><td align="right" class="tdstyle" style="border-top:none;"><span style="color:#66665E;">'+valarr[0]+'</span></td></tr><tr><td align="left" class="tdstyle">REST</td><td class="tdstyle" align="right"><span style="color:#66665E;">'+valarr[1]+'</span></td></tr>');
        
    }else{
              
        tagArr = ["Inhale","Hold","Exhale","Hold"];
        $('#CntrIntDiv').hide();
        $('#cntrIntVal').empty();
        $('#edetaildiv').empty();
        $('#edetaildiv').html('<tr><td align="left" class="tdstyle" style="border-top:none;">INHALE</td><td align="right" class="tdstyle" style="border-top:none;"><span style="color:#66665E;">'+valarr[0]+'</span></td></tr><tr><td align="left" class="tdstyle">HOLD</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+valarr[1]+'</span></td></tr><tr><td align="left" class="tdstyle">EXHALE</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+valarr[2]+'</span></td></tr><tr><td align="left" class="tdstyle">HOLD</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+valarr[3]+'</span></td></tr>');
        
    }
              
              
    $('#countingType').text(countType);
    $('#totalCounting').text(countVals);
    
    if (countType == 'Time'){
        $('#totalCount').hide();
        $('#countWord').hide();
    }else{
        $('#totalCount').show();
        $('#countWord').show();
    }
    
    if((voiceLang != 'en-US') && (exerciseType != 'Breathing') && (timeInterval == 0.5 || timeInterval == 0.75)){
    navigator.notification.confirm(
                                'Please select ENGLISH for the selected counter interval for optimal performance',// message
                                function(buttonIndex){
                                if(buttonIndex==1)
                                {
                                $("div[data-role='page']").hide();
                                $("#pagefour").show();
                                }
                                else
                                {
                                updateFAV(favID);
                                }
                                },               // callback to invoke
                                'Confirm your language',  // title
                                ['Settings','Cancel']          // buttonLabels
                                );
                                return false;
                                }
    
    
    startdelay = delaysecs;
    var seconds = 0;
    var minutes = 0;
    k = 1;
    
    delaytimer = setInterval(function() {
                    
                        minutes = Math.floor(delaysecs / 60);
                        seconds = delaysecs % 60;
                        var currentMinutes = (minutes > 9) ? minutes : "0" + minutes;
                        var currentSeconds = (seconds > 9) ? seconds : "0" + seconds;
                        var delayvalue = currentMinutes+':'+currentSeconds;
                             
                        if(delaysecs>0){
                             ttsPlugin.speak(delaysecs.toString());
                        }
                        
                        $("#cntr").text(delayvalue);
                        delaysecs--;
                        
                        if (delaysecs == -1) {
                            
                             $('#countType').text(countType);
                             if (countType == 'Time'){
                             $('#currentSet').text(countVals);
                             }else{
                             $('#currentSet').text(1);
                             }
                             $('#totalCount').text(countVals);
                             $('#currentStage').text(tagArr[k-1]);
                            
                             $('#btndiv').empty();
                             $('#cntr').empty();
                             $('#cntr').text(0);
                             
                             if (countType == 'Time'){
                                $('#totalCount').hide();
                                $('#countWord').hide();
                             }else{
                                $('#totalCount').show();
                                $('#countWord').html('OF&nbsp;');
                             }
                        
                        clearInterval(delaytimer);
                        _goTimer('s',countVal);
                        startWatch(1,0);
                        
                        }
                        }, 1000);

}

                                  
/************************************** Start Delay Timer for ROUTINES ********************************************/
                                  
                                  
function getRoutineItems(tx)
{
    tx.executeSql('SELECT * FROM `ROUTINELIST` WHERE `rtnID` = '+rtnID, [], getRoutineItemsArray, errorInsert);
}


function getRoutineItemsArray(tx,resultri)
{

    var routineItemsStr = "";
    var routineTimesStr = "";
    for(var k=0;k<resultri.rows.length;k++)
    {
    routineItemsStr += resultri.rows.item(k).rlID+'|';
    routineTimesStr += resultri.rows.item(k).rtInterval+'|';
    }

    routineItemsArr = routineItemsStr.slice(0, -1).split('|');
    routineTimesArr = routineTimesStr.slice(0, -1).split('|');

    _doOpenRoutineItem(rtnID,0);

}


function _doOpenRoutineItem(index,index2)
{

    rtnID = index;
    routineItemIndex = index2;
    dbobj.transaction(openRoutineItem, errorInsert, successDB2);

}


function openRoutineItem(tx)
{

    tx.executeSql('SELECT * FROM `ROUTINELIST` WHERE `rtnID` ='+rtnID+' AND `rlID` ='+routineItemsArr[routineItemIndex], [], getRoutineItemData, errorInsert);
                                  
}
                                  
                                  
function getRoutineItemData(tx,resultsRN)
{
                                  
    ttsPlugin.initTTS();
                                  
    exerciseType = resultsRN.rows.item(0).reType;
    exerciseStr = resultsRN.rows.item(0).reRatio;
    countType = resultsRN.rows.item(0).rcType;
    countVal = resultsRN.rows.item(0).rcValue;
    timeInterval = resultsRN.rows.item(0).rcInterval;
    routineItemName = resultsRN.rows.item(0).rfName;
    delaysecs = resultsRN.rows.item(0).rtInterval;

    $("div[data-role='page']").hide();
    $("#pagethree").show();
    $("#currentStage").empty();
    $("#countType").empty();
    $("#currentSet").empty();
    $("#countWord").empty();
    $("#totalCount").empty();
    $("#typespan").empty();
    $("#typespan").text(exerciseType);
    $("#btndiv").empty();
                                  
    $("#btndiv").html("<button id='pauseTimer' onClick='pauseStartDealy();' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>PAUSE</button><button id='resetTimer' onClick=_doOpenRoutine("+rtnID+") class='actionbtn' style='width:50%;'>RESET</button>");

    var valarr = exerciseStr.split('-');

    if(exerciseType == 'Workout')
    {

        tagArr = ["Reps","Rest"];
        $('#CntrIntDiv').show();
        $('#cntrIntVal').empty();
        $('#cntrIntVal').text(timeInterval);
        $('#edetaildiv').empty();
        $('#edetaildiv').html('<tr><td align="left" class="tdstyle" style="border-top:none;"># REPS</td><td align="right" class="tdstyle" style="border-top:none;"><span style="color:#66665E;">'+valarr[0]+'</span></td></tr><tr><td align="left" class="tdstyle">REST</td><td class="tdstyle" align="right"><span style="color:#66665E;">'+valarr[1]+'</span></td></tr>');

    }else{

        tagArr = ["Inhale","Hold","Exhale","Hold"];
        $('#CntrIntDiv').hide();
        $('#cntrIntVal').empty();
        $('#edetaildiv').empty();
        $('#edetaildiv').html('<tr><td align="left" class="tdstyle" style="border-top:none;">INHALE</td><td align="right" class="tdstyle" style="border-top:none;"><span style="color:#66665E;">'+valarr[0]+'</span></td></tr><tr><td align="left" class="tdstyle">HOLD</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+valarr[1]+'</span></td></tr><tr><td align="left" class="tdstyle">EXHALE</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+valarr[2]+'</span></td></tr><tr><td align="left" class="tdstyle">HOLD</td><td align="right" class="tdstyle"><span style="color:#66665E;">'+valarr[3]+'</span></td></tr>');

    }
                                  
    $('#countingType').text(countType);

    if (countType == 'Time')
    {
        $('#totalCount').hide();
        $('#countWord').hide();
                                  
        var minValue = Math.floor(countVal / 60);
        var secValue = countVal % 60;
        var currentMinutes = (minValue > 9) ? minValue : "0" + minValue;
        var currentSeconds = (secValue > 9) ? secValue : "0" + secValue;
        countVals = currentMinutes+':'+currentSeconds;
                                  
    }else{
                                  
        $('#totalCount').show();
        $('#countWord').show();
                                  
        countVals = countVal;
    }
                                  
    $('#totalCounting').text(countVals);

    if((voiceLang != 'en-US') && (exerciseType != 'Breathing') && (timeInterval == 0.5 || timeInterval == 0.75)){
    navigator.notification.confirm(
                                 'Please select ENGLISH for the selected counter interval for optimal performance',// message
                                 function(buttonIndex){
                                 if(buttonIndex==1)
                                 {
                                 $("div[data-role='page']").hide();
                                 $("#pagefour").show();
                                 }
                                 else
                                 {
                                 updateFAV(favID);
                                 }
                                 },               // callback to invoke
                                 'Confirm your language',  // title
                                 ['Settings','Cancel']          // buttonLabels
                                 );
    return false;
    }


    if(voiceLang == 'en-US'){var vocaltext = "Your first exercise is"; var vocaltext2 = "Your next exercise is"; var vocaltext3 = "Your last exercise is";}
    else if(voiceLang == 'es-ES'){var vocaltext = "Su primer ejercicio es"; var vocaltext2 = "Su próximo ejercicio es"; var vocaltext3 = "Su último ejercicio es";}
    else if(voiceLang == 'zh-CN'){var vocaltext = "你的第一个练习是"; var vocaltext2 = "你的下一个锻炼"; var vocaltext3 = "你最后一次锻炼";}
    else if(voiceLang == 'hi-IN'){var vocaltext = "आपका पहला व्यायाम है"; var vocaltext2 = "आपका अगले व्यायाम है"; var vocaltext3 = "आपका आखरी व्यायाम है";}
    else if(voiceLang == 'ar-AE'){var vocaltext = "التمرين الأول الخاص بك هو"; var vocaltext2 = "التمرين التالي الخاص بك هو"; var vocaltext3 = "التمرين الأخير الخاص بك هو";}
    else if(voiceLang == 'pt-PT'){var vocaltext = "Seu primeiro exercício é"; var vocaltext2 = "Seu próximo exercício é"; var vocaltext3 = "Seu último exercício é";}
    else if(voiceLang == 'ja-JP'){var vocaltext = "あなたの最初の練習です"; var vocaltext2 = "あなたの次の課題は、"; var vocaltext3 = "あなたの最後の演習では、";}
    //else if(voiceLang == 'bn-BD'){var vocaltext = "সময় শেষ";}
    else if(voiceLang == 'ru-RU'){var vocaltext = "Ваше первое упражнение"; var vocaltext2 = "Следующее упражнение"; var vocaltext3 = "Ваше последнее упражнение";}
    else if(voiceLang == 'fr-FR'){var vocaltext = "Votre premier exercice est"; var vocaltext2 = "le temps est ecoule"; var vocaltext3 = "Votre exercice est";}
    

    ttsPlugin.setRate(0.50);
    ttsPlugin.setLanguage(voiceLang);
                        

    if(routineItemIndex == 0)
    {
                                  
        ttsPlugin.speak(vocaltext+' '+routineItemName);
                                  
    }else if(routineItemIndex == routineTimesArr.length - 1){
        
        $('#cntr').text(0);
        ttsPlugin.speak(vocaltext3+' '+routineItemName);
                                  
    }else{
        
        $('#cntr').text(0);
        ttsPlugin.speak(vocaltext2+' '+routineItemName);
                                  
    }

    ttsPlugin.speak(" ");

    if(routineItemIndex == 0)
    {
        delaysecs = 10;
    }else{
        delaysecs = routineTimesArr[routineItemIndex-1];
    }

    startdelay = delaysecs;
    var seconds = 0;
    var minutes = 0;

    setTimeout(function(){
             
             delaytimer = setInterval(function() {
                                      
                      minutes = Math.floor(delaysecs / 60);
                      seconds = delaysecs % 60;
                      var currentMinutes = (minutes > 9) ? minutes : "0" + minutes;
                      var currentSeconds = (seconds > 9) ? seconds : "0" + seconds;
                      var delayvalue = currentMinutes+':'+currentSeconds;
                      
                      if(delaysecs>0){
                          ttsPlugin.setRate(0.60);
                          ttsPlugin.speak(delaysecs.toString());
                      }
                      
                      $("#cntr").text(delayvalue);
                      delaysecs--;
                      
                      if (delaysecs == -1)
                      {
                      
                          $('#countType').text(countType);
                      
                          if (countType == 'Time'){
                              $('#currentSet').text(countVals);
                          }else{
                              $('#currentSet').text(1);
                          }
                      
                          $('#totalCount').text(countVals);
                          $('#currentStage').text(tagArr[k-1]);
                          
                          $('#btndiv').empty();
                          $('#cntr').empty();
                          $('#cntr').text(0);
                          
                          if (countType == 'Time'){
                              $('#totalCount').hide();
                              $('#countWord').hide();
                          }else{
                              $('#totalCount').show();
                              $('#countWord').html('OF&nbsp;');
                          }
                          
                          clearInterval(delaytimer);
                          _goTimer('s',countVal);
                          startWatch(1,0);
                          clearTimeout(clocktimer);
                          startClock();
                      }
                      
            }, 1000);
             
    }, 2000);

}

/************************************** Countdown time *********************************************/

 
 function _goTimer(bType,cVal){
    
    if(countType == 'Time'){
        
        if(bType == 's'){
            
            secs = countVal;
            
        }else{
            
            if(secs > 0){
                secs = cVal;
            }else{
                secs = 0;
                clearTimeout(cntdwntmr);
            }
            
        }
        
    var seconds = 0;
    var minutes = 0;
        
    cntdwntmr = setInterval(function() {
                
                minutes = Math.floor(secs / 60);
                seconds = secs % 60;
                
                var currentMinutes = (minutes > 9) ? minutes : "0" + minutes;
                var currentSeconds = (seconds > 9) ? seconds : "0" + seconds;
                tmr = currentMinutes+':'+currentSeconds;
                $("#currentSet").empty();
                $("#currentSet").text(tmr);
                secs--;
                            
                if(secs == -1)
                {
                            
                    $("#btndiv").empty();
                    clearTimeout(tmcounter);
                    clearTimeout(cntdwntmr);
                    
                    if(FavItemType == 'Routines'){
                            
                        if(routineItemIndex == routineItemsArr.length - 1)
                        {
                            dbobj.transaction(saveRoutineTime, errorInsert, successDB2);
                        }else{
                            routineItemIndex++;
                            _doOpenRoutineItem(rtnID,routineItemIndex);
                        }
                            
                    }else{

                        if(voiceLang == 'en-US'){var vocaltext = "Time Up";}
                        else if(voiceLang == 'es-ES'){var vocaltext = "Tiempo hasta";}
                        else if(voiceLang == 'zh-CN'){var vocaltext = "時間到";}
                        else if(voiceLang == 'hi-IN'){var vocaltext = "समय समाप्त";}
                        else if(voiceLang == 'ar-AE'){var vocaltext = "انتهى الوقت";}
                        else if(voiceLang == 'pt-PT'){var vocaltext = "Tempo para cima";}
                        else if(voiceLang == 'ja-JP'){var vocaltext = "タイムアップ";}
                        else if(voiceLang == 'ru-RU'){var vocaltext = "время вышло";}
                        else if(voiceLang == 'fr-FR'){var vocaltext = "Temps écoulé";}

                        //navigator.notification.beep(2);
                        ttsPlugin.setRate(0.50);
                        ttsPlugin.speak(vocaltext);

                        _goBack(tabType);

                    }
                            
                }
                
                }, 1000);
        
    }else{
        
        if(bType == 's'){
            
            secs = countVal;
            
        }else{
            
            secs = cVal;
            
        }
        
    }
    
}


/************************************** Count 'SET' progression ******************************************/
                                  
    
function _doCR(){
    
    secs--;
    curset++;
    
        $("#currentSet").empty();
        $("#currentSet").text(curset);
    
        clearTimeout(tmcounter);
        
        if(secs == 0){
            
            $("#btndiv").empty();
            clearTimeout(tmcounter);
            clearTimeout(cntdwntmr);
                                  
            if(FavItemType == 'Routines'){
                                  
                if(routineItemIndex == routineItemsArr.length - 1)
                {
                    dbobj.transaction(saveRoutineTime, errorInsert, successDB2);
                }else{
                    routineItemIndex++;
                    _doOpenRoutineItem(rtnID,routineItemIndex);
                }
                                  
            }else{

                if(voiceLang == 'en-US'){var vocaltext = "Sets Over";}
                else if(voiceLang == 'es-ES'){var vocaltext = "ejercicio terminado";}
                else if(voiceLang == 'zh-CN'){var vocaltext = "演習結束";}
                else if(voiceLang == 'hi-IN'){var vocaltext = "व्यायाम समाप्त";}
                else if(voiceLang == 'ar-AE'){var vocaltext = "ممارسة الانتهاء";}
                else if(voiceLang == 'pt-PT'){var vocaltext = "exercício terminado";}
                else if(voiceLang == 'ja-JP'){var vocaltext = "運動終了";}
                else if(voiceLang == 'ru-RU'){var vocaltext = "упражнения закончил";}
                else if(voiceLang == 'fr-FR'){var vocaltext = "définit plus";}

                ttsPlugin.setRate(0.50);
                ttsPlugin.speak(vocaltext);

                _goBack(tabType);

            }
            
        }else{
            
            startWatch(1,0);
            
        }
        
}
    
                                  
/************************************** Count total routine execution time ******************************************/

                                  
function startClock()
{
                            
    //upseconds = 0;
    clocktimer = setInterval(function() {
                       
           //if(routineState == 0){
           
               
           
           /*}else{
           
               totalRoutineTime--;
           
               minutes = Math.floor(totalroutinetime / 60);
               seconds = totalroutinetime % 60;
               
               var currentMinutes = (minutes > 9) ? minutes : "0" + minutes;
               var currentSeconds = (seconds > 9) ? seconds : "0" + seconds;
               uptimer = currentMinutes+':'+currentSeconds;
               
               $("#clockdiv").empty();
               $("#clockdiv").text(upseconds);
               
            }*/
                             
            upseconds++;
             
           
    }, 1000);

}

                                                      
/************************************** Counter Page *******************************************/
                                  

var countInterval = 1;
var posArr;
// Start Counter
function startWatch(e1,e2) {
	
    k = e1;
    j = e2;
    
    countInterval = timeInterval;
    
    ttsPlugin.setLanguage(voiceLang);
    
    if(exerciseType == 'Workout')
    {
        posLen = 3;
        
        if(voiceLang == 'en-US'){langArr = ["Start","Rest"];}
        else if(voiceLang == 'es-ES'){langArr = ["Inicio","Descanso"];}
        else if(voiceLang == 'zh-CN'){langArr = ["开始","休息"];}
        else if(voiceLang == 'hi-IN'){langArr = ["प्रारंभ","आराम"];}
        else if(voiceLang == 'ar-AE'){langArr = ["بداية","راحة"];}
        else if(voiceLang == 'pt-PT'){langArr = ["começar","Descansar"];}
        else if(voiceLang == 'ja-JP'){langArr = ["開始","残り"];}
        else if(voiceLang == 'ru-RU'){langArr = ["Начало","Отдых"];}
        else if(voiceLang == 'fr-FR'){langArr = ["démarrer","du repos"];}
                                  
        if(k%2==0)
        {
            countInterval = 1;
        }else{
            countInterval = timeInterval;
        }
        
    }
    else
    {
        posLen = 5;
    
        if(voiceLang == 'en-US'){langArr = ["Inhale","Hold","Exhale","Hold"];}
        else if(voiceLang == 'es-ES'){langArr = ["inhalar","mantener","exhalar","mantener"];}
        else if(voiceLang == 'zh-CN'){langArr = ["吸入","保持","呼","保持"];}
        else if(voiceLang == 'hi-IN'){langArr = ["साँस लेना","सांस रोकें","साँस छोड़ते","सांस रोकें"];}
        else if(voiceLang == 'ar-AE'){langArr = ["استنشق","عقد","زفر","عقد"];}
        else if(voiceLang == 'pt-PT'){langArr = ["inalar","aguarde","exalar","aguarde"];}
        else if(voiceLang == 'ja-JP'){langArr = ["吸い込みます","ホールド","息を吐き出します","ホールド"];}
        else if(voiceLang == 'ru-RU'){langArr = ["вдыхать","держать","выдыхать","держать"];}
        else if(voiceLang == 'fr-FR'){langArr = ["inhaler","tenir","exhaler","tenir"];}
                                  
        countInterval = 1;
        timeInterval = 1;
    
    }
    
    
    if(k == 1 && i == 1){
        
        $('#currentStage').text(tagArr[k-1]);
        ttsPlugin.setRate(0.60);
        ttsPlugin.speak(langArr[0]);
        
    }
    
    posArr = exerciseStr.split('-');
    tmcounter = setTimeout(countON,1000);
    
    $("#btndiv").empty();
                                  
    if(tabType == 'Counter')
    {

        $("#btndiv").html("<button id='pauseTimer' onClick='pauseWatch();' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>PAUSE</button><button id='resetTimer' onClick=_goBack('"+tabType+"') class='actionbtn' style='width:50%;'>RESET</button>");

    }else{


        if(FavItemType == 'Routines'){

            $("#btndiv").html("<button id='pauseTimer' onClick='pauseWatch();' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>PAUSE</button><button id='resetTimer' onClick=_doOpenRoutine("+rtnID+") class='actionbtn' style='width:50%;'>RESET</button>");

        }else{

            $("#btndiv").html("<button id='pauseTimer' onClick='pauseWatch();' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>PAUSE</button><button id='resetTimer' onClick=_doOpenFavorites("+favID+") class='actionbtn' style='width:50%;'>RESET</button>");

        }


    }
                                  
}


function countON() {
    
    if(i<100)
    {
        if(timeInterval<1)
        {
            ttsPlugin.setRate(0.75);
        }
        else{
            ttsPlugin.setRate(0.60);
        }
    }
    else
    {
        ttsPlugin.setRate(0.75);
    }
    
    
    var t = 0;
    if((exerciseType == 'Workout') && k%2==0)
    {
        t = (posArr[j]-i)+1;
    }
    else
    {
        t = i;
    }
                                  
    if(i <= posArr[j])
    {
        ttsPlugin.speak(t.toString());$('#cntr').text(t);i++;
    }
    else
    {
        
        $('#cntr').empty();
        $('#cntr').text(0);
        i=1;j++;k++;
        
        if(posArr[j] == 0)
        {
            
            $('#currentStage').text(tagArr[k]);
            ttsPlugin.speak(langArr[k]);
            
            j++;k++;
            
        }else{
            
            $('#currentStage').text(tagArr[k-1]);
            ttsPlugin.speak(langArr[k-1]);
            if(k%2==0)
            {
                countInterval = 1;
            }
            else
            {
                countInterval = timeInterval;
            }
            
        }
        
        
        if(countType == 'Sets')
        {
            
            if(posLen==k){_doCR();return;}
            
        }else{
            
            if(posLen==k){clearTimeout(tmcounter);startWatch(1,0);return;}
            
        }
        
    }
                                  
    tmcounter = setTimeout(countON, countInterval*1000);
    
}


// Pause Counter
function pauseWatch()
{
    
    clearTimeout(tmcounter);
    clearTimeout(cntdwntmr);
    clearTimeout(clocktimer);
    $("#btndiv").empty();
                                  
    if(tabType == 'Counter')
    {
        
        $("#btndiv").html("<button id='resumeTimer' onClick='_goTimer("+'"r"'+","+secs+");startWatch("+k+","+j+");' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>START</button><button id='resetTimer' onClick=_goBack('"+tabType+"') class='actionbtn' style='width:50%;'>RESET</button>");
                                  
    }else{
                                  
        
        if(FavItemType == 'Routines'){
            
            $("#btndiv").html("<button id='resumeTimer' onClick='startClock();_goTimer("+'"r"'+","+secs+");startWatch("+k+","+j+");' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>START</button><button id='resetTimer' onClick=_doOpenRoutine("+rtnID+") class='actionbtn' style='width:50%;'>RESET</button>");

        }else{

            $("#btndiv").html("<button id='resumeTimer' onClick='_goTimer("+'"r"'+","+secs+");startWatch("+k+","+j+");' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>START</button><button id='resetTimer' onClick=_doOpenFavorites("+favID+") class='actionbtn' style='width:50%;'>RESET</button>");

        }
                                  
                                  
    }
                                
	  
}


// Pause Counter
function pauseStartDealy(){
    
    clearTimeout(delaytimer);
    clearTimeout(clocktimer);
                                  
    $("#btndiv").empty();
                                  
    if(tabType == 'Counter')
    {

        $("#btndiv").html("<button id='resumeTimer' onClick='delay2ready("+delaysecs+");' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>START</button><button id='resetTimer' onClick=_goBack('"+tabType+"') class='actionbtn' style='width:50%;'>RESET</button>");

    }else{

        if(FavItemType == 'Routines'){
            
            $("#btndiv").html("<button id='resumeTimer' onClick='startClock();delay2ready("+delaysecs+");' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>START</button><button id='resetTimer' onClick=_goBack('"+tabType+"') class='actionbtn' style='width:50%;'>RESET</button>");

        }else{
        
            $("#btndiv").html("<button id='resumeTimer' onClick='delay2ready("+delaysecs+");' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>START</button><button id='resetTimer' onClick=_doOpenFavorites("+favID+") class='actionbtn' style='width:50%;'>RESET</button>");
                                      
        }
                                  
    }
    
}
                                  
                                  
function saveRoutineTime(tx)
{
    
    tx.executeSql("UPDATE `ROUTINEZ` SET `rTime`=?, `rStatus`=? WHERE `rID`=?", [upseconds, 1, rtnID], refreshRoutineItem, errorInsert);

}
                                  
                                  
function refreshRoutineItem(tx)
{
                                  
    upseconds = 0;
    clearTimeout(clocktimer);
    _goFavorites('Routines',0);
                                  
}
	 

/************************************** Set voice language *******************************************/

                                  
function _doSetLang(index){
    
    if(navigator.connection.type == 'none'){
        
        navigator.notification.alert('Please switch to online mode');
        
    }else{
    
        voiceLang = index;
        dbobj.transaction(updatefrDB, errorInsert, successDB2);
        
    }
    
}


//Update language info
function updatefrDB(tx) {
    
    tx.executeSql("UPDATE `EXERCIZE` SET `vLang`=?, `aStatus`=?", [voiceLang, 'P'], successUpdateLang, errorInsert);
    
}


//Update message
function successUpdateLang(tx) {
    
    
    
}

                                                      
/**************************************** Submit user feedback *******************************************/
                                        
                                        
//if choose other option in feedback form
function f2(index) {
                                        
if(index == 'Others'){
                                        
   $("#userNews2").val('');
   $("#otherNews").show();
                                        
   }else{
                                        
   $("#userNews2").val('');
   $("#otherNews").hide();
                                        
   }
                                        
}
                                        
function _doFeed()
{
                                        
   userName = $('#userName').val();
   if(userName.length == 0){
	   $("#msg3").html('This is a required field');
       $("#msg3").addClass('alert-danger').removeClass('alert-success');
	   $("#msg3").show();
       $("#userName").css('border', '1px solid #FF0000');
	   $("#userName").focus();
	   return false;
   }
                                        
   userName = userName.replace(/'/g, "''");
                                                                    
   userEmail = $('#userEmail').val();
   if(userEmail.length == 0){
	   $("#msg3").html('This is a required field');
       $("#msg3").addClass('alert-danger').removeClass('alert-success');
	   $("#msg3").show();
       $("#userEmail").css('border', '1px solid #FF0000');
	   $("#userEmail").focus();
	   return false;
   }else if(!chk_email.test(userEmail)){
	   $("#msg3").html('Please enter valid email');
       $("#msg3").addClass('alert-danger').removeClass('alert-success');
	   $("#msg3").show();
       $("#userEmail").css('border', '1px solid #FF0000');
	   $("#userEmail").focus();
	   return false;
   }
                                                                    
   userFeed = $('#userFeed').val();
   if(userFeed.length == 0){
	   $("#msg3").html('This is required field');
       $("#msg3").addClass('alert-danger').removeClass('alert-success');
	   $("#msg3").show();
       $("#userFeed").css('border', '1px solid #FF0000');
	   $("#userFeed").focus();
	   return false;
   }
                                                                    
   userNews = $('#userNews option:selected').val();
   if(userNews == 0){
	   $("#msg3").html('This is required field');
       $("#msg3").addClass('alert-danger').removeClass('alert-success');
	   $("#msg3").show();
       $("#userNews").css('border', '1px solid #FF0000');
	   $("#userNews").focus();
	   return false;
   }
                                                                    
   userNews2 = $('#userNews2').val();
   if(userNews == 'Others' && userNews2.length == 0){
	   $("#msg3").html('This is required field');
       $("#msg3").addClass('alert-danger').removeClass('alert-success');                        
	   $("#msg3").show();
       $("#userNews2").css('border', '1px solid #FF0000');
	   $("#userNews2").focus();
	   return false;
   }
                                                                    
   var feedbtn = $('#feedbtn').val();
   $("#feedbtn").val('Sending...');
                                                                    
   $.ajax({
          url: 'http://countmyrepsapp.com/evcconnect.php',
          type: 'POST',
          data: {userName:userName,userEmail:userEmail,userFeed:userFeed,userNews:userNews,userNews2:userNews2,deviceFrm:'Apple Pro',feedbtn:feedbtn},
          success: function(data, status)
          {
          
          //$(':input:not(:button)').val('');
          $("#userName").val('');
          $("#userEmail").val('');
          $("#userFeed").val('');
          $(':input:not(:button)').css('border', '');
          $("#userNews").val('0');
          $("#otherNews").hide();
          $("#charNum").html('2500 characters left');
          $("#msg3").html('Feedback posted successfully.');
          $("#msg3").addClass('alert-success').removeClass('alert-danger');
          $("#msg3").show();
          $("#feedbtn").val('SEND');
          
          },
          
          error: function(xhr, ajaxOptions, thrownError)
          {
          
          $("#msg3").html('Please switch to online mode.');
          $("#msg3").addClass('alert-danger').removeClass('alert-success');
          $("#msg3").show();
          $("#feedbtn").val('SEND');
          
          }
          
          });
       
   }
                               
function _doReset(){
                               
    $("#userName").val('');
    $("#userEmail").val('');
    $("#userFeed").val('');
    $("#userNews").val('0');
    $("#otherNews").hide();
    $("#charNum").html('2500 characters left');
    $("#msg3").hide();
    $("#feedbtn").val('SUBMIT');
        
}
                               
/************************************** Share This App ************************************************/
                               
                               
function _doShare(){
                               
    if(navigator.connection.type == 'none'){
               
        navigator.notification.alert('Please switch to online mode');
                               
    }else{
                               
        window.plugins.socialsharing.share("Check out the CountMyReps Pro App - anytime, anywhere. You work out and we'll count! - (https://itunes.apple.com/us/app/countmyreps-pro-voice-counter-gym-yoga/id1114276581?mt=8)", "Message from CountMyReps Pro App");
                               
    }
                               
                               
}
                               
                               
/************************************** Routine ************************************************/
                               
                               
