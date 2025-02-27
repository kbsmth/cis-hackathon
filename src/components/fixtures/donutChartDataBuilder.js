import _ from 'underscore';
import jsonLegendNoQuantity from './legendDataNoQuantity';
import jsonFivePlusOther from './donutDataFivePlusOther';
import jsonFivePlusOtherNoPercent from './donutDataFivePlusOtherNoPercent';
import jsonOneZeroed from './donutDataOneZeroed';
import jsonAllZeroed from './donutDataAllZeroed';
import jsonThreeCategories from './donutDataThreeCategories';


export function DonutDataBuilder(config) {
    this.Klass = DonutDataBuilder;

    this.config = _.defaults({}, config);

    this.withFivePlusOther = function() {
        var attributes = _.extend({}, this.config, jsonFivePlusOther);

        return new this.Klass(attributes);
    };

    this.withFivePlusOtherNoPercent = function() {
        var attributes = _.extend({}, this.config, jsonFivePlusOtherNoPercent);

        return new this.Klass(attributes);
    };

    this.withThreeCategories = function() {
        var attributes = _.extend({}, this.config, jsonThreeCategories);

        return new this.Klass(attributes);
    };

    this.withOneTopicAtZero = function() {
        var attributes = _.extend({}, this.config, jsonOneZeroed);

        return new this.Klass(attributes);
    };

    this.withAllTopicsAtZero = function() {
        var attributes = _.extend({}, this.config, jsonAllZeroed);

        return new this.Klass(attributes);
    };

    this.withNoQuantity = function() {
        var attributes = _.extend({}, this.config, jsonLegendNoQuantity);

        return new this.Klass(attributes);
    };

    this.build = function() {
        return this.config.data;
    };
}
