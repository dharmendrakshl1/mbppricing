# Release Notes for REST Assured 1.9.0 #

## Highlights ##
  * It's now possible to configure the HTTP Client instance to be used by REST Assured when making requests. Use the HttpClientConfig and specify a http client factory if you want to do this. This makes it possible for some advanced configuration not exposed by the REST Assured API.
  * The http client instance can now be reused between REST Assured requests. By default REST Assured creates a new instance for each "given" statement. To configure reuse do the following:
```
RestAssured.config = newConfig().httpClient(httpClientConfig().reuseHttpClientInstance());
```
  * It's now possible to configure content decoders. Before GZIP and DEFLATE were always activated and there was no way to disable them. For example to remove GZIP but retain DEFLATE you can do the following:
```
given().config(newConfig().decoderConfig(decoderConfig().contentDecoders(DEFLATE))). ..
```
  * Added method `htmlPath` to REST Assured Response which allows you to easily get values from an HTML page:
```
String pageTitle = get("/index.html").htmlPath().getString("html.head.title");
```
  * URL encoding (and disabling of URL encoding) has been completely re-written and will now work better
  * It's now possible to use the Hamcrest XPath matcher with namespaces if XmlConfig in REST Assured is configured to be namespace aware, e.g.
```
 given().
          config(newConfig().xmlConfig(xmlConfig().with().namespaceAware(true))).
 expect().
          body(hasXPath("/db:package-database", namespaceContext)).
 when().
          get("/package-db-xml");
```
  * Added namespace support for body expectations if the namespace is declared correctly, for example given the following XML:
```
 <foo xmlns:ns="http://localhost/">
    <bar>sudo </bar>
    <ns:bar>make me a sandwich!</ns:bar>
 </foo>
```
> you can verify it like this:
```
given().
          config(newConfig().xmlConfig(xmlConfig().declareNamespace("ns", "http://localhost/"))).
expect().
          body("bar.text()", equalTo("sudo make me a sandwich!")).
          body(":bar.text()", equalTo("sudo ")).
          body("ns:bar.text()", equalTo("make me a sandwich!")).
when().
          get("/namespace-example");
```
  * Added support for sessions by applying the `com.jayway.restassured.filter.session.SessionFilter`, for example:
```
SessionFilter sessionFilter = new SessionFilter();

given().
          auth().form("John", "Doe").
          filter(sessionFilter).
expect().
          statusCode(200).
when().
          get("/formAuth");

given().
          filter(sessionFilter). // Reuse the same session filter instance to automatically apply the session id from the previous response
expect().
          statusCode(200).
when().
          get("/formAuth");
```
## Non-backward compatible changes ##
  * RestAssuredConfig no longer accepts a JsonPathConfig, it now uses a JsonConfig object instead.
  * Getting cookies as a Map now returns the last value returned instead of the first one if multiple cookies with the same name are sent from the server to comply with the HTTP specification

## Other notable changes ##
  * Fixed issues that made an incorrect port being used under certain conditions
  * Namespaces are now included when pretty printing or logging XML.
  * XmlPath returned from REST Assured Response now takes features, namespaces, charset etc into account.
  * Added ability to supply an XmlPathConfig instance when using the xmlPath() method from a REST Assured Response object. For example:
```
XmlPath xmlPath = get("/namespace-example").xmlPath(xmlPathConfig().with().declaredNamespace("ns", "http://localhost/"));
```
  * Added ability to supply a JsonPathConfig instance when using the jsonPath() method from a REST Assured Response object. For example:
```
JsonPath jsonPath = get("/namespace-example").jsonPath(jsonPathConfig().with().numberReturnType(BIG_DECIMAL));
```
  * Added support for body expectations without any arguments using withNoArgs() or withNoArguments, for example:
```
 expect().
         root("store.%s", withArgs("book")).
         body("category.size()", equalTo(4)).
         appendRoot("%s.%s", withArgs("author", "size()")).
         body(withNoArgs(), equalTo(4)).
 when().
         get("/jsonStore");
```

## Dependency Upgrades ##
  * Upgraded to Groovy 2.2.0
  * Upgraded to Http Client 4.2.6
  * Upgraded to Hamcrest 1.3

## Minor changes ##
  * Fixed an issue where multi-valued query parameters defined in the URL now works. For example `get("/x?y=1&y=2")`
  * Improved request logging so that query parameters are included in the complete path.
  * Request filters now expose the http client instance which makes it possible to alter some advanced settings not exposed by REST Assured.
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details