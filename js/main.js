// validate that company name & email & name all exist before enabling send buttons.
// push Name & Email & Company (%encoded) to Firebase/formid list
// hook up a zap to firebase and create templates for each formid/email neccesary

var team;
var fromName;
var fromEmail;
var mandrill = 'OZx-tEGFhB1YB_as-qWD_Q';
// Mandrill key needs to be swapped for paid Account before end of April - link to existing MC account.

var fb = "https://devpostteams.firebaseio.com/";
$(document).ready(function() {

  // localforage / persistent company name stuff
  localforage.getItem('team', function(err, value) {
    //console.log(value);
    $("#teamName").val(value);
    team = value;
  });
  $("#teamName").keyup(function(event){
    if(event.keyCode == 13){
      location.reload();
    } else {
      localforage.setItem('team', $(this).val());
      team = $(this).val();
    }
  });
  $("#teamName").blur(function(){
    location.reload();
  });

  localforage.getItem('fromName', function(err, value) {
    $("#fromName").val(value);
    fromName = value;
  });
  $("#fromName").keyup(function(){
    localforage.setItem('fromName', $(this).val());
    fromName = $(this).val();
  });

  localforage.getItem('fromEmail', function(err, value) {
    $("#fromEmail").val(value);
    fromEmail = value;
  });
  $("#fromEmail").keyup(function(){
    localforage.setItem('fromEmail', $(this).val());
    fromEmail = $(this).val();
  });

  // Firebase
  var hr = new Firebase(fb +'hr/');
  var tech = new Firebase(fb +'tech/');
  var dev = new Firebase(fb +'dev/');
  var ndev = new Firebase(fb +'ndev/');
  var listTemplate = $('#sentListTemplate').html();
  Mustache.parse(listTemplate);

  // POPULATE HR LIST
  hr.on("value", function(snapshot) {
    var hrData = {data:[]};
    snapshot.forEach(function(child){
      var key = child.key();
      var childData = child.val();
      var name = childData.name;
      var email = childData.email;
      var company = childData.company;
      var date = childData.date;
      var complete = childData.complete;
      var category = 'hr';

      if (company == team){
        hrData.data.push({'key': key, 'name': name, 'email': email, 'company': company, 'category': category, 'date': date, 'complete': complete});
      }
    });
    //console.log(hrData);

    var hrListHTML = Mustache.render(listTemplate, hrData);
    //console.log(hrListHTML);
    $('#hrList').html(hrListHTML);
  }, function (errorObject) {
    console.log("Error reading from HR db: " + errorObject.code);
  });

  // POPULATE TECH LIST
  tech.on("value", function(snapshot) {
    var techData = {data:[]};
    snapshot.forEach(function(child){
      var key = child.key();
      var childData = child.val();
      var name = childData.name;
      var email = childData.email;
      var company = childData.company;
      var date = childData.date;
      var complete = childData.complete;
      var category = 'tech';
      if (company == team){
        techData.data.push({'key': key, 'name': name, 'email': email, 'company': company, 'category': category, 'date': date, 'complete': complete});
      }
    });
    //console.log(techData);

    var techListHTML = Mustache.render(listTemplate, techData);
    //console.log(techListHTML);
    $('#techList').html(techListHTML);
  }, function (errorObject) {
    console.log("Error reading from TECH db: " + errorObject.code);
  });

  // POPULATE DEV LIST
  dev.on("value", function(snapshot) {
    var devData = {data:[]};
    snapshot.forEach(function(child){
      var key = child.key();
      var childData = child.val();
      var name = childData.name;
      var email = childData.email;
      var company = childData.company;
      var complete = childData.complete;
      var date = childData.date;
      var category = 'dev';
      if (company == team){
        devData.data.push({'key': key, 'name': name, 'email': email, 'company': company, 'category': category, 'date': date, 'complete': complete});
      }
    });

    var devListHTML = Mustache.render(listTemplate, devData);
    $('#devList').html(devListHTML);
  }, function (errorObject) {
    console.log("Error reading from DEV db: " + errorObject.code);
  });

  // POPULATE NDEV LIST
  ndev.on("value", function(snapshot) {
    var ndevData = {data:[]};
    snapshot.forEach(function(child){
      var key = child.key();
      var childData = child.val();
      var name = childData.name;
      var email = childData.email;
      var company = childData.company;
      var complete = childData.complete;
      var date = childData.date;
      var category = 'ndev';
      if (company == team){
        ndevData.data.push({'key': key, 'name': name, 'email': email, 'company': company, 'category': category, 'date': date, 'complete': complete});
      }
    });

    var ndevListHTML = Mustache.render(listTemplate, ndevData);
    $('#ndevList').html(ndevListHTML);
  }, function (errorObject) {
    console.log("Error reading from NDEV db: " + errorObject.code);
  });

  // SEND HANDLERS

  $("#hrForm").submit(function(event){
    console.log('hrSend pressed');
    if (
      team.trim() !== "" &&
      fromName.trim() !== "" &&
      fromEmail.trim() !== "" &&
      $("#hrName").val().trim() !=="" &&
      $("#hrEmail").val().trim() !==""
    ){

      var ref = hr.push({
        'name': $("#hrName").val().trim(),
        'email': $("#hrEmail").val().trim(),
        'company': team.trim(),
        'escaped': escape(team.trim()),
        'date': getDate()
      });
      // send email
      sendMail(ref.key(), $("#hrName").val().trim(), $("#hrEmail").val().trim(), 'hr');
      // clear form
      $(this).trigger("reset");
      $("#hrName").focus();
    } else {
        alert("We need your company's name & recipient's contact info.");
        console.log("We need your company's name & recipient's contact info.");
    }
    event.preventDefault();
  });

  $("#techForm").submit(function(event){
    console.log('hrSend pressed');
    if (
      team.trim() !== "" &&
      fromName.trim() !== "" &&
      fromEmail.trim() !== "" &&
      $("#techName").val().trim() !=="" &&
      $("#techEmail").val().trim() !==""
    ){
      var ref = tech.push({
        'name': $("#techName").val().trim(),
        'email': $("#techEmail").val().trim(),
        'company': team.trim(),
        'escaped': escape(team.trim()),
        'date': getDate()
      });
      // send email
      sendMail(ref.key(), $("#techName").val().trim(), $("#techEmail").val().trim(), 'tech');
      // clear form
      $(this).trigger("reset");
      $("#techName").focus();
    } else {
        alert("We need your company's name & recipient's contact info.");
        console.log("We need your company's name & recipient's contact info.");
    }
    event.preventDefault();
  });

  $("#devForm").submit(function(event){
    console.log('hrSend pressed');
    if (
      team.trim() !== "" &&
      fromName.trim() !== "" &&
      fromEmail.trim() !== "" &&
      $("#devName").val().trim() !=="" &&
      $("#devEmail").val().trim() !==""
    ){
      var ref = dev.push({
        'name': $("#devName").val().trim(),
        'email': $("#devEmail").val().trim(),
        'company': team.trim(),
        'escaped': escape(team.trim()),
        'date': getDate()
      });
      // send email
      sendMail(ref.key(), $("#devName").val().trim(), $("#devEmail").val().trim(), 'dev');
      // clear form
      $(this).trigger("reset");
      $("#devName").focus();
    } else {
        alert("We need your company's name & recipient's contact info.");
        console.log("We need your company's name & recipient's contact info.");
    }
    event.preventDefault();
  });

  $("#ndevForm").submit(function(event){
    console.log('hrSend pressed');
    if (
      team.trim() !== "" &&
      fromName.trim() !== "" &&
      fromEmail.trim() !== "" &&
      $("#ndevName").val().trim() !=="" &&
      $("#ndevEmail").val().trim() !==""
    ){
      var ref = ndev.push({
        'name': $("#ndevName").val().trim(),
        'email': $("#ndevEmail").val().trim(),
        'company': team.trim(),
        'escaped': escape(team.trim()),
        'date': getDate()
      });
      // send email
      sendMail(ref.key(), $("#ndevName").val().trim(), $("#ndevEmail").val().trim(), 'ndev');
      // clear form
      $(this).trigger("reset");
      $("#ndevName").focus();
    } else {
        alert("We need your company's name & recipient's contact info.");
        console.log("We need your company's name & recipient's contact info.");
    }
    event.preventDefault();
  });

});

// firebase / php update hook thing
$("#checkStatus").click(function(){
  console.log('initiating webhook');
  $.ajax({
    type: 'GET',
    url: 'http://stoutandporter.com/devpost/update.php'
   }).done(function(response) {
     console.log('end webhook');
     console.log(response); // if you're into that sorta thing
  });
});

function sendMail(key, name, email, category) {
  var subject = emailSubject(category);
  var html = emailHTML(key, name, email, category);
  console.log(html);

  // ok, send the damn email.
  $.ajax({
    type: 'POST',
    url: 'https://mandrillapp.com/api/1.0/messages/send.json',
    data: {
      'key': mandrill,
      'message': {
        'from_email': fromEmail,
        "from_name": fromName,
        "track_opens": true,
        "track_clicks": true,
        "inline_css": true,
        'to': [
            {
              'email': email,
              'name': name,
              'type': 'to'
            }
          ],
        'autotext': 'true',
        'subject': subject,
        'html': html
      }
    }
   }).done(function(response) {
     console.log(response); // if you're into that sorta thing
  });
}

function sendReminder(key, name, email, category, company){
  // first, send email
  sendMail(key, name, email, category);

  // next, update firebase
  var fbu;
  switch(category){
    case 'hr':
      fbu = new Firebase(fb +'hr/'+key+'/');
      break;
    case 'tech':
      fbu = new Firebase(fb +'tech/'+key+'/');
      break;
    case 'dev':
      fbu = new Firebase(fb +'dev/'+key+'/');
      break;
    case 'ndev':
      fbu = new Firebase(fb +'ndev/'+key+'/');
      break;
  }
  // update firebase date
  fbu.update({'date': getDate()});
  alert('Reminder email sent to ' + name);


}
function emailHTML(key, name, email, category){
  var html;
  // generate diff emails based on category.
  // need to make email prettyier.

  switch(category){
    case 'hr':
      tf = 'RPJzdZ';
      html = "<p>Hey, I signed us up for <a href='http://devpost.com/teams'>Devpost team pages</a> to help with dev hiring. <a href='https://devpost.typeform.com/to/"+tf+"?company="+escape(team.trim())+"&key="+key+"'>Can you please fill out this short survey today</a> about our team (company size, mission, benefits, open jobs, etc.)?</p><p>Thank you!</p>";
      break;

    case 'tech':
      tf = 'so61HJ';
      html = "<p>Hey, I signed "+team.trim()+" up for <a href='http://devpost.com/teams'>Devpost team pages</a> to improve our dev hiring pipeline. Dots, Genius, Behance, and Blue Apron are already using it. <a href='https://devpost.typeform.com/to/"+tf+"?company="+escape(team.trim())+"&key="+key+"'>Can you please answer a few questions about our dev process, stack, and team</a>?</p><p>Thank you!</p>";
      break;

    case 'dev':
      tf = 'uOGhYP';
      html = "<p>Hey, I signed "+team.trim()+" up for <a href='http://devpost.com/teams'>Devpost team pages</a>. It's going to help us improve our hiring process by giving developers an inside look at our team, process, stack, etc. To do that, I need your help.</p><p>Please <a href='https://secure.devpost.com/users/register'>signup for Devpost</a> and <a href='https://devpost.typeform.com/to/"+tf+"?company="+escape(team.trim())+"&key="+key+"'>complete this short survey</a> about what it's like to work here.</p><p>Thanks!</p>";
      break;

    case 'ndev':
      tf = 'QGeL7v';
      html = "<p>Hey, I signed "+team.trim()+" up for <a href='http://devpost.com/teams'>Devpost team pages</a>. It's going to help us improve our hiring process by giving developers an inside look at our team, office, process, stack, etc. To create our page, I need your help.</p><p>Please <a href='https://secure.devpost.com/users/register'>signup for Devpost</a> and <a href='https://devpost.typeform.com/to/"+tf+"?company="+escape(team.trim())+"&key="+key+"'>complete this short survey</a> about what it's like to work here.</p><p>Thanks!</p>";
      break;
  }
  return html;
}

function emailSubject(category){
  var subject;
  // generate diff emails based on category.
  // need to make email prettyier.

  switch(category){
    case 'hr':
      subject = 'need some recruiting info';
      break;
    case 'tech':
      subject = 'info for dev recruiting';
      break;
    case 'dev':
      subject = 'need your input for dev recruiting';
      break;
    case 'ndev':
      subject = 'need your input for hiring devs';
      break;
  }
  return subject;
}

function getDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd='0'+dd;
  }

  if(mm<10) {
      mm='0'+mm;
  }

  today = mm+'/'+dd+'/'+yyyy;
  return today;
}
