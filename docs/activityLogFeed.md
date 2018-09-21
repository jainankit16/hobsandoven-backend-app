# Activity /Feed Logs

## Activity Feed
To log activity of a user for creating/updating a record or transaction / transition. This logs can be see at Feed page at frontend. On click on view buttton, user can see list of fields which has been changed.

## Create Activity Feed 
Create Activity feed would be done only from backend side. For this we need to call following method on current model:

```javascript
<Model>.app.models.Activity.createFeed(feedData);
```

```javascript
feedData should be like:
    {
        modelId: <Model Id>,
        modelName: '<Model Name>',
        type: 'Update',
        description: 'CUSTOMER APPOINTMENT STATUS has been updated.',
        sfMeta: { 
            sfdcId: '<SFDCId>',
            sfdcObject: '<SFDC Object Name>' 
        },
        newData: { 
            Appointment_Schedule_Status_Customer__c: 'No or Phone Scheduling (2nd Attempt)',
            Appointment_Schedule_Status_Customer_vms__c: 'test update',
            updatedAt: 2018-04-18T03:56:48.116Z 
        },
        oldData: { 
            sfdcId: 'a1B1a000002n6E7EAI',
            Appointment_Schedule_Status_Customer__c: 'No or Phone Scheduling (2nd Attempt)',
            Appointment_Schedule_Status_Customer_vms__c: 'tst',
            CKSW_BASE__Account__c: '0011a00000itklDAAQ',
            CKSW_BASE__Appointment_Finish__c: null,
            CKSW_BASE__Appointment_Start__c: null,
            Dispatch_Worker_Phone__c: '+49 176 5123 0832',
            isCancelled: null,
            id: 1102,
            createdAt: 2018-02-20T08:25:04.000Z,
            updatedAt: 2018-04-17T11:45:08.000Z,
        },
        context: { 
            activityById: <user.Id>,
            activityByName: '<user.firstname user.lastname>',
            activityByType: 'User',
            accountId: '<Job.CKSW_BASE__Account__c>',
            partnerCaseId: '<Job.Partner_Case_Number__c>',
            vendorId: '<Job.Vendor__c>',
            proejctId: '<Job.Project__c>',
            programName: '<Job.project.Name>',
            caseId: '<Job.Case__c>',
            workOrderId: '<Job.Work_Order__c>' 
        }
    }
```
Above example is for update few fields in job section. You can put any number of data fields in oldValue and newValue. Activity feed will store only changed data. 
