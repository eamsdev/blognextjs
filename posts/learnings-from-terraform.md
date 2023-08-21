---
id: learnings-from-terraform
title: Writing better Terraform code
description: Tips, tricks and learnings from using Terraform with AWS and Azure
date: 02-08-2023
author: Pete Eamsuwan
readTime: 5 min
meta: Tips, tricks and learnings from using Terraform with AWS and Azure
tags:
  - Terraform
  - AWS
  - Azure
thumbnailPath: /post-img/terraform-tips-thumbnail.webp
---

Infrastructure as code is an incredibly powerful tool that allows your cloud infrastructure to be defined and managed through code. This, combined with source control and deployment pipelines, allows you to review and audit changes, as well as automate deployments to your specific environments.

I was incredibly lucky to be given the opportunity to pick up Terraform, an open-source infrastructure as code tool, during my tenure at Leidos in 2021. I have been using Terraform to deploy cloud infrastructure for my personal projects ever since. In this article, I will share some tips that may make your Terraform journey easier.

## Use partial backend configuration

Terraform allows for a partial back configuration to be defined. Using partial backend configuration allows you to decouple yourself from a specific environment and configuration, allowing you to provide these values, either via a variable file or command line arguments at execution time.

```hcl
// Azure
terraform {
  backend "azurerm" {}
}

// AWS
terraform {
  backend "s3" {
  }
}
```

Information that is specific to you, such as S3 Bucket/DynamoDB table in the case of AWS or Resource Group/Storage Account Name in the case of Azure, should be stored separately.

```hcl
// backend.tfvars - Azure
resource_group_name   = ...
storage_account_name  = ...
container_name        = ...
key                   = ...

// backend.tfvars - AWS
key                   = ...
bucket                = ...
dynamodb_table        = ...
region                = ...

```

## Working in a team? Say NO to local state file

Using a local state file for Terraform is generally advised against, for obvious reasons:

1. Checking in your state file to source control as means of sharing can lead to conflicts and loss of data.
2. Local state locking is not possible, multiple users executing terraform commands will cause their state files to drift away from the state of the infrastructure
3. Local state file may contain sensitive information, checking in sensitive information to source control is a NO NO.

## Utilize state locking (AWS)

In a collaborative environment, it is crucial that you use the state locking mechanism if you are using AWS. This can be done by configuring the `dynamodb_table` property in your Terraform backend configuration.

State locking prevents race condition that can arise from multiple users executing Terraform commands on the same remote state. This will help you maintain integrity of your infrastructure state, prevents conflicts, state corruptions and unintended state changes. By pointing the backend configuration to an existing DynamoDb table, Terraform will automatically setup state locking for you.

```hcl
// backend.tfvars - AWS
key                   = ...
bucket                = ...
dynamodb_table        = ... <--
region                = ...

```

Note this Azure handles this by default (good job Microsoft).

## Using the provider's features block to configure provider's specific behaviors

The features block allows providers such as AWS or Azure to offer advanced or experimental configurations that are not enabled by default. By configuring the features block, you can opt in out of these additional capabilities.

As an example, my initial draft of my Azure IasC would consistently fail to perform the `destroy` command to tear down the entire infrastructure, this is due to Azure creating unwanted resources in my resource group. With some research, I found that I could use the `prevent_deletion_if_contains_resources` property in the Azure provider's features block, to force the tear down of the resource group regardless of whether it contains any resources or not. Shown below, is an example of how you could do it.

```hcl
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}
```

Goes without saying that: _Handle with care!_

## Using lifecycle policy to ignore remote changes

Terraform's lifecycle block allows you to define configurations settings related to resource life cycle management. It provides fine-grained control over how Terraform manages resources during updates/destroy etc.

An example of when the lifecycle block comes in handy, was when I wanted to specify a Docker image name and tag for the initial deployment of Azure App Service, but I didn't want Terraform to revert this setting back if a user or a deployment pipeline modifies it. In this scenario, I used `ignore_changes` lifecycle policy to ignore any remote changes to the docker image name. Attached below is an example:

```hcl
resource "azurerm_linux_web_app" "webapp" {
  ...

  lifecycle {
    ignore_changes = [
      # docker image to be managed by the application's CICD pipeline
      site_config[0].application_stack[0].docker_image_name,
    ]
  }

  site_config {
    application_stack {
      docker_image_name        = var.docker_registry_config.image
      ...
    }
    ...
  }
}
```

With the above configuration, when the docker_image_name property is set to another image name or tag and the Terraform configuration is re-applied, it wont force the property to revert back to its original configuration.

## Use sensitive variable flags

In your Terraform journey, you will often need to pass secrets or sensitive information to your Terraform configuration. Should this be the case, you should use the property `sensitive = true` in your `variables.tf`. Apart from ensuring that the sensitive information is not stored in plaintext in your configuration, the sensitive flag ensures that the sensitive variables are not displayed in plain text in Terraform output or logs as well as ensures that the values are not exposed in the state file.

```hcl
// variables.tf
variable "app_secrets" {
  type = object({
    docker_registry_password = string
    db_connectionstring      = string
  })
  sensitive = true
}
```

## Concluding Remarks

I hope you find this article useful, see you in the next one!
