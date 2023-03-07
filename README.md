# Notes app

[![CI](https://github.com/Dmitriy-SP/notes-app/actions/workflows/github-action-check.yml/badge.svg)](https://github.com/Dmitriy-SP/notes-app/actions/workflows/github-action-check.yml)
<a href="https://codeclimate.com/github/Dmitriy-SP/notes-app/maintainability"><img src="https://api.codeclimate.com/v1/badges/c99294debc5e6ab0c04b/maintainability" /></a>

Notes app is a service for creating, editing and storing notes in your browser.<br>
<a href="https://frontend-project-11-inky.vercel.app/">You can try web-version on vercel.</a>

- [Description](#Description)
- [Installation](#Installation)
- [Usage](#Usage)

## Description

This service allows you to add many notes (maximum 999), edit them with <a href="https://www.tiny.cloud/powered-by-tiny/?utm_campaign=editor_referral&utm_medium=poweredby&utm_source=tinymce&utm_content=v6">tinyMCE</a> and save them in the your browser.

## Installation

```
git clone git@github.com:Dmitriy-SP/notes-app.git
make install
```

## Usage

Deploy local server:

```
$ make develop
```

Build production:

```
$ make build
```