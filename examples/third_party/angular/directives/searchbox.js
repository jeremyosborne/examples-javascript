// Generic searchbox.
//
// Following methods to be provided on sbInterface
// * sbInterface.throttledSearch -> called while typing.
// * sbInterface.search -> called on form submit or return key.
// * sbInterace.select -> called on a click on the item in the list.
// * sbInterface.label -> called on each item in searchList to generate
// the label for the dropdown.
// * sbInterface.highlight -> function passed the display string and
// which can be used to decorate the string displayed in the dropdown.
//
// Communicates with:
// * sbInterface.searchList -> candidates to display in the dropdown.
// * sbInterface.searchTerm -> either hard set during drop-down plus return
// or on a simple submit.
angular
.module("searchbox", [])
.directive("searchbox", function() {
	return {
		restrict: 'E',
      	templateUrl: "templates/searchbox.html",
        scope: {
            // dropped into the input placeholder.
            placeholder: "@",
            searchList: "=",
			searchTerm: "=",

			throttledSearch: "&",
			search: "&",
			select: "&",
			format: "&"
        },
		link: function(scope, element) {
            scope.showDropdown = false;
            scope.$watchCollection("searchList", function() {
                // Update dropdown list visibility.
				if (scope.searchList) {
                	scope.showDropdown = scope.searchList.length;
				}
            });

            scope.$watch("searchTerm", function() {
                // Update the search term.
                scope.throttledSearch();
            });

			scope.selectItem = function(item) {
				// Allow passing of object by parameter name. Much nice,
				// much better, much avoidance of scope apply timing updates.
				scope.select({item: item});
			};

			scope.formatItem = function(item) {
				return scope.format({item: item});
			};

            element.find("form").on('submit', function(ev) {
                ev.preventDefault();
                // Update the search term.
                scope.search();
                scope.$apply();
            });
        }
    };
});
