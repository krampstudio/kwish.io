define(['jquery', 'lodash'], function($, _){
    'use strict';

    var Form = {

        setUp: function($form, cb){
            $form.submit(function submitForm(e){
                e.preventDefault();
                if(_.isFunction(cb)){
                    cb(_.reduce($form.serializeArray(), function(result, elt){
                        if(elt.name && !_.isEmpty(elt.name)){
                            result[elt.name] = elt.value;
                        }
                        return result;
                    }, {}));
                }
            });

            $('.submiter', $form).click(function(e){
                e.preventDefault();
                e.stopPropagation();
                $form.submit();
            });
        }
    };

    return Form;
});
