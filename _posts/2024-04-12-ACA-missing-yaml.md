---
layout: post
title: Exploring Azure Container Apps (ACA) and the Missing YAML Functionality
image: "/content/images/2024/04/aca.png"
date: '2024-04-09 08:30:12'
tags:
- FinOps
- DevOps
- Azure
---

## Introduction
Have you ventured into the world of **Azure Container Apps (ACA)**? If not, let's dive in! I recently spent some time exploring ACA, and while it offers several benefits, there's one crucial feature that's conspicuously absent: the ability to use **YAML configurations from Kubernetes (K8s)**. In this post, I'll discuss ACA, its advantages, and why the inclusion of YAML support would be a game-changer.

## What Is Azure Container Apps (ACA)?
Azure Container Apps simplifies container orchestration by managing the details for you. Whether you're a seasoned developer or just starting out, ACA allows you to focus on your application logic without worrying about the underlying infrastructure. Here are some key points:

- **Container Agnostic:** ACA supports any Linux-based x86-64 container image, regardless of the runtime, programming language, or development stack you choose.
- **No Required Base Image:** Unlike some other platforms, ACA doesn't impose restrictions on base images. You have the flexibility to use the container image that best suits your needs.

## The Missing Piece: YAML from K8s
While ACA streamlines container management, the absence of YAML support from K8s is a notable limitation. Let's explore why this matters:

1. **Configuration Consistency:** YAML files are the lingua franca of Kubernetes. By allowing ACA to consume YAML configurations, we'd achieve consistency across our deployments. Developers familiar with K8s could seamlessly transition to ACA without rewriting their configurations.
2. **Infrastructure as Code (IaC):** YAML files serve as declarative IaC. They define the desired state of our applications and infrastructure. Integrating ACA with existing YAML files would enhance our IaC practices.
3. **Easier Migration:** Many organizations already use Kubernetes. Enabling ACA to read K8s YAML would simplify migration. We could gradually move workloads to ACA while leveraging existing configurations.

## The Low-Hanging Fruit: Adding YAML Support
Here's the exciting part: Implementing YAML support in ACA would be a relatively straightforward enhancement. While not every K8s YAML line would be directly compatible, we could adapt and remove any incompatible sections. The benefits would far outweigh the effort:

- **Cost Savings:** ACA's pay-as-you-go pricing model makes it an economical choice. By leveraging existing YAML configurations, we'd save both time and money.
- **Testing Agility:** With YAML support, testing ACA for current solutions becomes a breeze. We can validate our configurations, ensure compatibility, and confidently deploy applications.

## Conclusion
Azure Container Apps holds immense promise, but let's not overlook the power of YAML. By bridging the gap between ACA and K8s configurations, we unlock new possibilities. So, Microsoft, consider this our friendly nudge: Add YAML support to ACA, and watch it flourish! 🌟


Happy containerizing! 🚀🐳

Cover from: [ACA vs AKS: Which Azure Service Is Better for Running Containers?](https://techcommunity.microsoft.com/t5/startups-at-microsoft/aca-vs-aks-which-azure-service-is-better-for-running-containers/ba-p/3815164)