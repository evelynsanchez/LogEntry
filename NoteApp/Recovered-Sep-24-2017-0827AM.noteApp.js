
(function () {
    angular.module('noteApp', []);
})();

//filter for Date
(function () {
    "use strict";
    var app = angular.module("noteApp");
    app.filter('formatDate', function () {
        return function (input) {
            var result;
            var format = 'LLL';
            var result = moment.parseZone(input).local().format(format);
            return result;
        }
    })
})();

(function () {
    "use strict";
    angular.module("noteApp")
        .factory("NoteService", NoteService);
    NoteService.$inject = ["$http", "$q"];
    function NoteService($http, $q) {
        
        return {
            GetAll: _GetAll,
            Post: _Post,
            Put: _Put,
            Delete: _Delete
        };
       
        function _GetAll() {
            var settings = {
                url: '../api/Notes',
                method: 'GET',
                cache: false
            };
          
            return $http(settings);
        }
        function success(response) {
            console.log(response);
            return response;
        }
        function error(error) {
            console.log(error);
        }


        function _Post(data) {
            var settings = {
                url: "../api/Notes"
                , method: 'POST'
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , data: JSON.stringify(data)
            };
            return $http(settings)
                .then(_postSuccess, _postError);
        }

        function _postSuccess(response) {
            return response.data;
        }
        function _postError(error) {
            var msg = 'Failed to post notes'
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }

        function _Put(data) {
            var settings = {
                url: "../api/Notes" + Id
                , method: 'PUT'
                , cache: false
                , contentType: 'application/json; charset=UTF-8'
                , data: JSON.stringify(data)
            };
            return $http(settings)
                .then(_putSuccess, _putError);
        }

        function _putSuccess(response) {
            return response.data;
        }
        function _putError(error) {
            var msg = 'Failed to update notes'
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }

        function _Delete(Id) {
            var settings = {
                url: "../api/Notes" + Id
                , method: 'DELETE'
                , cache: false             
            };
            return $http(settings)
                .then(_deleteSuccess, _deleteError);
        }

        function _deleteSuccess(response) {
            return response.data;
        }
        function _deleteError(error) {
            var msg = 'Failed to delete notes'
            if (error.data && error.data.description) {
                msg += '\n' + error.data.description;
            }
            error.data.description = msg;
            return $q.reject(error);
        }



    }
})();

(function () {
    'use strict';
    angular.module('noteApp')
    .controller('MyController', MyController);

    MyController.$inject = ['NoteService'];

    function MyController(NoteService) {

        var vm = this;
        vm.$onInit = _init;
        vm.items = [];
        vm.add = _addNew;
        vm.NoteService = NoteService;
        vm.cancel = _cancel;
        vm.save = _save;
        vm.delete = _delete;
        vm.select = _select;
        console.log("inside controller")

        function _init() {
            NoteService.GetAll().then(getSuccess, getFail);
        }

        function getSuccess(response) {
            console.log(response);
                vm.items = response.data 
        }
        function getFail(error) {
            console.log(error);
           
        }
        function _addNew() {
            vm.item = {};
            vm.itemIndex = -1;
        }
        function _cancel() {
            _stopEdit();
        }
        function _stopEdit() {
            vm.item = null;
            vm.itemIndex = -1;
        }

        function _select(item, index) {
            vm.itemIndex = index;
            vm.NoteService.
        }
        function _save() {
            if (vm.item.id) {
                vm.NoteService.Put(vm.item).then(_putComplete, _putFail)
            }
            else {
                vm.NoteService.Post(vm.item).then(_postComplete, _postFail);
            }
        }

        function _putComplete(data) {
            vm.items[vm.itemIndex] = vm.item;
            _stopEdit();
            console.log("updated successful")
        }

        function _putError(error){
            console.log("Update failed")
        }

        function _postComplete(data) {
            if (data && data) {
                vm.item.id = data
                vm.items.push(vm.item);
                _stopEdit();
                console.log("post successful")
            }
        }
    
        function _postFail(error) {
            console.log("post failed")
        }

        function _delete() {
            if (vm.item.id) {
                NoteService.Delete(vm.item).then(_deleteComplete, _deleteFail)
            }
        }

        function _deleteComplete(data) {
            vm.items.splice(vm.itemIndex, 1);
            _stopEdit();
            console.log("delete successful");
        }

        function _deleteFail() {
           console.log("delete failed")
        }




    }
})();