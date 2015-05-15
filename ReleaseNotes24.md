# Release Notes for REST Assured 2.4.0 #

## Highlights ##
  * Improved logging of content-type header. Before there could be situations where the logging of the content-type header didn't match what was actually sent to the server. This is now resolved.
  * Default Content-Type charset is now visible in the request log.
  * Default Content-Type charset is now appended to Content-Type header in Spring MockMvc module by default. Use
```
given().config(RestAssuredMockMvcConfig.config().encoderConfig(encoderConfig().appendDefaultContentCharsetToContentTypeIfUndefined(false))). ..
```
> to revert to previous behavior.
  * Content-Type is now correctly displayed in request log when not explicitly defined.
  * Added "accept" method to RequestSpecification to easier allow setting the Accept header. Also added setAccept to RequestSpecBuilder.
  * Configurations are now overwritten only if they've been explicitly configured when applying a specification. For example:
```
RequestSpecification spec = new RequestSpecBuilder.config(config().headerConfig().overwriteHeadersWithName("header1")).build();

given().
        config(config().sessionConfig(sessionConfig().sessionIdName("phpsessionid"))).
        spec(spec).
        ..
when().
        get(..)
```
> This will now cause the resulting config to include both the header config and session config. Before this change ONLY the header config would be applied since all configs from the specs were overwritten. This also applies to the MockMvc extension.
  * You can now send form parameters with a GET request in accordance with RFC1866 (page 46, HTML 4.x section 17.13.3). Form parameters will be added a query parameters for a GET request and Content-Type will automatically be set to "application/x-www-form-urlencoded" with the default charset.

## Other Notable Changes ##
  * Added ability to configure if headers should be merged or overwritten when multiple headers with the same name are specified by using the new com.jayway.restassured.config.HeaderConfig. By default content-type and accept headers are now overwritten instead of merged. For example to configure "header1" to be overwritten instead of merged you can do:
```
RequestSpecification spec = new RequestSpecBuilder.addHeader("header1", "value2").build();
given().
        config(RestAssuredConfig.config().headerConfig(headerConfig().overwriteHeadersWithName("header1"))).
        header("header1", "value1").
        spec(spec).
when().
        get(..)
```

> will only send one header, "header1" with value "value2".
  * Content-Type is now sent to the server if explicitly defined by a GET request ([issue 362](https://code.google.com/p/rest-assured/issues/detail?id=362)).
  * PUT now uses content-type application/x-www-form-urlencoded by default when using form parameters.
  * It's now possible to specify the SSLContext protocol when configuring "relaxedHTTPSValidation" in SSLConfig. For example `sslConfig.relaxedHTTPSValidation("TLS")`. Default is SSL just as in previous versions. ([issue 367](https://code.google.com/p/rest-assured/issues/detail?id=367)).
  * Added ability to log request method and request path. Use "given().log().method()" and "given().log().path()" ([issue 368](https://code.google.com/p/rest-assured/issues/detail?id=368)).

## Non-backward compatible changes ##
  * Setting contentType on a ResponseSpecification no longer sets the accept header automatically. Previously this led to confusion and prevented separation between the ResponseSpecification and the RequestSpecification.

## Deprecations ##
  * Deprecated RestAssured.responseContentType(..). Use `com.jayway.restassured.builder.ResponseSpecBuilder#expectContentType(com.jayway.restassured.http.ContentType)` and assign it to RestAssured.responseSpecification instead.
  * Deprecated RestAssured.requestContentType(..). Use `com.jayway.restassured.builder.RequestSpecBuilder#contentType(com.jayway.restassured.http.ContentType)` and assign it to RestAssured.requestSpecification instead.


## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details.