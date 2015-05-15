![http://rest-assured.googlecode.com/svn/trunk/rest-assured-logo-green.png](http://rest-assured.googlecode.com/svn/trunk/rest-assured-logo-green.png)

Testing and validating REST services in Java is harder than in dynamic languages such as Ruby and Groovy. REST Assured brings the simplicity of using these languages into the Java domain.

## News ##
  * 2015-04-12: REST Assured [2.4.1](http://dl.bintray.com/johanhaleby/generic/rest-assured-2.4.1-dist.zip) is released with bug fixes and improvements. See [change log](https://raw.githubusercontent.com/jayway/rest-assured/master/changelog.txt) for details.
  * 2015-01-27: Jakub Czeczotka has written a nice blog post on how to use REST Assured MockMvc, you can read it [here](http://blog.czeczotka.com/2015/01/20/spring-mvc-integration-test-with-rest-assured-and-mockmvc/).
  * 2014-11-15: REST Assured [2.4.0](http://dl.bintray.com/johanhaleby/generic/rest-assured-2.4.0-dist.zip) is released with support for better configuration merging, improved logging, improved [relaxedHTTPSValidation](Usage#SSL.md) as well as other bug fixes and improvements. See [release notes](ReleaseNotes24.md) for more info on what has changed in this release.

[older news](OldNews.md)


## Examples ##
Here's an example of how to make a GET request and validate the JSON or XML response:
```
get("/lotto").then().assertThat().body("lotto.lottoId", equalTo(5));
```

Get and verify all winner ids:
```
get("/lotto").then().assertThat().body("lotto.winners.winnerId", hasItems(23, 54));
```

Using parameters:
```
given().
        param("key1", "value1").
        param("key2", "value2").
when().
        post("/somewhere").
then().
        body(containsString("OK"));
```

Using X-Path (XML only):
```
given().
        parameters("firstName", "John", "lastName", "Doe").
when().
        post("/greetMe").
then().
        body(hasXPath("/greeting/firstName[text()='John']")).
```

Need authentication? REST Assured provides several authentication mechanisms:
```
given().auth().basic(username, password).when().get("/secured").then().statusCode(200);
```

Getting and parsing a response body:
```
// Example with JsonPath
String json = get("/lotto").asString()
List<String> winnderIds = from(json).get("lotto.winners.winnerId");

// Example with XmlPath
String xml = post("/shopping").andReturn().body().asString()
Node category = from(xml).get("shopping.category[0]");
```


REST Assured supports the POST, GET, PUT, DELETE, OPTIONS, PATCH and HEAD http methods and includes specifying and validating e.g. parameters, headers, cookies and body easily.


## Documentation ##
  * [Getting started](GettingStarted.md)
  * [Usage Guide](Usage.md) (click [here](Usage_Legacy.md) for legacy documentation (prior to v2.0))
  * [Rest Assured Javadoc](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/RestAssured.html)
  * [Rest Assured Mock Mvc Javadoc](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/mockmvc/RestAssuredMockMvc.html)
  * [XmlPath Javadoc](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/path/xml/XmlPath.html)
  * [JsonPath Javadoc](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/path/json/JsonPath.html)
  * [FAQ](FAQ.md)
  * [Try the latest snapshot release](snapshot.md)

## Support and discussion ##
Join the mailing list at our [Google group](http://groups.google.com/group/rest-assured).
<br>

<hr />
<h2>Founded by:</h2>
<a href='http://www.jayway.com'><img src='http://www.arctiquator.com/oppenkallkod/assets/images/jayway_logo.png' /></a>

<h2>Other open source projects:</h2>
<a href='http://www.powermock.org'>
<img src='http://powermock.googlecode.com/svn/trunk/src/site/resources/images/logos/powermock.png' width='219' height='100' /></a>
<a href='http://code.google.com/p/awaitility'>
<img src='http://github.com/jayway/awaitility/raw/master/resources/Awaitility_logo_red_small.png' width='237' height='80' />
</a>