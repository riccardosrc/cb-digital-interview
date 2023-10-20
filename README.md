<h1>CB Digital Interview</h1>

- [1. Overview](#1-overview)
- [2. Prerequisites](#2-prerequisites)
- [3. Installation](#3-installation)
- [4. Environment](#4-environment)
- [5. Running the application](#5-running-the-application)
- [6. Served application](#6-served-application)
- [7. Running unit test](#7-running-unit-test)

## 1. Overview

CB Digital tech assesment.
The project aim to scrape football players salary informations and expose them with dedicated APIs, supporting also features like sort and filters.

## 2. Prerequisites

To be able to run the project the only requirement is to have docker properely installed.
To manage the dependecies the project uses `pnpm`

## 3. Installation

The following command can be used to install locally the project's dependencies.

```bash
$ pnpm install
```

## 4. Environment

The application is configured using the `.env` file, placed at the root of the project.
This file is not committed in the project for security reasons,
but a `.env.example` file is available and provides the correct template for the real `.env` file.

## 5. Running the application

To easily run the application is available the docker compose setup, that will provide:

- application instance
- mongodb instance

## 6. Served application

The application expose a swagger page that allow to keep the APIs well documented and,
on the other hand, have a UI to test them without using other tools.

> **_NOTE:_** the swagger url used to expose the interface should be configured in the `.env` file.

## 7. Running unit test

The unit tests were written using Jest framework.

The following command runs unit tests:

```bash
$ pnpm run test
```
