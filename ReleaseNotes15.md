# Release Notes for REST Assured 1.5 #

## Highlights ##
  * Fixed an issue with the PUT method duplicating form parameters as query parameters ([issue 137](https://code.google.com/p/rest-assured/issues/detail?id=137))
  * Created a [ResponseBuilder](http://rest-assured.googlecode.com/svn/tags/1.5/apidocs/com/jayway/restassured/builder/ResponseBuilder.html) to make it easier to create new Response implementations. This is useful if you're working with filters and want to change the response you get from the sever somehow. E.g.
```
Response myResponse = new ResponseBuilder().clone(originalResponse).setBody("Something").build();
```
  * Added possibility for some more detailed configuration by providing a [RestAssuredConfig](http://rest-assured.googlecode.com/svn/tags/1.5/apidocs/com/jayway/restassured/config/RestAssuredConfig.html) instance. Right now you can configure the parameters of [HTTP Client](http://rest-assured.googlecode.com/svn/tags/1.5/apidocs/com/jayway/restassured/config/HttpClientConfig.html), [Redirect](http://rest-assured.googlecode.com/svn/tags/1.5/apidocs/com/jayway/restassured/config/RedirectConfig.html) and [Log](http://rest-assured.googlecode.com/svn/tags/1.5/apidocs/com/jayway/restassured/config/LogConfig.html) settings. Examples:
> For a specific request:
```
given().config(newConfig().redirect(redirectConfig().followRedirects(false))). ..
```
> or using a RequestSpecBuilder:
```
RequestSpecification spec = new RequestSpecBuilder().setConfig(newConfig().redirect(redirectConfig().followRedirects(false))).build();
```
> or for all requests:
```
 RestAssured.config = config().redirect(redirectConfig().followRedirects(true).and().maxRedirects(0));
```
> `config()` and `newConfig()` can be statically imported from `com.jayway.restassured.config.RestAssuredConfig`.
  * Logging has been improved, see [below](http://code.google.com/p/rest-assured/wiki/ReleaseNotes15#Non-backward_compatible_changes).

## Non-backward compatible changes ##
  * Logging has undergone a major change. You can now not only log the response body but also headers, cookies and status line. You can also log the request details as defined in the [request specification](http://rest-assured.googlecode.com/svn/tags/1.5/apidocs/com/jayway/restassured/specification/RequestSpecification.html). Thus the following:
```
given().log(). .. // Log the response body in versions prior to 1.5
```
> and
```
expect().log(). .. // Also logs the response body in versions prior to 1.5
```
> will now look like this:
```
given().log().body(). .. // Log the _request_ body in versions >= 1.5
```
> and
```
expect().log().body() .. // Log the response body in versions >= 1.5
```
> You can also log e.g. only headers in the request and the response:
```
given().log().headers(). .. // Log only the request headers
```
> and
```
expect().log().headers(). .. // Log only the response headers
```
> Previously there was a method called `logOnError` in both the [request-](http://rest-assured.googlecode.com/svn/tags/1.5/apidocs/com/jayway/restassured/specification/RequestSpecification.html) and [response specification](http://rest-assured.googlecode.com/svn/tags/1.5/apidocs/com/jayway/restassured/specification/ResponseSpecification.html). This has now been replaced by the following method in the response specification:
```
expect().log().ifError(). ..
```
> ([issue 81](https://code.google.com/p/rest-assured/issues/detail?id=81)).
  * `getRequestParams()` and `getQueryParams()` now returns `Map<String, ?>` instead of `Map<String, String>` in [FilterableRequestSpecification](http://rest-assured.googlecode.com/svn/tags/1.5/apidocs/com/jayway/restassured/specification/FilterableRequestSpecification.html).

## Other notable changes ##
  * Allows configuring redirect settings using the DSL ([issue 24](https://code.google.com/p/rest-assured/issues/detail?id=24)), e.g.
```
given().redirects().max(12).and().redirects().follow(true).when(). .. 
```

## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details