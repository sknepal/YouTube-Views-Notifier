/**   YouTube Views Count Alert by TheLacunaBlog  **/
/**   =========================================  **/

/**   Published by Subigya Nepal on 7/22/2013    **/
/**   Details at www.thelacunablog.com/?p=8270   **/

 var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('YT');
 var ss2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Record');

 function onOpen() {
  // Add "YouTube Views Notification" as a menu item.
  var menuEntries = [ {name: "Options", functionName: "options"}, {name: "Run", functionName: "ytViewAlert"}, {name: "About", functionName: "About"}];
  SpreadsheetApp.getActiveSpreadsheet().addMenu("YouTube Views Notification", menuEntries);
 }

 function options() {
  // Display inputbox when clicked on the menu item and save the input on cells 'A1' and 'A2' of second spreadsheet - 'Record'.
  var LimitofViews = Browser.inputBox("After how many views would you like to receive the notification?. Please enter digits only.");
  var emailaddress = Browser.inputBox("Please enter your email address where you would like to receive the email notification."); 
  ss2.getRange('A1').setValue(LimitofViews) 
  ss2.getRange('A2').setValue(emailaddress) 
 }

 function ytViewAlert() {
  for (var i=0; ss.getRange('A' + String(i+1)).getValue() !=""; i++) {
   var video_id = ss.getRange('A' + String(i+1)).getValue(); 
   // YouTube API to fetch video's view count and title.
   var ytv =  UrlFetchApp.fetch("https://gdata.youtube.com/feeds/api/videos/"+ video_id +"?v=2&alt=json");
   var json = Utilities.jsonParse(ytv.getContentText());
   var count = json["entry"]["yt$statistics"]["viewCount"] + "";
   var title = json["entry"]["title"]["$t"] + "";
   // Save the count and title on spreadsheet.
   ss.getRange('B' + String(i+1)).setValue(count);
   ss.getRange('C' + String(i+1)).setValue(title);
  }
  doProcess();
 }
 
 function doProcess() {
  var rows = ss.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var rowsDeleted = 0;
  for (var i = 0; i <= numRows - 1; i++) {
   var row = values[i];
   // If video's view count is greater than the threshold user had entered earlier...
   if (row[1] > ss2.getRange('A1').getValue() ) {
     var message = ("Your Video: " + row[2] + " (" + "http://www.youtube.com/watch?v=" + row[0] + ")" + " has received " + row[1] + " views.");
     // ...send mail.
     MailApp.sendEmail(ss2.getRange('A2').getValue(), "YouTube Views Notification", message);
     // For every sent mail, delete the associated video ID from spreadsheet so that no more mail gets sent for the same video.
     ss.deleteRow((parseInt(i)+1) - rowsDeleted);
     rowsDeleted++;  
   }
  }
 }
    
 function About() {
  Browser.msgBox("This script was coded by Subigya Nepal. You can read about the script here : http://www.thelacunablog.com/?p=8270. Follow me on Twitter : @SkNepal");
 }

// Written by Subigya Nepal admin@thelacunablog.com
// Twitter: @SkNepal