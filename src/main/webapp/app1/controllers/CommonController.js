
//var Intelesant = angular.module("Intelesant", []);
Intelesant.controller('CommonController', function($rootScope, $location, $scope, $cookieStore, commonService) {
    if ($cookieStore.get('userNameLogged') == undefined || $cookieStore.get('userPassword') == undefined) {
        location.href = "index.html";
    }

    $cookieStore.put('helpPage', 'twofactorpage');
    commonService.alertcount().success(function(response) {

        if (response != 0) {
            $('#alert_count').html(response);
            $('#alert-buble').show();
        }
        else {
            $('#alert-buble').hide();
        }
    })

            .error(function(data) {

            });
    $('#loggedinName').html($cookieStore.get('userPrefferedName'));
    $scope.visittabShow = false;
    commonService.userHeadRoles().success(function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i] == 'resident-createreisident')
                $scope.addResidentIconShow = true;
            if (data[i] == 'help-view') {
                $scope.HelpIconShow = true;
                $scope.okbutton = true;
            }
            if (data[i] == 'help-edit') {
                $scope.helpeditbutton = true;
                $scope.helpeditbuttontwo = true;
                $scope.okbutton = false;
            }
            if (data[i] == 'changepassword')
                $scope.preferenceIconShow = true;
            if (data[i] == 'alert-view')
                $scope.alertIconShow = true;
            if (data[i] == 'Administration-userList')
                $scope.administrationIconShow = true;
            if (data[i] == 'jmessaging-viewmessage')
                $scope.messagingIconShow = true;
            if (data[i] == 'jmessaging-recordVisitsData')
                $scope.recordvisittabShow = true;
            if (data[i] == 'jmessaging-jmessagingService')
                $scope.visittabShow = true;
        }
    });
    $scope.logout = function() {
        $cookieStore.remove('userNameLogged');
        $cookieStore.remove('organisationId');
        $cookieStore.remove('roles');
        $cookieStore.remove('tokenId');
        $cookieStore.remove('userId');
        $cookieStore.remove('userPassword');
        $cookieStore.remove('lastLoginTime');
        $cookieStore.remove('userPrefferedName');
        $cookieStore.remove('residentid');
        $cookieStore.remove('headFeatures');
        $cookieStore.remove('helpPage');
        $cookieStore.remove('leftMenuRoles');
        window.location = "index.html"

    }

$scope.deleteRes="No";
$scope.showDeleteOption1=false;
$scope.deleteMe=function(){
    $scope.residentIdToDelete = $cookieStore.get("userId");
    $scope.reasonToDelete1="";
        $scope.deleteRes="No";
        $scope.showReasonBox1=false;
    $('#confirm1').modal({
        keyboard: false
    });
};
$scope.showReasonBox1=false;
    $scope.deleteResident1 = function() {
        console.log("........." + $scope.residentIdToDelete);
        if ($scope.showReasonBox1 === true) {
            if ($scope.reasonToDelete1 === undefined || $scope.reasonToDelete1 === "") {
                return false;
            }
            commonService.deleteResident($scope.residentIdToDelete, $scope.reasonToDelete1).success(function() {
                console.log("resident deleted successfully");
                $scope.logout();
                location.href="index.html";
            });
        }
        else {
            location.reload();
        }
    };

    $("#btnClear").click(function(e) {
        e.preventDefault();
        editor.focus();
        editor.clear();
    });
    $("#btnGetHtml").click(function() {
        alert($("#editor").val());
    });
    $scope.help = function() {
        console.log("help function,,......");
        $('#helpEditor1').show();
        $('#helpEditor2').hide();
        commonService.help().success(function(data) {
            $scope.helpContent = data.content;
            $('#helpContent').html(data.content);
        });
        $scope.removeArea1(editor);
        $('#help').modal({
            keyboard: false
        });
    };
    var editor;
    $scope.showEditor = function() {
        console.log("Show Editor method......");
        $('#helpEditor1').hide();
        $('#helpEditor2').show();
        var options = {
            width: 400,
            height: 200,
            controls: "bold italic underline strikethrough subscript superscript | font size " + "style | color highlight removeformat | bullets numbering | outdent " +
                    "indent | alignleft center alignright justify | undo redo | " +
                    "rule link image unlink | cut copy paste pastetext | print source"
        };
        editor = $("#editor").cleditor(options)[0];
        editor.clear();
        commonService.help().success(function(data) {
            $scope.helpContent = data.content;
            $('#editor').cleditor()[0].execCommand('inserthtml', data.content);
            editor.focus();
        });

        return false;
    };
    $scope.saveHelpContent = function() {
        $scope.helpcontentvalue = $("#editor").val();
        // $scope.helpcontentvalue = $("textarea").selectedHTML();
        //   $('#helpContentEditor').html($('.nicEdit-main').html());
        $('#saveButton').attr('data-dismiss', "modal");
        console.log("$scope.helpcontentvalue......." + $scope.helpcontentvalue);
        commonService.updateHelp($scope.helpcontentvalue).success(function() {
        }).error(function() {
        });
    };

    var area1;
    $scope.toggleArea = function() {
        console.log("toggleArea");
        if (!area1) {
            console.log("toggleArea if");
            area1 = new nicEditor({
                fullPanel: true
            }).panelInstance('helpContentEditor', {
                hasPanel: true
            });
        }

    };
    $scope.removeArea1 = function() {

        if (editor) {
            console.log("removeArea1");
            // editor.preventDefault();
            editor.focus();
            editor.clear();
        }
    };
});
idleMax = 40000; // Logout after 2 minutes of IDLE
idleTime = 0;
$(document).ready(function() {
 var idleInterval = setInterval("timerIncrement()", 10000);
 $(this).mousemove(function(e) {
 idleTime = 0;
 });
 $(this).keypress(function(e) {
 idleTime = 0;
 });
 });
function timerIncrement() {
    console.log("fired");
    console.log(idleTime);
    idleTime = idleTime + 10000;
    var newUrl= document.URL.substring(document.URL.indexOf("/intelesant-ang"));
    if(newUrl=="/intelesant-ang/#/" || newUrl=="/intelesant-ang/index.html#/"){
//     var userField = document.getElementById("userField");
//     var passwordField=document.getElementById("passwordField");
//    // var rememberMe=document.getElementById("remember");
// if( userField.value == userField.defaultValue && passwordField.value==passwordField.defaultValue){
// 	
// 	   idleTime = idleMax;
//    }
//
//    else if (idleTime > idleMax) {
//
//         console.log("reached");
//         console.log(idleTime);
//         deleteSearchCookies();
//         location.href = "blank.html";
//       
//
//       }
    }
    else if (idleTime > idleMax) {
         console.log("reached");
         console.log(idleTime);
         deleteSearchCookies();
         location.href = "blank.html";
       }
   }
function Cookie(name, value, minutes) {
   var expires = "";
   if (minutes) {
      var date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
   }

   document.cookie = name + "=" + value + expires;
}

function deleteSearchCookies() {
    Cookie('userNameLogged',null,-1);
    Cookie('userPassword',null,-1);
    Cookie("organisationId",null,-1);
    Cookie("tokenId",null,-1);
    Cookie('userId',null,-1);
    Cookie('lastLoginTime',null,-1);
    Cookie("residentid",null,-1);
    Cookie("userPrefferedName",null,-1);
    Cookie('headFeatures',null,-1);
    Cookie('helpPage',null,-1);
    Cookie("leftMenuRoles",null,-1);
}


//Intelesant.config(function($routeProvider) {
//	$routeProvider.when('/Help', {
//		
//		controller: 'CommonController'
//	})
//});