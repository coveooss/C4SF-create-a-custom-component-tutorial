({
    doInit: function(component, event, helper) {
        const action = component.get('c.getUserProfile');
        const recommendationsContext = component.get('v.recommendationsContext');
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var responseValue = response.getReturnValue();
                var customData = {
                    'context_user_profile': responseValue.user_profile,
                }
                if (recommendationsContext) {
                    customData.context_recommendations_context = recommendationsContext
                }
                component.set('v.myCustomData', customData);
            } else if (state === 'ERROR') {
                return new Error(response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})
