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
                // On doneBuildingQuery, adds the return value of the server-side action to the context.
                coveoSearchUI.proxyAddEventListener('doneBuildingQuery', function (e, args) {
                  var qb = args.queryBuilder;
                  qb.addContext(responseValue);
                });
                // Once we have the user profile name, resolve the pre-init promise.
                resolve();
              } else if (state === 'ERROR') {
                // If there was an error, reject the promise.
                // Handle the error.
                reject(new Error(response.getError()));
              }
            });
          });
        // Executes the server-side action.
        $A.enqueueAction(action);
        // Add the promise to the list of promises the searchUI is waiting on before it initializes.
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