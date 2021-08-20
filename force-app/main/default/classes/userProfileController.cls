public with sharing class userProfileController {
    @AuraEnabled
    public static Map<String,Object> getUserProfile() {
        if (userinfo.getUserType() == 'Guest') {
            return new Map<String,Object>{};
        }
        if (!Schema.sObjectType.Profile.fields.Id.isAccessible() || !Schema.sObjectType.Profile.fields.Name.isAccessible()) {
            throw new System.NoAccessException();
        }
        List<Profile> myProfile = [SELECT Id, Name FROM Profile WHERE Id=:userinfo.getProfileId() LIMIT 1];
        return new Map<String,Object>{ 'user_profile' => myProfile[0].Name };
    }
}