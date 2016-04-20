var app = angular.module('app', []);

app.controller("ctrl", function($scope) {
	$scope.welcomeMsg = true;
	$scope.tutorList = false;
	$scope.optionList = [
		{
			title: "Email",
			addition: [
			"I cant Log in", 
			"I can't remember my password", 
			"How do I email", 
			"my phone is not so good with the email stuff"
			]
		},
		{
			title: "Cell Phone",
			addition: [
			"I dont really know how to use it in general",
			"I have a windows phone",
			"I have an Android",
			"I have an iPhone"
			]
		},
		{
			title: "TV",
			addition: [
			"I cant turn it on",
			"Its not working right",
			"ITS FACE-MELTINGLY LOUD"
			]
		},
		{
			title: "Internet",
			addition : [
			"I bought something new and cant connect it to my internet",
			"How do i set up the internet",
			"How do i avoid getting scammed?",
			"What is a GILF?",
			"What is a browser history and how do i delete it?"

			]
		},
		{
			title: "Social Media",
			addition : [
			"How do i use the facebook?",
			"What are the different types of Social Media",
			"How do I protect my privacy?"
			]
		},
		{
			title: "Equipment",
			addition : [
			"I need help installing things",
			"What do i need to buy to do what i want to do",
			"I dont know what is compatible with what"

			]
		},
		{
			title: "computer",
			addition : [
			"I would like general computer help",
			"I have a mac",
			"I have a PC",
			"I have windows"

			]
		},
		{
			title: "I see a bright Light",
			addition : [
			"I have lived an evil Life and fear retribution in the afterlife",
			"How do i cut children out of a will",
			"The light has a red tint",
			"The cats are circling"

			]
		},
		{
			title: "Purchasing Advice",
			addition : [
			"What should I buy?",
			"Which is better?",

			]
		}


	];
	$scope.selectedList = [];
	$scope.addToList = function(foo, index) {
		$scope.selectedList.push(foo);
		$scope.optionList.splice(index, 1);
		console.log("selectedList: " + $scope.selectedList);
	}
	$scope.removeFromSelected = function(foo, index) {
		$scope.optionList.push(foo);
		$scope.selectedList.splice(index, 1);
		console.log("optionList: " + $scope.optionList);

	}
	$scope.addToOptions = function() {
		$scope.selectedList.push({title:$scope.input});
		$scope.input = "";
	}
	
	//future functionality: when a user submits an interests list with a new item, 
	//log the new item and place it into an evaluation loop
	//and if more people request it, add it to the list
}); 
