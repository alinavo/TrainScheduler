$(document).ready(function () {

    // Add firebase connection
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCK6GN74L4YRUAnQOL79z-3NWFXXFPzC1g",
        authDomain: "train-scheduler-990b6.firebaseapp.com",
        databaseURL: "https://train-scheduler-990b6.firebaseio.com",
        projectId: "train-scheduler-990b6",
        storageBucket: "train-scheduler-990b6.appspot.com",
        messagingSenderId: "456785142663"
    };


    //initizalize firebase
    firebase.initializeApp(config);

    var database = firebase.database();


    // Capture submit button to add train
    $("#add-train").click(function () {
        event.preventDefault();
        // Grab values from text boxes
        //trim values
        var train = $("#train-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var time = $("#time-input").val().trim();
        var frequency = $("#frequency-input").val().trim();


        //input validation
        // if (train != "" &&
            // destination != "" &&
            // time.length === 4 &&
            // frequency != "") {

            // Code for handling the push
            database.ref().push({
                train: train,
                destination: destination,
                time: time,
                frequency: frequency
            });

            //checks to see if input is valid
        // } else {
        //     alert("Please enter valid train data");
        //     $("input").val("");
        //     return false;    
        // }

        //console.log(database);
        $("input").val("");

    });

    database.ref().on("child_added", function (childSnapshot) {
        // console.log(childSnapshot.val());

        var train = childSnapshot.val().train;
        var destination = childSnapshot.val().destination;
        var time = childSnapshot.val().time;
        var frequency = childSnapshot.val().frequency;


        console.log(train);
        console.log(destination);
        console.log(time);
        console.log(frequency);


        //format time 

        //starting moment.js 
        //variale of current time to determine time til train
        //need to use later to convert to military time 
        var currentTime = moment();
        console.log(moment().format("HHmm"));

        //need frequency to go from string to integer in order to do math
        var frequency = parseInt(frequency);
        console.log(frequency);

        var convertDate = moment(childSnapshot.val().time, "HHmm").subtract(1, "year");
        console.log(convertDate);


        //new variable for train time in military time format
        var trainTime = moment(convertDate).format("HHmm");
        console.log(trainTime);

        var convertTime = moment(trainTime, "HHmm").subtract(1, "years");
        console.log(convertTime);
        //calculating time difference in minutes
        var timeDiff = moment().diff(moment(convertTime), "minutes");
        console.log(timeDiff);

        //calculate time from next train
        //need to use % remainder
        //use varable then to subtract from next time of train

        var timeLeft = timeDiff % frequency;
        console.log(timeLeft);

        //use timeLeft to calculate time until next train 
        var nextTrainTime = frequency - timeLeft;
        console.log(nextTrainTime);

        //calculate next time arrival in minutes
        var nextArrival = moment().add(nextTrainTime, "minutes");
        console.log(nextArrival);

        //displays the arrival time in military time 
        var arrival = moment().add(nextArrival).format("HHmm");
        console.log(arrival);

      //input 
        $("#train-input").append(
            "<tr><td id='nameDisplay'>" + childSnapshot.val().train +
            "<td id='destinationDisplay'>" + childSnapshot.val().destination +
            "<td id='frequencyDisplay'>" + childSnapshot.val().frequency +
            "<td id='arrivalDisplay'>" + nextTrainTime +
            "<td id='awayDisplay'>" + nextArrival + " minutes" + "</td></tr>");

      
        });
    });