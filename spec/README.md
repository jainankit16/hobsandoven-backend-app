## Contents

This module allows you to run Jasmine specs for your Node.js code. The output will be displayed in your terminal by default.

## Installation

# Local installation:
npm install --save-dev jasmine

# Global installation
npm install -g jasmine


## Initializing

To initialize a project for Jasmine

`jasmine init`

To seed your project with some examples

`jasmine examples`

## Usage

To run your test suite

`jasmine`


Unit Testing Using Jasmine Framework: platform and language independent.

Installation: npm install jasmine –save-dev

To generate example of test case (Optional if manually implemented) :  after installation we can run simply by "jasmine" otherwise we need to run "npm test"
1. npm install jasmine -g (global installation)
2. npm jasmine init (initalize spec folder , create  support/jasmine.json)
3. npm jasmine examples (create test example in spec folder of the chosen project)

Running tests: 
1. jasmine (to run all) / npm test (project package.json set up as
  {“scripts“ : {“test”:”jasmine”}})
2. jasmine spec/filename (to run specific file)

Syntax/Usage : 
include/import all required modules
describe : It used to declare model name / or any description of sec as required

beforeEach : To initialize common like  new object / db connection.

AfterEach :  To destroy the connection/ close the connection

it : Inside the describe body , has two params first one is description of implementation and second parameter used as function implementation. 


Jasmine Matcher : 

1. expect(true).toBe(true);
2. expect(true).not.toBe(true);
3. expect(a).toEqual(12);
4. expect(a).not.toEqual(12);
5. expect(message).toMatch(/bar/);
6. expect(message).not.toMatch(/bar/);
7. expect(null).toBeNull();
8. expect(null).not.toBeNull();
9. expect(e).toBeLessThan(pi);
10. expect(e).not.toBeLessThan(pi);
11. expect(foo).toThrowError("foo bar baz");