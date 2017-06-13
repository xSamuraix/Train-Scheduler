 $(document).ready(function() {
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyCCKgceB2eETXmqshoyhccxyWWhkJC4U",
        authDomain: "train-scheduler-68599.firebaseapp.com",
        databaseURL: "https://train-scheduler-68599.firebaseio.com",
        projectId: "train-scheduler-68599",
        storageBucket: "train-scheduler-68599.appspot.com",
        messagingSenderId: "291269746195"
      };
      firebase.initializeApp(config);

      // Reference database
      var database = firebase.database();
    

      $("#add-train-btn").on("click", function(event) {
        event.preventDefault();
        // Grabs user input
        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var trainStart = $("#start-input").val().trim();
        var trainRate = $("#rate-input").val().trim();
        // Creates "temporary" object for holding train data
        var newTrain = {
          name: trainName,
          destination: trainDestination,
          start: trainStart,
          rate: trainRate
        };
      
        database.ref().push(newTrain);

        // Clears all of the text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#start-input").val("");
        $("#rate-input").val("");
      });

      database.ref().on('child_added', getData, error);

      function getData(snapshot) {
        var data = snapshot.val();

        var startTime = moment(data.start, 'HH:mm');
        console.log(startTime);
        var difference = moment().diff(moment(startTime), 'minutes');
        console.log(difference);
        var remainder = difference % parseInt(data.rate);
        console.log(remainder);
        var minutesAway = parseInt(data.rate) - remainder;
        console.log(minutesAway);
        var nextArrival = moment().add(minutesAway, 'minutes');
        nextArrival = moment(nextArrival).format('HH:mm');
        console.log(nextArrival);

        var name = data.name;
        var dest = data.destination;
        var start = data.start;
        var frequency = data.rate;

        var tableRow = $('<tr>');

        var tableData = '<td>' + name + '</td>' +
                        '<td>' + dest + '</td>' +
                        '<td>' + start + '</td>' +
                        '<td>' + frequency + '</td>' +
                        '<td>' + nextArrival + '</td>' +
                        '<td>' + minutesAway + '</td>';

        tableRow.append(tableData);

        $('#train-table').append(tableRow);
      }

      function error(error) {
        console.log(error);
      }

    });