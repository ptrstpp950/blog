---
layout: post
title: AKS - secure master node
---

```
{
  "mode": "All",
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.ContainerService/managedClusters"
        },
        {
          "not": {
            "field": "Microsoft.ContainerService/managedClusters/apiServerAuthorizedIPRanges[*]",
            "in": "[parameters('authorizedIPRanges')]"
          }
        }
      ]
    },
    "then": {
      "effect": "deny"
    }
  },
  "parameters": {
    "authorizedIPRanges": {
      "type": "Array",
      "metadata": {
        "displayName": "Allowed authorized IP ranges",
        "description": "The list of authorized IP ranges that can access AKS master node"
      }
    }
  }
}
```


```
{
    "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.Authorization/policyDefinitions",
            "name": "enforce-aks-private-cluster",
            "apiVersion": "2019-09-01",
            "properties": {
                "displayName": "Enforce AKS private cluster",
                "policyType": "Custom",
                "description": "Enforce AKS private cluster",
                "metadata": {
                    "category": "General"
                },
                "mode": "All",
                "policyRule": {
                    "if": {
                        "allOf": [
                            {
                                "field": "type",
                                "equals": "Microsoft.ContainerService/managedClusters"
                            },
                            {
                                "not": {
                                    "field": "Microsoft.ContainerService/managedClusters/apiServerAccessProfile.enablePrivateCluster",
                                    "equals": "true"
                                }
                            }
                        ]
                    },
                    "then": {
                        "effect": "deny"
                    }
                }
            }
        },
        {
            "type": "Microsoft.Authorization/policyAssignments",
            "apiVersion": "2018-05-01",
            "name": "enforce-aks-private-cluster-enabled",
            "dependsOn": [
                "enforce-aks-private-cluster"
            ],
            "properties": {
                "scope": "[subscription().id]",
                "policyDefinitionId": "[resourceId('Microsoft.Authorization/policyDefinitions', 'enforce-aks-private-cluster')]"
            }
        }
    ]
}
```