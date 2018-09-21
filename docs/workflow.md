
# Workflow Service

Workflow service has been developed as common shared service to be used in whole application. It will be used for update workflow, get workflow, and update workflow with required process for a model based on passed modelId. At this time, it is implemented on Job model.

## get()

This API is developed for get workflow data for a model. It accepts following params:

* string id -> Workflow ID
* string modelName -> Name of model
* string modelId -> Local Record ID of model
* object options -> Context opitons

It returns object with following data:
* history: History logs of this workflow for this model. You can get details for completion stage details from this data
* workflow: workflow data with its all enabled stages

## getStage()

This API is developed for get details for given stage. It accepts following params:
 
 * string id -> Workflow ID
 * string modelName -> Name of model
 * string modelId -> Record ID of model
 * object options -> Context opitons
 
It returns object containing arrays of stage and its related statuses

## getStatus()

This API is developed for get details for given stage. It accepts following params:
 
 * string id -> Workflow ID
 * string modelName -> Name of model
 * string modelId -> Record ID of model
 * object options -> Context opitons
 
It returns object containing arrays of stage statuses and related transitions buttons

## updateStatus()

This API is developed for update status to next status and can be used from frontend or backend. It requires following params:

* string id ->  Workflow Transition ID
* string modelName -> Name of model
* string modelId -> Local Record ID of model
* object options -> Context opitons

It update current workflow status to next status and update into related model. If next status complete current stage then it also create WorkflowStage log. It create notification and Activity feed for updating workflow logs. After updating, it return next workflowStatus Id. 


## updateNextStatus()

This API is developed for update status to specific status. It can be used from backend only. It requires following params:

* string nextStatusId -> Workflow Status Id which need to be updated
* string modelName -> Name of model
* string modelId -> Record ID of model
* object options -> Context opitons. It required current users details

It update current workflow status to given status and update into related model. If next status complete current stage then it also create WorkflowStage log. It create notification and Activity feed for updating workflow logs. After updating, it return next workflowStatus Id.