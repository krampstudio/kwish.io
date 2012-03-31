/**
 * BabyWishList Platform : A web application to build cool baby wish lists 
 * Copyright (C) 2012  Bertrand CHEVRIER, KrampStudio
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/agpl-3.0.txt
 * 
 * @author <a href="mailto:chevrier.bertrand@gmail.com">Bertrand Chevrier</a>
 * @license http://www.gnu.org/licenses/agpl-3.0.txt
 * @version 0.2.0
 * 
 */

/**
 * Extends the validator module class
 * @requires validator module
 */
var Validator = require('validator').Validator;
    
/**
 * set up the errors list
 */
Validator.prototype._errors = [];

/**
 * When an error is thrown, we add it to an array
 * @param {String} msg the error message
 */
Validator.prototype.error = function (msg) {
    this._errors.push(msg);
    return this;
};

/**
 * Get all the errors thrown
 * @return {Array} the list of error messages
 */
Validator.prototype.getErrors = function(){
    return this._errors;   
};

/**
 * Reset the list of errors thrown
 */
Validator.prototype.reset = function(){
    this._errors = [];   
};

/**
 * Override the validator check method 
 * to prevent _errors to be initialized at each call
 * @param {String} the string to be checked
 * @param {String} the failure message
 * @return {BwValidator} the chainable instance
 */
Validator.prototype.check = function(str, fail_msg) {
    this.str = str == null || (isNaN(str) && str.length == undefined) ? '' : str+'';
    this.msg = fail_msg;
    return this;
};

//export the Validator to be required
module.exports = Validator;