# Release Notes for REST Assured 1.7 #

## Highlights ##
  * Support for [configuring pre-defined](http://code.google.com/p/rest-assured/wiki/Usage#Configuration) object mappers
  * Support for creating [custom](http://code.google.com/p/rest-assured/wiki/Usage#Custom) object mappers
  * Support for two new HTTP verbs: PATCH and OPTIONS
  * Support for Faster Jackson (Jackson 2.0)

## Non-backward compatible changes ##
  * Third party dependencies have been updated (new versions of http client needed to support the PATCH verb). If you're not using Maven you need replace the [old](http://rest-assured.googlecode.com/files/rest-assured-1.5-to-1.6.2-dependencies.zip) ones with the [new](http://rest-assured.googlecode.com/files/rest-assured-dependencies.zip) ones in the classpath.
  * The previous release broke downloading of large files (http chunking) to allow for stress testing with REST Assured. This has now been fixed but if you want to do stress testing you need to configure REST Assured to drop connections after each response using the new [connection config](http://code.google.com/p/rest-assured/wiki/Usage#Connection_Config).

## Deprecations ##
  * The enums in `com.jayway.restassured.mapper.ObjectMapper` (e.g. `ObjectMapper.GSON`) has been moved to `com.jayway.restassured.mapper.ObjectMapperType`.

## Other notable changes ##
  * Fixed so that it's possible to download large (chunked) files again. This was broken in the last release, 1.6.2. ([issue 194](https://code.google.com/p/rest-assured/issues/detail?id=194)).
  * Added a [ConnectionConfig](http://rest-assured.googlecode.com/svn/tags/1.7/apidocs/com/jayway/restassured/config/ConnectionConfig.html) object that allows you to modify if REST Assured should drop idle connections after each response. Enable connection dropping if you need to make several small and fast requests (e.g. stress testing).

## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details