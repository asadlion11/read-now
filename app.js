angular.module('taskApp', [])
.controller('taskController', ['$scope', '$interval', function($scope, $interval) {
    // Initialize tasks array
    $scope.tasks = [];
    $scope.task = {}; // Initialize new task object

    // Function to add a new task
    $scope.addTask = function(bookForm) {
        if (!bookForm || bookForm.$invalid) {
            return; // Do not proceed if form is invalid
        }

        // Parse hours and minutes
        const hours = parseInt($scope.task.hours) || 0;
        const minutes = parseInt($scope.task.minutes) || 0;
        const totalSeconds = (hours * 3600) + (minutes * 60);

        if (!validateTask(hours, minutes, totalSeconds)) return;

        // Create a new task object
        const newTask = {
            name: $scope.task.name,
            hours: hours,
            minutes: minutes,
            seconds: 0,
            totalSeconds: totalSeconds,
            timerPromise: null,
            completed: false
        };

        // Add task to list and start timer
        $scope.tasks.push(newTask);
        $scope.startTaskTimer(newTask);

        // Reset form state
        $scope.task = {}; 
        bookForm.$setPristine();
        bookForm.$setUntouched();
    };

    // Validate task inputs
    function validateTask(hours, minutes, totalSeconds) {
        if (hours < 0 || minutes < 0) {
            alert("Time values must be positive!");
            return false;
        }
        if (totalSeconds <= 0) {
            alert("Please enter valid time!");
            return false;
        }
        return true;
    }

    // Start timer for a task
    $scope.startTaskTimer = function(task) {
        if (task.timerPromise || task.completed) return;

        task.timerPromise = $interval(function() {
            task.totalSeconds--;

            // Update displayed time
            task.hours = Math.floor(task.totalSeconds / 3600);
            const remaining = task.totalSeconds % 3600;
            task.minutes = Math.floor(remaining / 60);
            task.seconds = remaining % 60;

            // Mark as completed when time reaches zero
            if (task.totalSeconds <= 0) {
                $interval.cancel(task.timerPromise);
                task.timerPromise = null;
                task.completed = true;
                alert("Time's up for: " + task.name);
            }
        }, 1000);
    };

    // Pause the timer
    $scope.pauseTimer = function(task) {
        if (task.timerPromise) {
            $interval.cancel(task.timerPromise);
            task.timerPromise = null;
        }
    };

    // Reset the timer for a task
    $scope.resetTimer = function(task) {
        $scope.pauseTimer(task);
        task.totalSeconds = (task.hours * 3600) + (task.minutes * 60);
        task.seconds = 0;
        task.completed = false;
    };

}])
// Custom filter for padding numbers with leading zeros
.filter('numberPad', function() {
    return function(input, length) {
        let num = input.toString();
        while (num.length < length) num = '0' + num;
        return num;
    };
});
