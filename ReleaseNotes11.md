# Release Notes for REST Assured 1.1 #

## Highlights ##
  * Major improvements to XML expecations. It now uses Groovy syntax for the expectation string to allow for much better expectations! Note that this fix will break backward compatibility on some expectations. E.g. given
```
<greeting>
    <name>
	<firstName>John</firstName>
	<lastName>Doe</lastName>
    </name>
</greeting>
```
> you used to do:
```
expect().body("greeting.name", hasItems("John", "Doe"))..
```
> Now this will not work, instead you have to do:
```
expect().body("greeting.name.children()", hasItems("John", "Doe"))..
```
> But this also means that you can do:
```
expect().body("greeting.name.size()", equalTo(2))..
```
> See [this](http://groovy.codehaus.org/Updating+XML+with+XmlSlurper) link for more info about the syntax.
  * Major improvements to JSON expectations. It now uses Groovy syntax for the expectation string to allow for much better expectations. Note that this fix will break backward compatibility on some expectations:
    1. JSON lists are always returned as Java lists which means that you should use the hasItem(..) hamcrest matcher and not hasItemsInArray(..) hamcrest matcher.
  * Added [XmlPath](http://rest-assured.googlecode.com/svn/tags/1.1/apidocs/com/jayway/restassured/path/xml/XmlPath.html) object which allows you to parse an XML response from a request easily. E.g.
```
String xml = post("/greeting").asString();
String firstName = with(xml).get("greeting.firstName");
```
> For more information refer to the javadoc of [XmlPath](http://rest-assured.googlecode.com/svn/tags/1.1/apidocs/com/jayway/restassured/path/xml/XmlPath.html)
  * Added [JsonPath](http://rest-assured.googlecode.com/svn/tags/1.1/apidocs/com/jayway/restassured/path/json/JsonPath.html) object which allows you to parse an JSON response from a request easily. E.g.
```
String json = post("/greeting").asString();
String firstName = with(json).get("greeting.firstName");
```
> For more information refer to the javadoc of [JsonPath](http://rest-assured.googlecode.com/svn/tags/1.1/apidocs/com/jayway/restassured/path/json/JsonPath.html)

## Other notable changes ##
  * Support for specifying request/query parameters in the url, e.g.
```
get("/something?param1=first&param2=second");
```
  * Support for specifying base path using
```
RestAssured.basePath = "/resource";
```
> E.g. let's say that the base URI is http://localhost and base path is "/resource" will make create a request to "http://localhost/resource/something" when doing a
```
get("/something");
```
> Default value is empty.
  * Support for specifying default authentication scheme. E.g. use
```
RestAssured.authentication = basic("username", "password")
```
> to cause all subsequent request to use basic authentication. You can reset to no authentication using `RestAssured.reset()`;
  * Support for registering a predefined parser for unsupported mime-types by using:
```
RestAssured.registerParser(<mime-type>, <parser>);
```
> E.g. to register that mime-type 'application/vnd.uoml+xml' should be parsed using the XML parser do:
```
RestAssured.registerParser("application/vnd.uoml+xml", Parser.XML);
```
> You can also unregister a parser using:
```
RestAssured.unregisterParser("application/vnd.uoml+xml");
```

## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details