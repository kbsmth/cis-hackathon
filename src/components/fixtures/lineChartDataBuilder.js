import _ from 'underscore';
import jsonAllDatas from './lineDataAllDatas';
import jsonFiveTopics from './lineDataFiveTopics';
import jsonFourTopics from './lineDataFourTopics';
import jsonAllZeroes from './lineDataAllZeroes';
import jsonOneSource from './lineDataOneSet';
import jsonTwoTopicsFlat from './lineDataTwoTopicsFlat';
import jsonMultiMonthValueRange from './multiMonthLineData';
import jsonHourDateRange from './lineDataOneSetHourly';
import jsonSmallValueRange from './lineDataSmallValueRange';


export function LineDataBuilder(config) {
    this.Klass = LineDataBuilder;

    this.config = _.defaults({}, config);

    this.with5Topics = function(){
        var attributes = _.extend({}, this.config, jsonFiveTopics);

        return new this.Klass(attributes);
    };

    this.with4Topics = function(){
        var attributes = _.extend({}, this.config, jsonFourTopics);

        return new this.Klass(attributes);
    };

    this.withOneSource = function() {
        var attributes = _.extend({}, this.config, jsonOneSource);

        return new this.Klass(attributes);
    };

    this.withSmallValueRange = function() {
        var attributes = _.extend({}, this.config, jsonSmallValueRange);

        return new this.Klass(attributes);
    };

    this.withMultiMonthValueRange = function() {
        var attributes = _.extend({}, this.config, jsonMultiMonthValueRange);

        return new this.Klass(attributes);
    };

    this.withHourDateRange = function() {
        var attributes = _.extend({}, this.config, jsonHourDateRange);

        return new this.Klass(attributes);
    };

    this.withAllDatas = function() {
        var attributes = _.extend({}, this.config, jsonAllDatas);

        return new this.Klass(attributes);
    };

    this.withTwoFlatTopics = function() {
        var attributes = _.extend({}, this.config, jsonTwoTopicsFlat);

        return new this.Klass(attributes);
    };

    this.withAllZeroes = function() {
        var attributes = _.extend({}, this.config, jsonAllZeroes);

        return new this.Klass(attributes);
    };

    this.build = function() {
        return this.config;
    };
}
