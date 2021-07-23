({
    doInit: function (component, event, helper) {
        const coveoSearchUI = component.find('coveoRecommendations');
        const recommendationsContext = component.get('v.recommendationsContext');
        var action = component.get('c.getUserProfile');
        var getUserProfileNamePromise = new Promise(function (resolve, reject) {
            action.setCallback(this, function (response) {
              var state = response.getState();
              if (state === 'SUCCESS') {
                var responseValue = response.getReturnValue();
                coveoSearchUI.proxyAddEventListener('doneBuildingQuery', function (e, args) {
                  var qb = args.queryBuilder;
                  qb.addContext(responseValue);
                });
                resolve();
              } else if (state === 'ERROR') {
                reject(new Error(response.getError()));
              }
            });
          });
        $A.enqueueAction(action);
        coveoSearchUI.addPreInitPromise(getUserProfileNamePromise);

        if (recommendationsContext !== '') {
            coveoSearchUI.registerBeforeInit(function (cmp, root, Coveo) {
                coveoSearchUI.proxyAddEventListener('doneBuildingQuery', function (e, args) {
                    const qb = args.queryBuilder;
                    qb['recommendation'] = recommendationsContext;
                    qb.addContextValue('recommendationsContext', recommendationsContext);
                });
            });
        }
    }
})