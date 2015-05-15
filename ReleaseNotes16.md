# Release Notes for REST Assured 1.6 #

## Highlights ##
  * Forked HTTPBuilder. This means that a lot of workarounds that had to be made in the past can be removed in the future. It enables more control over the code base which allows for many improvements and fixes.
  * Groovy dependency is updated to version 1.8.4.
  * HTML validation has been greatly improved.
  * Added support for pretty-printing the request and response body when logging if content-type is XML, JSON or HTML. This is now default.
  * REST Assured now takes the charset into consideration for both the request and the response. E.g.
```
given().contentType("application/xml; charset=US-ASCII").and().body("my body"). .. 
```
> will encode the body as US-ASCII. You can also specify the default charset for each request:
```
RestAssured.config = newConfig().encoderConfig(encoderConfig().defaultContentCharset("US-ASCII"));
```

## Non-backward compatible changes ##
  * Fixed a serious issue with content-type validation, it was actually ignored in the previous versions ([issue 146](https://code.google.com/p/rest-assured/issues/detail?id=146)).
  * Default content encoding charset has been changed from UTF-8 to ISO-8859-1 to comply with the RFC 2616. To change this use the EncoderConfig, e.g.
```
RestAssured.config = newConfig().encoderConfig(encoderConfig().defaultContentCharset("UTF-8"));
```
> You can also specify the default query parameter charset.
  * Default decoding content charset has been changed from platform default to ISO-8859-1 to comply with the RFC 2616. To change this use the DecoderConfig, e.g.
```
RestAssured.config = newConfig().decoderConfig(decoderConfig().defaultContentCharset("UTF-8"));
```
  * `groovyx.net.http.ContentType` has been renamed to `com.jayway.restassured.http.ContentType`.
  * Third party dependencies have been updated. If you're not using Maven you need replace the [old](http://rest-assured.googlecode.com/files/rest-assured-legacy-dependencies.zip) ones with the [new](http://rest-assured.googlecode.com/files/rest-assured-dependencies.zip) ones in the classpath.

## Other notable changes ##
  * REST Assured now automatically detects content-types ending with +xml, +json and +html (for example application/something+json) and parses the content with the corresponding parser. This means that you don't need to register custom parsers for these kind of content-types ([issue 142](https://code.google.com/p/rest-assured/issues/detail?id=142)).
  * Implemented support for no-value parameters, for example:
```
given().queryParam("someParameterName").when().get("/something");
```
> This works for both "request parameters", query parameters and form parameters. ([issue 143](https://code.google.com/p/rest-assured/issues/detail?id=143))
  * The HTTP Delete method now supports a method body
  * PUT request now work for multi part form data uploading
  * XmlPath supports prettifying and pretty-printing XML and HTML, for example:
```
String prettyXml = with(someXml).prettify(); // Return a prettified XML string. 
```
> or print the XML to System.out and then return it:
```
String prettyXml = with(someXml).prettyPrint(); // Prints and returns a prettified XML string. 
```
> "with" is statically imported from `com.jayway.restassured.path.xml.XmlPath` ([issue 147](https://code.google.com/p/rest-assured/issues/detail?id=147)).
  * JsonPath supports prettifying and pretty-printing JSON documents, for example:
```
String prettyJson = with(someJson).prettify(); // Return a prettified JSON string. 
```
> or print the JSON to System.out and then return it:
```
String prettyJson = with(someJson).prettyPrint(); // Prints and returns a prettified JSON string. 
```
> "with" is statically imported from `com.jayway.restassured.path.json.JsonPath` ([issue 147](https://code.google.com/p/rest-assured/issues/detail?id=147)).

## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details