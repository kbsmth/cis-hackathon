import _ from 'underscore';
import jsonStepDataSmall from './stepDataSmall';
import jsonStepDataMedium from './stepDataMedium';

export function StepDataBuilder(config){
    this.Klass = StepDataBuilder;

    this.config = _.defaults({}, config);

    this.withSmallData = function() {
        var attributes = _.extend({}, this.config, jsonStepDataSmall);

        return new this.Klass(attributes);
    }

    this.withMediumData = function() {
        var attributes = _.extend({}, this.config, jsonStepDataMedium);

        return new this.Klass(attributes);
    }

    this.build = function() {
        return this.config;
    };
}
