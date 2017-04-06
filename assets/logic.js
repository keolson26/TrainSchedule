  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBwpQ7U5Mz9IAL69zBJzKC9jkIOPxyYlYs",
    authDomain: "project1-1c77f.firebaseapp.com",
    databaseURL: "https://project1-1c77f.firebaseio.com",
    projectId: "project1-1c77f",
    storageBucket: "project1-1c77f.appspot.com",
    messagingSenderId: "528534940997"
  };
  firebase.initializeApp(config);

var database = firebase.database();

//Populate Stored Trains

database.ref().on("value", function (snapshot) {

	var Startsv = snapshot.val();
	var StartsvArray = Object.keys(Startsv);
	console.log(StartsvArray.length);

		for (var i = 0; i < StartsvArray.length; i++) {
		
			var getKey = StartsvArray[i];
			var getObj = Startsv[getKey];
			console.log(getObj);

			//Recalculate times
			var start= moment(getObj.firstArrival,"HH:mm");
			console.log(start);
			var startConverted = moment(start).format("HH:mm");
			console.log(startConverted);
			var now = moment()._d;
			console.log(now);
			var nowConverted = moment(now).format("HH:mm");
			console.log(nowConverted);
			var elapsed = moment().diff(startConverted,"minutes");
			console.log(elapsed);
			var nextMins = freq - (elapsed % freq);
			var nextTime = moment().add(nextMins, "minutes");
			var nextTimeConverted =moment(nextTime._d).format("HH:mm");

			console.log(nextTimeConverted);
			console.log(nextMins);


			//Paste to Div

			$("#view-train").append(`<tr>
					<td><span class = "dataStyle" id = "train-name">${getObj.trainName}</span></td>
					<td><span class = "dataStyle" id = "dest-name">${getObj.dest}</span></td>
					<td><span class = "dataStyle" id = "freq-mins">${getObj.freq}</span></td>
					<td><span class = "dataStyle" id = "next-arrive">${nextTimeConverted}</span></td>
					<td><span class = "dataStyle" id = "mins-away">${nextMins}</span></td>
					</tr>
				`);		
		}	
});


//Add Train to storage for data persistance
$("#addBtn").on("click", function(event) {

    event.preventDefault();
    console.log("start")
    trainName = $("#name").val().trim();
    dest = $("#destination").val().trim();
    firstArrival = $("#time").val().trim();
    freq = $("#freq").val().trim();

	//Calculate times    

	var startConverted = moment(firstArrival,"HH:mm");
	var now = moment()._d;
	var nowConverted = moment(now).format("HH:mm");
	var elapsed = moment().diff(startConverted,"minutes");
	var nextMins = freq - (elapsed % freq);
	var nextTime = moment().add(nextMins, "minutes");
	var nextTimeConverted =moment(nextTime._d).format("HH:mm");

	//Push to database

	database.ref().push({
	    trainName: trainName,
	    dest: dest,
	    firstArrival: firstArrival,
	    freq: freq
    });

	//Pull out values from database object

	database.ref().on("value", function(snapshot) {

		var sv = snapshot.val();
		var svArray = Object.keys(sv);
		var lastIndex = svArray.length - 1;
		var lastKey = svArray[lastIndex]; //Pulls newest object name
		var lastObj = sv[lastKey]; //Pulls newest object

	//Add Train to train-view div

		$("#train-name").append(lastObj.trainName);
		$("#dest-name").append(lastObj.dest);
		$("#freq-mins").append(lastObj.freq);
		$("#next-arrive").append(nextTimeConverted);
		$("#mins-away").append(nextMins);
	});
});



