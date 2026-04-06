# Module - Email Panel

This extension adds a navbar item that shows the latest inbox emails with an unread count badge.

## Table of Contents

* [Introduction](#introduction)
* [Requires](#requires)
* [Installation](#installation)
    * [Pre-build extension release](#pre-build-extension-release)

## Introduction

This extension enhances EspoCRM by adding an email panel button to the top navigation bar. The panel provides quick access to your inbox without leaving the current page, and includes:

- Envelope icon button in the navbar with an unread email count badge.
- Expandable panel showing the latest inbox emails.
- Click on any email subject to open the full email record.
- Settings page to configure whether to show all emails or unread only.
- Respects EspoCRM ACL — only visible to users with Email read access.

## Requires

- EspoCRM >= 9.1.0
- PHP >= 8.2

## Installation

### Pre-build extension release

1. Download the latest release from [Release page](../../releases/latest).
2. Go to **Administration** -> **Extensions** and upload the downloaded file.
