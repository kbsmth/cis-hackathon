import _ from 'underscore';
import jsonShortData from './brushDataBis';
import jsonSimpleData from './brushData';

export function BrushDataBuilder(config) {
    this.Klass = BrushDataBuilder;

    this.config = _.defaults({}, config);

    this.withSimpleData = function(){
        var attributes = _.extend({}, this.config, jsonSimpleData);

        return new this.Klass(attributes);
    };

    this.withShortData = function(){
        var attributes = _.extend({}, this.config, jsonShortData);

        return new this.Klass(attributes);
    };

    this.build = function() {
        return this.config.data;
    };
}
