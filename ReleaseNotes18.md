# Release Notes for REST Assured 1.8.0 #

## Highlights ##
  * [XmlPath](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/path/xml/XmlPath.html) and [JsonPath](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/path/json/JsonPath.html) have been extracted to their own projects which means that you can use them without depending on REST Assured. See the [getting started](GettingStarted.md) page for more details on how to start using them.
  * Both XmlPath and JsonPath can now be configured independently. For example you can config custom object serializers and charset etc. JsonPath example:

```
    JsonPath jsonPath = new JsonPath(SOME_JSON).using(new JsonPathConfig("UTF-8"));
```

> It's also possible to configure JsonPath and XmlPath statically:

```
    JsonPath.config = new JsonPathConfig("UTF-8");
```

> See [JsonPathConfig](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/path/json/config/JsonPathConfig.html) and [XmlPathConfig](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/path/xml/config/XmlPathConfig.html) for more details.

## Non-backward compatible changes ##
  * Third party dependencies have been updated, download the corresponding distribution zip file from the [download page](http://code.google.com/p/rest-assured/downloads/list).
  * `com.jayway.restassured.exception.ParsePathException` was renamed to `com.jayway.restassured.exception.PathException`
  * JsonPath now throws [JsonPathException](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/path/json/exception/JsonPathException.html) instead of Groovy's `JsonException` when parsing invalid JSON documents
  * XmlPath now throws [XmlPathException](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/path/xml/exception/XmlPathException.html) instead of `PathException` when parsing invalid malformed XML documents
  * [ObjectMapperDeserializationContext](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/mapper/ObjectMapperDeserializationContext.html)#getResponse() has been renamed to "getDataToDeserialize()". It no longer returns an instance of `ResponseBodyData`, it now returns an instance of [DataToDeserialize](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/mapper/DataToDeserialize.html).

## Other notable changes ##
  * Added getPath method to [Node](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/path/xml/element/Node.html) and [NodeChildren](http://rest-assured.googlecode.com/svn/tags/1.8.0/apidocs/com/jayway/restassured/path/xml/element/NodeChildren.html) elements in XmlPath which allows you get a subpath using the GPath notation.
  * Improved speed of JsonPath when parsing multiple values
  * Upgraded to Groovy 2.1.2


## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details