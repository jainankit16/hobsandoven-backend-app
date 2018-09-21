If there is a model that reflects the object in Salesforce and they require to be in sync, you can use *SalesforceUpdate* mixin to automatically push the changes to Salesforce when the model is Create, Update or Delete operation is peformed on model.

# Setup

Basic configuration setup is required to use this mixin which includes providing SFDC credentials to use for authentication. Currently, only way to provide credentials is by using environment variables. Below are the environment variables you can use:

### SFDC_URL *(Optional)*
Set this variable to SalesForce login URL. By default, plugin will use production url (https://login.salesforce.com) to authenticate, but if you are going to use test or sandbox environment, set this variable to correct URL.

### SFDC_USER *(Mandatory)*
Set this variable to salesforce username that should be use for login.

### SFDC_PASS *(Mandatory)*
Set this variable to salesforce password + security token to use user for login.

# Using SalesforceUpdate Mixin

## Model Configuration

To use with model, add the mixins attribute to the definition object of model config.

```
  {
    "name": "MyModelName",
    "properties": {
      "name": {
        "type": "string",
      }
    },
    "mixins": {
      "SalesforceUpdate" : {
          "sfdcObject": "SalesforceObjectName"
      }
    }
  }
```

## Model Options
There are few configuration options to tweak the behaviour of mixin as explained below

**sfdcObject** *(Required)*
sfdcObject is a required parameter and should be set to actual SFDC object name that model syncs to. For example, in backend application *Product* model syncs to *Product2* object of Salesforce. In this case, the, use the following option while using mixin in *Product* model:

```
  {
    "name": "Product",
    "mixins": {
      "SalesforceUpdate" : {
          "sfdcObject": "Product2"
      }
    },
    "properties": {
      "sfdcId": {
        "type": "string",
      }
    },
```

**ignoreFields** *(Optional)*
If there are fields in model that doesn't needs to be synced to Salesforce object or doesn't exist in Salesforce object, you can define them as a list in *ignoreField* option. In *Job* model, there are createdAt and modifiedAt fields that don't exist in Salesforce object. You can use following settings to ignore these fields from mixin:

```
  {
    "name": "Job",
    "mixins": {
      "SalesforceUpdate" : {
        "sfdcObject": "CKSW_BASE__Service__c",
        "ignoreFields": ["updatedAt", "createdAt"]
      }
    },
    "properties": {
      "sfdcId": {
        "type": "string",
      }
    },
```
