RecordType is used to group particular set of records in an object.

Ex: -In order to query the 'Master' records from Project, we need to use RecordTypeId from the Project Model and query the RecordType Model to get the name of the RecordType like **RecordType.Name = Master** as the condition. -In order to query the 'Child' records from Project, we need to use **RecordType.Name = Standard - Dispatch FSE** as the condition.

RecordType model is used in below models

Model|Field|	Filter values
---|---|---
Account|RecordTypeId|Partner
Case|RecordTypeId|
Job|RecordTypeId|FSE Dispatch
JobOrderItem|RecordTypeId|
MetroVirtualVendorPool|RecordTypeId|
Product|RecordTypeId|
Project|RecordTypeId|Master, Standard - Dispatch FSE
WorkOrder|RecordTypeId|Dispatch Worker Project Management Center (FSEPC)

## Model Decription

Model Name|Fields|Decription
---|---|---
RecordType|sfdcId|Indicates the RecordtypeId associated for the respective SFDC objects.
RecordType|Name|Indicates the Name of the RecordType eg: 'Master', 'Standard - Dispatch FSE' in Project object
RecordType|Description|Indictaes the RecordType Decription, like the usage of the RecordType in the respective SFDC object.
RecordType|SobjectType|Indictaes the SobjectType like object name equal to model name, eg: Account, Case etc SobjectTypes
RecordType|IsActive|Indictaes if the RecordType is active or not
RecordType|DeveloperName|Indictaes the API name of the RecordType Name. eg: Standard_Dispatch_FSE
RecordType|NameSpacePrefix|Indictaes the NamePrefix if any.
