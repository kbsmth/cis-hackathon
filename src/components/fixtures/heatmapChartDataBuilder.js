import _ from 'underscore';
import jsonWeeklyBis from './heatmapWeeklyBis';
import jsonWeekly from './heatmapWeekly';

export function HeatmapDataBuilder(config) {
    this.Klass = HeatmapDataBuilder;

    this.config = _.defaults({}, config);

    this.withWeeklyData = function () {
        var attributes = _.extend({}, this.config, jsonWeekly);

        return new this.Klass(attributes);
    };

    this.withAlternativeWeeklyData = function () {
        var attributes = _.extend({}, this.config, jsonWeeklyBis);

        return new this.Klass(attributes);
    };

    this.build = function () {
        return this.config.data;
    };
}
