## Stack

[Nest](https://github.com/nestjs/nest) as framework.
[jest](https://jestjs.io/) for tests e2e and unit.

## Description

Dentro da pasta `src` encontra-se todo o código do projeto. Possuindo 3 arquivos e 3 pastas. Os arquivos são os seguintes:

- `app.module.ts` which basically contains the entire Nestjs application.
- `bootstrap.ts` responsible for server settings.
- `main.ts` responsible for starting the server and the application.

The folders are as follows:

- `domain` contain all the most important interfaces/classes of the system (entities or domains).
- `modules` containing system modules (Users, Auth, Queue)
- `utils` contains utility files. They do not belong to any module but contain simple functions that can be used throughout the system.

- The application settings are made in the file `.env`

### Solution description.

The queue uses the FIFO policy, but with a modification. If any message that was removed from the queue for processing but was not processed in time returns to the queue, it will be inserted in the first position. So for new messages queue has a queue behavior but for messages that are returning, it has a stack behavior.

There is a queue that contains all available messages. When any number of messages are requested from the queue, that number of messages is removed from that main queue and goes to a hash table. At the same time, a timer (`setTimeout`) is started.

If the message is not processed in time, the timer is activated, the message is deleted from the hash table and placed in the first position in the queue, allowing the next request to retrieve the message.

If the message is processed on time, that is, the server receives the call that indicates that the message has been processed, the message is removed from the hash table and the timer is stopped. If a problem occurs and the timer is not stopped, nothing happens, as the message will already be out of the hash table so it will not be returned to the main queue.

I chose to use this structure (the queue and a hash table), so that it is not necessary to do any type of filter in the queue, which avoids a higher processing consumption. This way also ensures that only with synchronous operations is it possible to manage the entire queue without causing a processing issues and without risking concurrent access to the same task.

## Installation

```bash
$ npm i
```

## Running the app

```bash
# development
$ npm run start

# development watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

### Doc for endpoints:

http://localhost:3000/api

Swagger with all the endpoints, documentation of the returns and configured so that it can be used in the application test.

## Test

### unit tests

```bash
# unit tests
$ npm run test

# unit tests watch
$ npm run test:watch
```

Only one of the utils functions and the queue service have unit tests. Ideally all files should have unit tests, however due to the time, I focused on the queue service, as it is in fact the most important part.

### e2e tests

To test the controllers, decoraetors and other services, i found it easier to leave it up to the e2e test, since since there are several small files to guarantee few scenarios, it would be easier to test only the scenarios.

In the e2e tests, the most common scenarios for using endpoints were considered (if any are out, it is because i forgot).

```bash
# e2e tests watch
$ npm run test:e2e
$ npm run test:e2e:watch
```

## Improvements

The improvement points i see are as follows:

- Currently, the processing time of each message is defined as `.env`. An interesting improvement would be to put the maximum processing time in each message, this time could be defined by who sends the message and/or who requests the message. This improvement is not complex and would bring more versatility to the application.

- Store the queue in some database or some structure/language (something) other than storing the values ​​in memory. Storing the values ​​in memory makes it much more complex to scale the application, more vulnerable to failures and data loss.

- Node is a super fast language for IO, however applying it to the queue management doesn't seem like the most sensible choice. Time events are also not as efficient in Node (Javascript in general). So, I believe that a good idea would be to use the node just to insert and remove messages from the queue, but the queue itself could be in another location. For example, Node is the web interface, but the queue itself is on a machine that runs C ++. That way it is even possible to scale the machines to the endpoints without problems. We can even use some servless structure (lambda functions or similar) for the endpoints.

- Another interesting way would be to think of a blockchain queue. It is not the fastest way of all but it is a very safe way, and added to that we can have our application distributed, which would make it easier for the application to scale.

- Another interesting improvement would be to use a database to store the queue, but use transactions to remove elements. Following the same proposal, the hash table could be a table in the database. That way it wouldn't be that fast but it would be easier to scale. Relational databases alone already manage concurrency between transactions, perhaps there is also a NoSql database that manages this efficiently. (There may even be a NoSql specialized in queues)
