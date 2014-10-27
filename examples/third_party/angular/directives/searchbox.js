// Generic searchbox.
//
// Following methods to be provided on sbInterface
// * sbInterface.throttledSearch -> called while typing.
// * sbInterface.search -> called on form submit or return key.
// * sbInterace.select -> called on a click on the item in the list.
// * sbInterface.label -> called on each item in searchList to generate
// the label for the dropdown.
// default is provided and assumes
// * sbInterface.highlight -> function passed the display string and
// which can be used to decorate the string displayed in the dropdown.
// default is provided.
//
// Communicates with:
// * sbInterface.searchList -> candidates to display in the dropdown.
// * sbInterface.searchTerm -> either hard set during drop-down plus return
// or on a simple submit.
angular
.module("searchbox", ["ngSanitize"])
.directive("searchbox", ["$sce", function($sce) {
	return {
		restrict: 'E',
		replace: true,
      	templateUrl: "templates/searchbox.html",
        scope: {
            // dropped into the input placeholder.
            placeholder: "@",
            searchList: "=",
			searchTerm: "=",

			throttledSearch: "&",
			search: "&",
			select: "&",
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

            scope.label = function(item) {
                return item.label;
            };

            // Passed the label string in the dropdown.
            scope.highlight = function(s) {
                var match = s.toLowerCase().indexOf(scope.searchTerm.toLowerCase());
                if (match > -1) {
                    var termLen = scope.searchTerm.length;
                    // injext wrapper.
                    s = s.slice(0, match) + "<strong>" + s.slice(match, match + termLen) + "</strong>" + s.slice(match + termLen);
                }
                return $sce.trustAsHtml(s);
            };

			scope.selectItem = function(item) {
				// Allow passing of object by parameter name. Much nice,
				// much better, much avoidance of scope apply timing updates.
				scope.select({item: item});
			};

            element.find("form").on('submit', function(ev) {
                ev.preventDefault();
                // Update the search term.
                scope.search();
                // This can happen outside of the digest, reflect changes in
                // view.
                scope.$apply();
            });
        }
    };
}]);
