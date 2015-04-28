// Generic searchbox.
//
// Following methods to be provided:
// * throttledSearch -> called while typing.
// * search -> called on form submit or return key.
// * select -> called on a click on the item in the list.
// * format -> passed each line item object in the drop down for
//   formatting. Should return a string or an $sce object.
//
// Following data to be shared:
// * placeholder -> what's shown in the input of the placeholder.
// * searchList -> candidates to display in the dropdown.
// * searchTerm -> either hard set during drop-down plus return
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
