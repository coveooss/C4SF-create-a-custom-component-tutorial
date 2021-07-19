public with sharing class getUserProfile {
    @AuraEnabled
    public static Map<String,Object> getUserProfile() {
        List<Profile> myProfile = [SELECT Id, Name FROM Profile WHERE Id=:userinfo.getProfileId() LIMIT 1];
        return new Map<String,Object>{ 'user_profile' => myProfile[0].Name };
    }
}