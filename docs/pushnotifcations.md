# Push Notification Service

Push notification service has been developed as common shared component to be used in whole application. Now polling is using insted of  Socket.io to get real time notifications on the page.

## createAlert()

This API is developed for create alert notification for the related users. This is implemented in Alert model.
To use this from any model after save use below code:
<Model>.app.models.Alert.createAlert(notificationData, function (err, data) { });

notificationData will be like : 

 var notificationData = {
                alert: {
                    modelId: sfdcId,
                    modelName: 'Job',
                    type: 'info',
                    message: 'CUSTOMER APPOINTMENT STATUS has been updated.',
                    viewUrl: '/vms/jobs/view/' + sfdcId
                },
                userAlert: {
                    accessType: 'internal',
                    userType: [
                        'Vendor Contact (Case Dispatch Dept.)',
                        'Vendor Contact (Case Dispatch Lead )',
                        'Dispatch - Named FE Worker Pool'
                    ]
                }
            };

#### Parameters:
* message : pass message here [*Required Field]
* type : Type of message, like info, warning, etc [*Required Field]
* modelName : Name of model for which notification has been generated [*Required Field]
* modelId : sfdcId of model [*Required Field]
* accountId : Account Id of vendor. If notification is for internal user then it is not required
* accessType : Type of user like partner, vendor, internal [*Required Field]
* viewUrl : url to be visit on clicking on notification [*Required Field]
* userType : Type of user. Pass userType name. Multiple user type can be pass as array. [*Required Field]

#### Description
On the basis of account Id, Access Type and user Type notification will be sent to related users. 

## showAlertNotification()

### Parameters:
* limit : [Optional] Default 10
* order : [Optional] Default id DESC

#### Description
It will list all notifications for current logged in users.


## showUnreadCount()

#### Parameters:
* userId : user ID of a user [*Required Field]
#### Description
Will Return total number of unread notifications of a user

## markRead()

#### Parameters
* alertId : [Optional] alertId

#### Description
 Alert Id to pass for which should be marked as Read for current logged in user. If it is not passed then, all notifications of current logged in users would be marked as read.