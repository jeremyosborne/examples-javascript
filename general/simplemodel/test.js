/* global describe:false, it:false, beforeEach:false, inject:false, expect:false, module:false */
describe('simpleModel basic use', function() {

    var simpleModel;

    beforeEach(module('adcListingBuilderComponents'));
    beforeEach(inject(function(_simpleModel_) {
        simpleModel = _simpleModel_;
    }));

    it('should be able to reference not-defined keys and return undefined, not throw', function() {
        var data = {};
        var o = simpleModel(data);
        expect(o.get('test.test.test')).toEqual(undefined);
    });

    it('can wrap existing data and retrieve said data', function() {
        var data = {
            name: 'Bobberino'
        };
        var o = simpleModel(data);
        expect(o.get('name')).toEqual('Bobberino');
    });

    it('can find nested data', function() {
        var data = {
            tags: {
                name: 'Bobberino'
            }
        };
        var o = simpleModel(data);
        expect(o.get('tags.name')).toEqual('Bobberino');
    });

    it('setting is chainable (should return object context)', function() {
        var data = {};
        var o = simpleModel(data);
        expect(o.set('test', 42)).toBe(o);
    });

    it('should set as expected', function() {
        var data = {};
        var o = simpleModel(data);
        o.set('name', 'Jane Doe');
        expect(o.get('name')).toEqual('Jane Doe');
    });

    it('should reference underlying data with toJSON', function() {
        var data = {};
        var o = simpleModel(data);
        expect(o.toJSON()).toBe(data);
    });

    it('should copy data when cloning, not reference', function() {
        var data = {
            name: 'Jane Doe'
        };
        var o = simpleModel(data);
        // Deep compare vs....
        expect(o.cloneData()).toEqual(data);
        // ...memory address compare.
        expect(o.cloneData()).not.toBe(data);
    });



    // Below lie !unit tests.
    it('should underlying data with JSON.stringify()', function() {
        var data = {
            name: 'Jane Doe'
        };
        var o = simpleModel(data);
        expect(JSON.stringify(o)).toEqual(JSON.stringify(data));
    });

});



describe('simpleModel validation', function() {

    var simpleModel;

    beforeEach(module('adcListingBuilderComponents'));
    beforeEach(inject(function(_simpleModel_) {
        simpleModel = _simpleModel_;
    }));

    it('should validate true for any property without a validator', function() {
        var data = {
            hi: 'yes'
        };
        var o = simpleModel(data);
        expect(o.valid('hi')).toBe(true);
        // including non-existent properties
        expect(o.valid('test.test')).toBe(true);
    });

    it('should fail validation for matching types but falsey data', function() {
        var data = {
            test: '',
        };
        var validator = {
            test: '',
        };
        var o = simpleModel(data, validator);
        expect(o.valid('test')).toBe(false);
    });

    it('should fail validation for mismatching types', function() {
        var data = {
            test: 42,
        };
        var validator = {
            test: '42',
        };
        var o = simpleModel(data, validator);
        expect(o.valid('test')).toBe(false);
    });

    it('should pass when a validation function returns true', function() {
        var data = {
            test: 42,
        };
        var validator = {
            test: function(v) {
                return v < 1000;
            },
        };
        var o = simpleModel(data, validator);
        expect(o.valid('test')).toBe(true);
    });

    it('should fail when a validation function returns false', function() {
        var data = {
            test: 42,
        };
        var validator = {
            test: function(v) {
                return false;
            },
        };
        var o = simpleModel(data, validator);
        expect(o.valid('test')).toBe(false);
    });

    it('should call the validator function in the context of the model', function() {
        // Sorry for the crazy test. The point is to prove
        // that the data retrieved could only come from
        // the this context, not that using a simple model this
        // way is good.
        var data = {
            name: 'Krish',
            test: 42,
        };
        var validator = {
            test: function(v) {
                return this.get('name') === 'Krish';
            },
        };
        var o = simpleModel(data, validator);
        expect(o.valid('test')).toBe(true);
    });

});
