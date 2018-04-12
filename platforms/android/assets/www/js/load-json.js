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
var exerciseType;
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
var x = 0, y = 0;
var timeInterval = 1;
var countVals;



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
    
}


function SuccessUpdateFAV(tx,result){
    navigator.notification.alert('Item saved to Favorites',  // message
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
    //navigator.notification.alert("Hello");
}

function successResults(tx,results){
        //navigator.notification.alert("Hello");
    
    var nLength = results.rows.length;
    
    if(nLength==0)
    {
        dbobj.transaction(insertRecord, errorInsert, successDB2);
    }
    else
    {
        
        voiceLang = results.rows.item(0).vLang;
        appStatus = results.rows.item(0).aStatus;
        
        if(appStatus == 'F')
        {
            
            
        }else{
            
            $('#fheaderC').hide();
            //$('#fheaderP').hide();
            $('#fheaderS').hide();
            $('#pheaderC').show();
            //$('#pheaderP').show();
            $('#pheaderS').show();
            $('#DLdiv').hide();
            $('#PLdiv').show();
            //$('.upgradebtn').hide();
            $('#addtofavC').show();
            //$('#addtofavP').show();
            $('#sliderC').show();
            //$('#sliderP').show();
            $('#prodiv').hide();
            $('#timedelayC').show();
            //$('#timedelayP').show();
            $('#atfdiv').show();
            //$('#atfdivp').show();
            $('.upgradebtn').hide();
            $('#sliderF').show();
            $('#sliderFF').show();
            $('#sliderCC').show();
            $('#fdiv').hide();
            //$('#pdiv').show();
            //$('#sliderPP').show();
            $('#timeintervalC').show();
            //$('#timeintervalP').show();
            
        }
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
                  
function successResultsFAV(tx,results){
    x = 0; y = 0;
    
    $('#exercisefradio').val('Workout');
    
    var favItemsWrk = "";
    var favItemsBth = "";
   var nLength = results.rows.length;
    
    $('#savedItemsW').empty();
    $('#savedItemsB').empty();
    
   if(nLength==0)
   {
       $("#noItem").show();
   }
   else
   {

           for(c=0;c<=nLength;c++)
           {
               
               if(results.rows.item(c).cType == 'Time'){
                   var cUnit = '&nbsp;MIN';
               }else{
                   var cUnit = '';
               }
               
               var erat = (results.rows.item(c).eRatio).split('-');
               
               if(results.rows.item(c).cType == 'Time'){
               
                   var minp = Math.floor((results.rows.item(c).cValue) / 60);
                   var secp = (results.rows.item(c).cValue) % 60;
                   var currentMinutes = (minp > 9) ? minp : "0" + minp;
                   var currentSeconds = (secp > 9) ? secp : "0" + secp;
                   var countValue = currentMinutes+':'+currentSeconds;
                   
               }else{
                   
                   var countValue = results.rows.item(c).cValue;
                   
               }
               
               var sdValue = results.rows.item(c).tDelay;
               var delayS = 0;
               var delayM = 0;
               
               if(sdValue > 9){var delayS = sdValue;}else{var delayS = '0'+sdValue;}
               if(sdValue % 60 == 0){delayM++;delayS='00';}
               var delayValue = '0'+delayM+':'+delayS;
               
               if(results.rows.item(c).eType=='Workout')
               {
                   x++;
                   $('#savedItemsW').html($('#savedItemsW').html()+'<a href="#" onClick="_doOpenFavorites('+results.rows.item(c).nID+');" class="ttllst"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td colspan="2" align="left"><p><img src="img/circle-play.png" class="playbtn">'+results.rows.item(c).fName+'</p></td></tr><tr><td align="left">Reps: <span>'+erat[0]+'</spans></td><td align="left">Start Delay: <span>'+delayValue+'</span></td></tr><tr><td align="left">Rest: <span>'+erat[1]+'</span></td><td align="left">Interval: <span>'+results.rows.item(c).tInterval+'</span></td></tr><tr><td colspan="2" align="left">'+results.rows.item(c).cType+': <span>'+countValue+'</span></td></tr></table><a class="editpic" onclick="updateFAV('+results.rows.item(c).nID+')"><img src="img/square-edit.png" class="removebtn"></a></a><a class="delpic" onclick="deletefmFAV('+results.rows.item(c).nID+')"><img src="img/circle-cross.png" class="removebtn"></a></a>');
                   
               }
               else
               {
                   
                   y++;
                   $('#savedItemsB').html($('#savedItemsB').html()+'<a href="#" onClick="_doOpenFavorites('+results.rows.item(c).nID+');" class="ttllst"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td colspan="2" align="left"><p><img src="img/circle-play.png" class="playbtn">'+results.rows.item(c).fName+'</p></td></tr><tr><td align="left">Inhale: <span>'+erat[0]+'</span></td><td align="left">'+results.rows.item(c).cType+': <span>'+countValue+'</span></td></tr><tr><td align="left">Hold: <span>'+erat[1]+'</span></td><td align="left">Start Delay: <span>'+delayValue+'</span></td></tr><tr><td colspan="2" align="left">Exhale: <span>'+erat[2]+'</span></td></tr><tr><td colspan="2" align="left">Hold: <span>'+erat[3]+'</span></td></tr></table><a class="editpic" onclick="updateFAV('+results.rows.item(c).nID+')"><img src="img/square-edit.png" class="removebtn"></a><a class="delpic" onclick="deletefmFAV('+results.rows.item(c).nID+')"><img src="img/circle-cross.png" class="removebtn"></a></a>');
                   
               }
               
               if(x == 0){$("#noItem").show();}else{$("#noItem").hide();}
               $('#savedItemsW').show();
               
           }
       
    }
    
}


function updateFAV(id){
    
    favID = id;
    dbobj = window.openDatabase("cmr", "4", "CMR DB",'');
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
    //$('#openfname').text(results.rows.item(0).fName);
    //$('#openfInterval').text(results.rows.item(0).tInterval);
    //$('#openfdelay').text(results.rows.item(0).tDelay);
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
    
    dbobj = window.openDatabase("cmr", "4", "CMR DB",'');
    dbobj.transaction(_doDelFavorites, errorInsert, successDB2);
    
}


function _doDelFavorites(tx) {
    
    tx.executeSql('DELETE FROM `FAVRATIO` WHERE `nID`='+favID, [], _doInsertFavorites,errorInsert);
    
}

function _doInsertFavorites(tx){
    
    tx.executeSql("INSERT INTO `FAVRATIO`(`eType`, `eRatio`, `cType`, `cValue`, `tDelay`, `tInterval`, `fName`) VALUES('"+exerciseType+"', '"+exerciseStr+"','"+countType+"','"+countVal+"','"+delaysecs+"','"+timeInterval+"','"+favName+"')",[],SuccessUpdateFAV,errorInsert);
    
}


function deletefmFAV(index){
    
    favID = index;
    navigator.notification.confirm(
                                  'Do you want to delete this item from Favorites?',  // message
                                  function(buttonIndex){
                                  if(buttonIndex==1)
                                  {
                                  dbobj = window.openDatabase("cmr", "4", "CMR DB",'');
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
    
    _goFavorites();
    
}




// ----- OTHER FUNCTIONS ------------

function _goCounter(index){
    
	   $("div[data-role='page']").hide();
       $('#pageone').show();
    
    
}


function _goFavorites(){
    
    $("#noItem").hide();
    $('#savedItemsW').hide();
    $('#savedItemsB').hide();
    dbobj = window.openDatabase("cmr", "4", "CMR DB",'');
    dbobj.transaction(selectRecordsFAV, errorInsert, successDB2);
    $("div[data-role='page']").hide();
    $('#pagenine').show();
    $('.trangledownp').css('margin-left', '47%');
    $('#workoutf').attr('class', 'btn btn-primary active');
    $('#breathingf').attr('class', 'btn btn-primary');
    $('#exercisefradio').val('Workout');
    
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

function showOne(id) {
    
    $("div[data-role='page']").hide();
    $('#' + id).show();
    
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
                  
                  
                  
$('#exercisefradio').change(
                            function(){
                                                                 
    if(this.value == 'Breathing'){
                                                                 
        if(y > 0){
                    $("#savedItemsB").show();
                    $("#noItem").hide();
                                               
        }else{
                                               
                    $("#savedItemsB").hide();
                    $("#noItem").show();
                                               
        }
        
         $("#savedItemsW").hide();
        
                                                                 
    }else{
                                               
                        
        if(x > 0){
                     $("#savedItemsW").show();
                     $("#noItem").hide();
                                               
         }else{
                                               
                     $("#savedItemsW").hide();
                     $("#noItem").show();
                                               
         }
                                               
                                                                 
         $("#savedItemsB").hide();
                                                                 
    }
                                                                 
    });
                  
});


function _doOpenFavorites(fid){
    
    favID = fid;
    
    dbobj = window.openDatabase("cmr", "4", "CMR DB",'');
    dbobj.transaction(openItemFAV, errorInsert, successDB2);
    
}


function openItemFAV(tx)
{
    tx.executeSql('SELECT * FROM `FAVRATIO` WHERE `nID` ='+favID, [], successResultFAV,errorInsert);
}


function successResultFAV(tx,result){
    
    $("div[data-role='page']").hide();
    $('#pageten').show();
    $('#openItem').empty();
    $('#intertvalfdiv').text(result.rows.item(0).tInterval);
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
    
    $('#favbtndiv').html('<button style="width:50%; border-right:1px solid #FEFFFF;" onClick="_doStartFavorites('+"'"+dbstring+"'"+','+"'"+result.rows.item(0).eRatio+"'"+','+"'"+result.rows.item(0).cValue+"'"+');" class="actionbtn">START</button><button id="resetTimer" onClick="_goBack('+"'"+tabType+"'"+')"; class="actionbtn" style="width:50%;">BACK</button>');
    
}



function _doStartFavorites(index,index2,index3){

    countVal = '';
    exerciseStr = '';
    countType = '';
    delaysecs = '';
    timeInterval = 1;
    
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
    
    delay2ready(delaysecs);

}



function _goBack(tpe){
    
    curset = '';
    
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
       }else if(tpe == 'Presets'){
           $("#pagetwo").show();
       }else{
           $("#pagenine").show();
       }
    
}



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
                                  dbobj = window.openDatabase("cmr", "4", "CMR DB",'');
                                  dbobj.transaction(insertRecordFAV, errorInsert, successDB2);
                                  }
                                },                  // callback to invoke
                                  'Save as Favorites',            // title
                                  ['Save','Cancel'],             // buttonLabels
                                  ''                 // defaultText
                                  );
    
}



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



//Delay Timer
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
    $("#btndiv").html("<button id='pauseTimer' href='#' onClick='pauseStartDealy();' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>PAUSE</button><button id='resetTimer' href='#' onClick=_goBack('"+tabType+"') class='actionbtn' style='width:50%;'>RESET</button>");
                                  
    
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


//Countdown voice timer
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
                            
                    clearTimeout(tmcounter);
                    clearTimeout(cntdwntmr);
                            
                    _goBack(tabType);
                            
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

    
function _doCR(){
    
    secs--;
    curset++;
    
        $("#currentSet").empty();
        $("#currentSet").text(curset);
    
        clearTimeout(tmcounter);
        
        if(secs == 0){
            
            $("#btndiv").empty();
            
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
            
            
            clearTimeout(tmcounter);
            clearTimeout(cntdwntmr);
            
            _goBack(tabType);
            
        }else{
            
            startWatch(1,0);
            
        }
        
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
    $("#btndiv").html("<button id='pauseTimer' href='#' onClick='pauseWatch();' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>PAUSE</button><button id='resetTimer' href='#' onClick=_goBack('"+tabType+"') class='actionbtn' style='width:50%;'>RESET</button>");

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
function pauseWatch(){
    
	  clearTimeout(tmcounter);
      clearTimeout(cntdwntmr);
	  
	  $("#btndiv").empty();
	  $("#btndiv").html("<button id='resumeTimer' onClick='_goTimer("+'"r"'+","+secs+");startWatch("+k+","+j+");' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>START</button><button id='resetTimer' href='#' onClick=_goBack('"+tabType+"') class='actionbtn' style='width:50%;'>RESET</button>");
	  
}


// Pause Counter
function pauseStartDealy(){
    
    clearTimeout(delaytimer);
    
    $("#btndiv").empty();
    $("#btndiv").html("<button id='resumeTimer' onClick='delay2ready("+delaysecs+");' class='actionbtn' style='width:50%; border-right:1px solid #FEFFFF;'>START</button><button id='resetTimer' href='#' onClick=_goBack('"+tabType+"') class='actionbtn' style='width:50%;'>RESET</button>");
    
}
	 

/************************************** Set voice language *******************************************/


function _doSetLang(index){
    
    if(navigator.connection.type == 'none'){
        
        navigator.notification.alert('Please switch to online mode');
        
    }else{
    
    voiceLang = index;
    
    dbobj = window.openDatabase("cmr", "4", "CMR DB",'');
    dbobj.transaction(deletefrDB, errorInsert, successDB2);
        
    }
    
}



//Delete language info
function deletefrDB(tx) {
    
    tx.executeSql('DELETE FROM `EXERCIZE`', [], updatetoDB);
    
}


//Update language info into database
function updatetoDB(tx) {
    
    tx.executeSql("INSERT INTO `EXERCIZE` (`vLang`, `aStatus`) VALUES ('" +voiceLang+ "', 'P')");
    
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
                               
                               
