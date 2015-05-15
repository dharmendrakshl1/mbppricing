# Usage Guide #

Note that if you're using version 1.9.0 or earlier please refer to the [legacy](Usage_Legacy.md) documentation.

REST Assured is a Java DSL for simplifying testing of REST based services built on top of HTTP Builder. It supports POST, GET, PUT, DELETE, OPTIONS, PATCH and HEAD requests and can be used to validate and verify the response of these requests.

**Table of Contents**


## Static imports ##

In order to use REST assured effectively it's recommended to statically import methods from the following classes:

  * `com.jayway.restassured.RestAssured.*`
  * `com.jayway.restassured.matcher.RestAssuredMatchers.*`
  * `org.hamcrest.Matchers.*`

If you want to use [Json Schema](http://json-schema.org/) validation you should also statically import these methods:
  * `com.jayway.restassured.module.jsv.JsonSchemaValidator.*`
Refer to [Json Schema Validation](#JSON_Schema_validation.md) section for more info.

If you're using Spring MVC you can use the [spring-mock-mvc](Usage#Spring_Mock_Mvc_Module.md) module to unit test your Spring Controllers using the Rest Assured DSL. To do this statically import the methods from [RestAssuredMockMvc](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/mockmvc/RestAssuredMockMvc.html) _instead_ of importing the methods from `com.jayway.restassured.RestAssured`:
  * `com.jayway.restassured.module.mockmvc.RestAssuredMockMvc.*`

## Example 1 - JSON ##
Assume that the GET request (to http://localhost:8080/lotto) returns JSON as:
```
{
"lotto":{
 "lottoId":5,
 "winning-numbers":[2,45,34,23,7,5,3],
 "winners":[{
   "winnerId":23,
   "numbers":[2,45,34,23,3,5]
 },{
   "winnerId":54,
   "numbers":[52,3,12,11,18,22]
 }]
}
}
```
REST assured can then help you to easily make the GET request and verify the response. E.g. if you want to verify that lottoId is equal to 5 you can do like this:
```
get("/lotto").then().body("lotto.lottoId", equalTo(5));
```
or perhaps you want to check that the winnerId's are 23 and 54:
```
get("/lotto").then().body("lotto.winners.winnerId", hasItems(23, 54));
```

Note: `equalTo` and `hasItems` are Hamcrest matchers which you should statically import from `org.hamcrest.Matchers`.

Note that the "json path" syntax uses <a href='http://groovy.codehaus.org/GPath'>Groovy's GPath</a> notation and is not to be confused with Jayway's other <a href='https://github.com/jayway/JsonPath'>JsonPath</a> syntax.

### Returning floats and doubles as BigDecimal ###

You can configure Rest Assured and JsonPath to return BigDecimal's instead of float and double for Json Numbers. For example consider the following JSON document:

```
{

    "price":12.12 

}
```

By default  you validate that price is equal to 12.12 as a float like this:
```
get("/price").then().body("price", is(12.12f));
```

but if you like you can configure REST Assured to use a JsonConfig that returns all Json numbers as BigDecimal:

```
given().
        config(newConfig().jsonConfig(jsonConfig().numberReturnType(BIG_DECIMAL))).
when().
        get("/price").
then().
        body("price", is(new BigDecimal(12.12));
```

### JSON Schema validation ###

From version `2.1.0` REST Assured has support for [Json Schema](http://json-schema.org/) validation. For example given the following schema located in the classpath as `products-schema.json`:
```
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Product set",
    "type": "array",
    "items": {
        "title": "Product",
        "type": "object",
        "properties": {
            "id": {
                "description": "The unique identifier for a product",
                "type": "number"
            },
            "name": {
                "type": "string"
            },
            "price": {
                "type": "number",
                "minimum": 0,
                "exclusiveMinimum": true
            },
            "tags": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "minItems": 1,
                "uniqueItems": true
            },
            "dimensions": {
                "type": "object",
                "properties": {
                    "length": {"type": "number"},
                    "width": {"type": "number"},
                    "height": {"type": "number"}
                },
                "required": ["length", "width", "height"]
            },
            "warehouseLocation": {
                "description": "Coordinates of the warehouse with the product",
                "$ref": "http://json-schema.org/geo"
            }
        },
        "required": ["id", "name", "price"]
    }
}
```
you can validate that a resource (`/products`) conforms with the schema:
```
get("/products").then().assertThat().body(matchesJsonSchemaInClasspath("products-schema.json"));
```
`matchesJsonSchemaInClasspath` is statically imported from `com.jayway.restassured.module.jsv.JsonSchemaValidator` and it's recommended to statically import all methods from this class. However in order to use it you need to depend on the `json-schema-validator` module by either [downloading](https://rest-assured.googlecode.com/files/json-schema-validator-2.4.1-dist.zip) it from the download page or add the following dependency from Maven:
```
<dependency>
    <groupId>com.jayway.restassured</groupId>
    <artifactId>json-schema-validator</artifactId>
    <version>2.4.1</version>
</dependency>
```

### JSON Schema Validation Settings ###

REST Assured's `json-schema-validator` module uses Francis Galiegue's [json-schema-validator](https://github.com/fge/json-schema-validator) (`fge`) library to perform validation. If you need to configure the underlying `fge` library you can for example do like this:

```
// Given
JsonSchemaFactory jsonSchemaFactory = JsonSchemaFactory.newBuilder().setValidationConfiguration(ValidationConfiguration.newBuilder().setDefaultVersion(DRAFTV4).freeze()).freeze();

// When
get("/products").then().assertThat().body(matchesJsonSchemaInClasspath("products-schema.json").using(jsonSchemaFactory));
```

The `using` method allows you to pass in a `jsonSchemaFactory` instance that REST Assured will use during validation. This allows fine-grained configuration for the validation.

The `fge` library also allows the validation to be `checked` or `unchecked`. By default REST Assured uses `checked` validation but if you want to change this you can supply an instance of [JsonSchemaValidatorSettings](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/jsv/JsonSchemaValidatorSettings.html) to the matcher. For example:

```
get("/products").then().assertThat().body(matchesJsonSchemaInClasspath("products-schema.json").using(settings().with().checkedValidation(false)));
```

Where the `settings` method is statically imported from the [JsonSchemaValidatorSettings](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/jsv/JsonSchemaValidatorSettings.html) class.

### Json Schema Validation with static configuration ###

Now imagine that you always want to use `unchecked` validation as well as setting the default json schema version to version 3. Instead of supplying this to all matchers throughout your code you can define it statically. For example:

```
JsonSchemaValidator.settings = settings().with().jsonSchemaFactory(
        JsonSchemaFactory.newBuilder().setValidationConfiguration(ValidationConfiguration.newBuilder().setDefaultVersion(DRAFTV3).freeze()).freeze()).
        and().with().checkedValidation(false);

get("/products").then().assertThat().body(matchesJsonSchemaInClasspath("products-schema.json"));
```

Now any `matcher` method imported from [JsonSchemaValidator](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/jsv/JsonSchemaValidator.html) will use `DRAFTV3` as default version and unchecked validation.

To reset the `JsonSchemaValidator` to its default settings simply call the `reset` method:

```
JsonSchemaValidator.reset();
```

### Json Schema Validation without REST Assured ###
You can also use the `json-schema-validator` module without depending on REST Assured. As long as you have a JSON document represented as a `String` you can do like this:

```
import org.junit.Test;
import static com.jayway.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.MatcherAssert.assertThat;
 
public class JsonSchemaValidatorWithoutRestAssuredTest {
 
 
    @Test public void
    validates_schema_in_classpath() {
        // Given
        String json = ... // Greeting response
 
        // Then
        assertThat(json, matchesJsonSchemaInClasspath("greeting-schema.json"));
    }
}
```

Refer to the [getting started](https://code.google.com/p/rest-assured/wiki/GettingStarted#JSON_Schema_Validation) page for more info on this.

### Anonymous JSON root validation ###

A JSON document doesn't necessarily need a named root attribute. This is for example valid JSON:

```
[1, 2, 3]
```

An anonymous JSON root can be verified by using `$` or an empty string as path. For example let's say that this JSON document is exposed from `http://localhost:8080/json` then we can validate it like this with REST Assured:

```
when().
     get("/json").
then().
     body("$", hasItems(1, 2, 3)); // An empty string "" would work as well
```

## Example 2 - XML ##
XML can be verified in a similar way. Imagine that a POST request to `http://localhost:8080/greetXML` returns:
```
<greeting>
   <firstName>{params("firstName")}</firstName>
   <lastName>{params("lastName")}</lastName>
</greeting>
```
i.e. it sends back a greeting based on the firstName and lastName parameter sent in the request. You can easily perform and verify e.g. the firstName with REST assured:
```
given().
         parameters("firstName", "John", "lastName", "Doe").
when().
         post("/greetXML").
then().
         body("greeting.firstName", equalTo("John")).
```
If you want to verify both firstName and lastName you may do like this:
```
given().
         parameters("firstName", "John", "lastName", "Doe").
when().
         post("/greetXML").
then().
         body("greeting.firstName", equalTo("John")).
         body("greeting.lastName", equalTo("Doe"));
```
or a little shorter:
```
with().parameters("firstName", "John", "lastName", "Doe").when().post("/greetXML").then().body("greeting.firstName", equalTo("John"), "greeting.lastName", equalTo("Doe"));
```

See [this](http://groovy-lang.org/processing-xml.html#_gpath) link for more info about the syntax (it follows Groovy's [GPath](http://groovy.codehaus.org/GPath) syntax).

### XML namespaces ###
To make body expectations take namespaces into account you need to declare the namespaces using the [com.jayway.restassured.config.XmlConfig](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/XmlConfig.html). For example let's say that a resource called `namespace-example` located at `http://localhost:8080` returns the following XML:
```
<foo xmlns:ns="http://localhost/">
  <bar>sudo </bar>
  <ns:bar>make me a sandwich!</ns:bar>
</foo>
```

You can then declare the `http://localhost/` uri and validate the response:
```
given().
        config(newConfig().xmlConfig(xmlConfig().declareNamespace("test", "http://localhost/"))).
when().
         get("/namespace-example").
then().
         body("bar.text()", equalTo("sudo make me a sandwich!")).
         body(":bar.text()", equalTo("sudo ")).
         body("test:bar.text()", equalTo("make me a sandwich!"));
```

The syntax follows Groovy's XmlSlurper syntax.

### XPath ###

You can also verify XML responses using x-path. For example:

```
given().parameters("firstName", "John", "lastName", "Doe").when().post("/greetXML").then().body(hasXPath("/greeting/firstName", containsString("Jo")));
```

or

```
given().parameters("firstName", "John", "lastName", "Doe").post("/greetXML").then().body(hasXPath("/greeting/firstName[text()='John']"));
```

To use namespaces in the XPath expression you need to enable them in the configuration, for example:
```
given().
        config(newConfig().xmlConfig(xmlConfig().with().namespaceAware(true))).
when().
         get("/package-db-xml").
then().
         body(hasXPath("/db:package-database", namespaceContext));
```

Where `namespaceContext` is an instance of [javax.xml.namespace.NamespaceContext](http://docs.oracle.com/javase/7/docs/api/javax/xml/namespace/NamespaceContext.html).

### Schema and DTD validation ###

XML response bodies can also be verified against an XML Schema (XSD) or DTD.
<p>
<b>XSD example:</b>
<pre><code>get("/carRecords").then().assertThat().body(matchesXsd(xsd));<br>
</code></pre>
<b>DTD example:</b>
<pre><code>get("/videos").then().assertThat().body(matchesDtd(dtd));<br>
</code></pre>

The <code>matchesXsd</code> and <code>matchesDtd</code> methods are Hamcrest matchers which you can import from <a href='http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/matcher/RestAssuredMatchers.html'>com.jayway.restassured.matcher.RestAssuredMatchers</a>.<br>
</p>

## Example 3 - Complex parsing and validation ##
This is where REST Assured really starts to shine! Refer to the blog post at the [Jayway team blog](http://blog.jayway.com/2011/10/09/simple-parsing-of-complex-json-and-xml-documents-in-java/) for examples and more info. Highly recommended reading!

## Additional Examples ##
Micha Kops has written a really good blog with several examples (including code examples that you can checkout). You can read it [here](http://www.hascode.com/2011/10/testing-restful-web-services-made-easy-using-the-rest-assured-framework/).

## Note on floats and doubles ##
Floating point numbers must be compared with a Java "float" primitive. For example, if we consider the following JSON object:

```
{

    "price":12.12 

}
```
the following test will fail, because we compare with a "double" instead of a "float":

```
get("/price").then().assertThat().body("price", equalTo(12.12));
```

Instead, compare with a float with:

```
get("/price").then().assertThat().body("price", equalTo(12.12f));
```

## Note on syntax ##
When reading blogs about REST Assured you may see a lot of examples using the "given / expect / when" syntax, for example:
```
given().
        param("x", "y").
expect().
        body("lotto.lottoId", equalTo(5)).
when().
        get("/lotto");
```

This is the so called "legacy syntax" which was the de facto way of writing tests in REST Assured 1.x. While this works fine it turned out to be quite confusing and annoying for many users. The reason for not using "given / when / then" in the first place was mainly technical. So prior to REST Assured 2.0 there was no support "given / when / then" which is more or less the standard approach when you're doing some kind of BDD-like testing. The "given / expect / then" approach still works fine in 2.0 but "given / when / then" reads better and is easier to understand for most people and is thus recommended in most cases. There's however one benefit of using the "given / expect / then" approach and that is that ALL expectation errors can be displayed at the same time which is not possible with the new syntax (since the expectations are defined last). This means that if you would have had multiple expectations in the previous example such as

```
given().
        param("x", "y").
expect().
        statusCode(400).
        body("lotto.lottoId", equalTo(6)).
when().
        get("/lotto");
```

REST Assured will report that both the status code expectation and the body expectation are wrong. Rewriting this with the new syntax

```
given().
        param("x", "y").
when().
        get("/lotto").
then().
        statusCode(400).
        body("lotto.lottoId", equalTo(6));
```

will only report an error at the first failed expectation / assertion (that status code was expected to be 400 but it was actually 200). You would have to re-run the test in order to catch the second error.

### Syntactic Sugar ###
Another thing worth mentioning is that REST Assured contains some methods that are only there for syntactic sugar. For example the "and" method which can add readability if you're writing everything in a one-liner, for example:

```
given().param("x", "y").and().header("z", "w").when().get("/something").then().assertThat().statusCode(200).and().body("x.y", equalTo("z"));
```

This is the same thing as:

```
given().
        param("x", "y").
        header("z", "w").
when().
        get("/something").
then().
        statusCode(200).
        body("x.y", equalTo("z"));
```

# Getting Response Data #
You can also get the content of a response. E.g. let's say you want to return the body of a get request to "/lotto". You can get it a variety of different ways:
```
InputStream stream = get("/lotto").asInputStream(); // Don't forget to close this one when you're done
byte[] byteArray = get("/lotto").asByteArray();
String json = get("/lotto").asString();
```

## Extracting values from the Response after validation ##
You can extract values from the response or return the response instance itself after you've done validating the response by using the `extract` method. This is useful for example if you want to use values from the response in sequent requests. For example given that a resource called `title` returns the following JSON
```
 {
     "title" : "My Title",
      "_links": {
              "self": { "href": "/title" },
              "next": { "href": "/title?page=2" }
           }
 }
```
and you want to validate that content type is equal to `JSON` and the title is equal to `My Title`
but you also want to extract the link to the `next` title to use that in a subsequent request. This is how:

```
String nextTitleLink =
given().
        param("param_name", "param_value").
when().
        get("/title").
then().
        contentType(JSON).
        body("title", equalTo("My Title")).
extract().
        path("_links.next.href");

get(nextTitleLink). ..
```

You could also decide to instead return the entire response if you need to extract multiple valus from the response:
```
Response response = 
given().
        param("param_name", "param_value").
when().
        get("/title").
then().
        contentType(JSON).
        body("title", equalTo("My Title")).
extract().
        response(); 

String nextTitleLink = response.path("_links.next.href");
String headerValue = response.header("headerName");
```

## JSON (using `JsonPath`) ##
Once we have the response body we can then use the [JsonPath](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/path/json/JsonPath.html) to get data from the response body:

```
int lottoId = from(json).getInt("lotto.lottoId");
List<Integer> winnerIds = from(json).get("lotto.winners.winnerId");
```

Or a bit more efficiently:
```
JsonPath jsonPath = new JsonPath(json).setRoot("lotto");
int lottoId = jsonPath.getInt("lottoId");
List<Integer> winnerIds = jsonPath.get("winners.winnderId");
```

Note that you can use `JsonPath` standalone without depending on REST Assured, see [getting started guide](GettingStarted.md) for more info on this.

### `JsonPath` Configuration ###
You can configure object de-serializers etc for JsonPath by configuring it, for example:
```
JsonPath jsonPath = new JsonPath(SOME_JSON).using(new JsonPathConfig("UTF-8"));
```

It's also possible to configure JsonPath statically so that all instances of JsonPath will shared the same configuration:

```
JsonPath.config = new JsonPathConfig("UTF-8");
```

You can read more about JsonPath at [this blog](http://www.jayway.com/2013/04/12/whats-new-in-rest-assured-1-8/).

Note that the JsonPath implementation uses <a href='http://groovy.codehaus.org/GPath'>Groovy's GPath</a> syntax and is not to be confused with Jayway's other <a href='https://github.com/jayway/JsonPath'>JsonPath</a> implementation.

## XML (using `XmlPath`) ##
You also have the corresponding functionality for XML using  [XmlPath](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/path/xml/XmlPath.html):
```
String xml = post("/greetXML?firstName=John&lastName=Doe").andReturn().asString();
// Now use XmlPath to get the first and last name
String firstName = from(xml).get("greeting.firstName");
String lastName = from(xml).get("greeting.firstName");

// or a bit more efficiently:
XmlPath xmlPath = new XmlPath(xml).setRoot("greeting");
String firstName = xmlPath.get("firstName");
String lastName = xmlPath.get("lastName");
```

Note that you can use `XmlPath` standalone without depending on REST Assured, see [getting started guide](GettingStarted.md) for more info on this.

### `XmlPath` Configuration ###
You can configure object de-serializers and charset for XmlPath by configuring it, for example:
```
XmlPath xmlPath = new XmlPath(SOME_XML).using(new XmlPathConfig("UTF-8"));
```

It's also possible to configure XmlPath statically so that all instances of XmlPath will shared the same configuration:

```
XmlPath.config = new XmlPathConfig("UTF-8");
```

You can read more about XmlPath at [this blog](http://www.jayway.com/2013/04/12/whats-new-in-rest-assured-1-8/).

## Single path ##
If you only want to make a request and return a single path you can use a shortcut:
```
int lottoId = get("/lotto").path("lotto.lottoid");
```

REST Assured will automatically determine whether to use JsonPath or XmlPath based on the content-type of the response. If no content-type is defined then REST Assured will try to look at the [default parser](http://code.google.com/p/rest-assured/wiki/Usage#Default_parser) if defined. You can also manually decide which path instance to use, e.g.

```
String firstName = post("/greetXML?firstName=John&lastName=Doe").andReturn().xmlPath().getString("firstName");
```

Options are `xmlPath`, `jsonPath` and `htmlPath`.

## Headers, cookies, status etc ##

You can also get headers, cookies, status line and status code:
```
Response response = get("/lotto");

// Get all headers
Headers allHeaders = response.getHeaders();
// Get a single header value:
String headerName = response.getHeader("headerName");

// Get all cookies as simple name-value pairs
Map<String, String> allCookies = response.getCookies();
// Get a single cookie value:
String cookieValue = response.getCookie("cookieName");

// Get status line
String statusLine = response.getStatusLine();
// Get status code
int statusCode = response.getStatusCode();
```

## Multi-value headers and cookies ##
A header and a cookie can contain several values for the same name.

### Multi-value headers ###
To get all values for a header you need to first get the [Headers](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Headers.html) object from the [Response](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Response.html) object. From the `Headers` instance you can get all values using the [Headers.getValues(<header name>)](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Headers.html#getValues(java.lang.String)) method which returns a `List` with all header values.

### Multi-value cookies ###
To get all values for a cookie you need to first get the [Cookies](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Cookies.html) object from the [Response](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Response.html) object. From the `Cookies` instance you can get all values using the [Cookies.getValues(<cookie name>)](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Cookies.html#getValues(java.lang.String)) method which returns a `List` with all cookie values.

## Detailed Cookies ##
If you need to get e.g. the comment, path or expiry date etc from a cookie you need get a [detailed cookie](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Cookie.html) from REST Assured. To do this you can use the [Response.getDetailedCookie(java.lang.String)](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Response.html#getDetailedCookie(java.lang.String)) method. The detailed cookie then contains all attributes from the cookie.

You can also get all detailed response [cookies](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Cookies.html) using the [Response.getDetailedCookies()](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Response.html#getDetailedCookies()) method.

# Specifying Request Data #

Besides specifying request parameters you can also specify headers, cookies, body and content type.

## Parameters ##
Normally you specify parameters like this:

```
given().
       param("param1", "value1").
       param("param2", "value2").
when().
       get("/something");
```

REST Assured will automatically try to determine which parameter type (i.e. query or form parameter) based on the HTTP method. In case of GET query parameters will automatically be used and in case of POST form parameters will be used. In some cases it's however important to separate between form and query parameters in a PUT or POST. You can then do like this:

```
given().
       formParam("formParamName", "value1").
       queryParam("queryParamName", "value2").
when().
       post("/something");
```

Parameters can also be set directly on the url:
```
..when().get("/name?firstName=John&lastName=Doe");
```

For multi-part parameters please refer to the [Multi-part form data](http://code.google.com/p/rest-assured/wiki/Usage#Multi-part_form_data) section.

### Multi-value parameter ###
Multi-value parameters are parameters with more then one value per parameter name (i.e. a list of values per name). You can specify these either by using var-args:

```
given().param("myList", "value1", "value2"). .. 
```

or using a list:

```
List<String> values = new ArrayList<String>();
values.add("value1");
values.add("value2");

given().param("myList", values). .. 
```

### No-value parameter ###
You can also specify a query, request or form parameter without a value at all:
```
given().param("paramName"). ..
```

### Path parameters ###
You can also specify so called path parameters in your request, e.g.
```
post("/reserve/{hotelId}/{roomNumber}", "My Hotel", 23);
```

You can also use named path parameters:
```
given().
        pathParam("hotelId", "My Hotel").
        pathParam("roomNumber", 23).
when(). 
        post("/reserve/{hotelId}/{roomNumber}").
then().
         ..
```

Path parameters makes it easier to read the request path as well as enabling the request path to easily be re-usable in many tests with different parameter values.

## Cookies ##
In its simplest form you specify cookies like this:
```
given().cookie("username", "John").when().get("/cookie").then().body(equalTo("username"));
```

You can also specify a multi-value cookie like this:
```
given().cookie("cookieName", "value1", "value2"). ..
```
This will create _two_ cookies, `cookieName=value1` and `cookieName=value2`.

You can also specify a detailed cookie using:
```
Cookie someCookie = new Cookie.Builder("some_cookie", "some_value").setSecured(true).setComment("some comment").build();
given().cookie(someCookie).when().get("/cookie").then().assertThat().body(equalTo("x"));
```

or several detailed cookies at the same time:
```
Cookie cookie1 = Cookie.Builder("username", "John").setComment("comment 1").build();
Cookie cookie2 = Cookie.Builder("token", 1234).setComment("comment 2").build();
Cookies cookies = new Cookies(cookie1, cookie2);
given().cookies(cookies).when().get("/cookie").then().body(equalTo("username, token"));
```

## Headers ##
```
given().header("MyHeader", "Something").and(). ..
given().headers("MyHeader", "Something", "MyOtherHeader", "SomethingElse").and(). ..
```

You can also specify a multi-value headers like this:
```
given().header("headerName", "value1", "value2"). ..
```
This will create _two_ headers, `headerName=value1` and `headerName=value2`.

## Content Type ##
```
given().contentType(ContentType.TEXT). ..
given().contentType("application/json"). ..
```


## Request Body ##
```
given().body("some body"). .. // Works for POST, PUT and DELETE requests
given().request().body("some body"). .. // More explicit (optional)
```
```
given().body(new byte[]{42}). .. // Works for POST, PUT and DELETE
given().request().body(new byte[]{42}). .. // More explicit (optional)
```

You can also serialize a Java object to JSON or XML. Click [here](http://code.google.com/p/rest-assured/wiki/Usage#Serialization) for details.

# Verifying Response Data #
You can also verify status code, status line, cookies, headers, content type and body.
## Response Body ##
See Usage examples, e.g. [JSON](http://code.google.com/p/rest-assured/wiki/Usage?ts=1317978378&updated=Usage#Example_1_-_JSON) or [XML](http://code.google.com/p/rest-assured/wiki/Usage#Example_2_-_XML).

You can also map a response body to a Java Object, click [here](http://code.google.com/p/rest-assured/wiki/Usage#Deserialization) for details.

## Cookies ##
```
get("/x").then().assertThat().cookie("cookieName", "cookieValue"). ..
get("/x").then().assertThat().cookies("cookieName1", "cookieValue1", "cookieName2", "cookieValue2"). ..
get("/x").then().assertThat().cookies("cookieName1", "cookieValue1", "cookieName2", containsString("Value2")). ..
```

## Status ##
```
get("/x").then().assertThat().statusCode(200). ..
get("/x").then().assertThat().statusLine("something"). ..
get("/x").then().assertThat().statusLine(containsString("some")). ..
```


## Headers ##

```
get("/x").then().assertThat().header("headerName", "headerValue"). ..
get("/x").then().assertThat().headers("headerName1", "headerValue1", "headerName2", "headerValue2"). ..
get("/x").then().assertThat().headers("headerName1", "headerValue1", "headerName2", containsString("Value2")). ..
```


## Content-Type ##
```
get("/x").then().assertThat().contentType(ContentType.JSON). ..
```


## Full body/content matching ##

```
get("/x").then().assertThat().body(equalTo("something")). ..
get("/x").then().assertThat().content(equalTo("something")). .. // Same as above
```

## Use the response to verify other parts of the response ##
You can use data from the response to verify another part of the response. For example consider the following JSON document returned from service x:
```
{ "userId" : "some-id", "href" : "http://localhost:8080/some-id" }
```
You may notice that the "href" attribute ends with the value of the "userId" attribute. If we want to verify this we can implement a `com.jayway.restassured.matcher.ResponseAwareMatcher` and use it like this:
```
get("/x").then().body("href", new ResponseAwareMatcher<Response>() {
                                  public Matcher<?> matcher(Response response) {
                                          return equalTo("http://localhost:8080/" + response.path("userId"));
                                  }
                       });
```
There are some predefined matchers that you can use defined in the `com.jayway.restassured.matcher.RestAssuredMatchers` (or `com.jayway.restassured.module.mockmvc.matcher.RestAssuredMockMvcMatchers` if using the spring-mock-mvc module). For example:
```
get("/x").then().body("href", endsWithPath("userId"));
```
`ResponseAwareMatchers` can also be composed, either with another `ResponseAwareMatcher` or with a Hamcrest Matcher. For example:
```
get("/x").then().body("href", endsWithPath("userId").and(startsWith("http:/localhost:8080/")));
```

# Authentication #
REST assured also supports some authentication schemes, for example basic authentication:

```
given().auth().basic("username", "password").when().get("/secured/hello").then().statusCode(200);
```


Other supported schemes are OAuth, digest, certificate, form and preemptive basic authentication.

## OAuth ##

In order to use OAuth 1 or 2 authentication you need to add [Scribe](https://github.com/fernandezpablo85/scribe-java) to your classpath (if you're using version 2.1.0 or older of REST Assured then please refer to the [legacy](Usage_Legacy#OAuth.md) documentation). In Maven you can simply add the following dependency:
```
<dependency>
            <groupId>org.scribe</groupId>
            <artifactId>scribe</artifactId>
            <version>1.3.5</version>
            <scope>test</scope>
</dependency>
```

If you're not using Maven [download](https://github.com/fernandezpablo85/scribe-java/releases) a Scribe release manually and put it in your classpath.

To use auth 1 authentication you can do:
```
given().auth().oauth(..);
```

And for oauth2:
```
given().auth().oauth2(..);
```

# Multi-part form data #
When sending larger amount of data to the server it's common to use the multipart form data technique. Rest Assured provide methods called `multiPart` that allows you to specify a file, byte-array, input stream or text to upload. In its simplest form you can upload a file like this:

```
given().
        multiPart(new File("/path/to/file")).
when().
        post("/upload");
```

It will assume a control name called "file". In HTML the control name is the attribute name of the input tag. To clarify let's look at the following HTML form:

```
<form id="uploadForm" action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" size="40">
        <input type=submit value="Upload!">
</form>
```

The control name in this case is the name of the input tag with name "file". If you have a different control name then you need to specify it:

```
given().
        multiPart("controlName", new File("/path/to/file")).
when().
        post("/upload");
```

It's also possible to supply multiple "multi-parts" entities in the same request:

```
byte[] someData = ..
given().
        multiPart("controlName1", new File("/path/to/file")).
        multiPart("controlName2", "my_file_name.txt", someData).
        multiPart("controlName3", someJavaObject, "application/json").
when().
        post("/upload");
```

For additional info refer to [this](http://blog.jayway.com/2011/09/15/multipart-form-data-file-uploading-made-simple-with-rest-assured/) blog post.

# Object Mapping #
REST Assured supports mapping Java objects to and from JSON and XML. For JSON you need to have either Jackson or Gson in the classpath and for XML you need JAXB.

## Serialization ##
Let's say we have the following Java object:

```
public class Message {
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```

and you want to serialize this object to JSON and send it with the request. There are several ways to do this, e.g:

### Content-Type based Serialization ###

```
Message message = new Message();
message.setMessage("My messagee");
given().
       contentType("application/json").
       body(message).
when().
      post("/message");
```

In this example REST Assured will serialize the object to JSON since the request content-type is set to "application/json". It will first try to use Jackson if found in classpath and if not Gson will be used. If you change the content-type to "application/xml" REST Assured will serialize to XML using JAXB. If no content-type is defined REST Assured will try to serialize in the following order:

  1. Json using Jackson
  1. Json using Gson
  1. XML using JAXB

REST Assured also respects the charset of the content-type. E.g.

```
Message message = new Message();
message.setMessage("My messagee");
given().
       contentType("application/json; charset=UTF-16").
       body(message).
when().
      post("/message");
```

You can also serialize the `Message` instance as a form parameter:
```
Message message = new Message();
message.setMessage("My messagee");
given().
       contentType("application/json; charset=UTF-16").
       formParam("param1", message).
when().
      post("/message");
```


The message object will be serialized to JSON using Jackson (if present) or Gson (if present) with UTF-16 encoding.

### Create JSON from a HashMap ###

You can also create a JSON document by supplying a Map to REST Assured.
```
Map<String, Object>  jsonAsMap = new HashMap<>();
map.put("firstName", "John");
map.put("lastName", "Doe");

given().
        contentType(JSON).
        body(jsonAsMap).
when().
        post(PARKINGS).
then().
          statusCode(200);
```

This will provide a JSON payload as:

```
{ "firstName" : "John", "lastName" : "Doe" }
```

### Using an Explicit Serializer ###
If you have multiple object mappers in the classpath at the same time or don't care about setting the content-type you can specify a serializer explicity. E.g.

```
Message message = new Message();
message.setMessage("My messagee");
given().
       body(message, ObjectMapperType.JAXB).
when().
      post("/message");
```

In this example the Message object will be serialized to XML using JAXB.

## Deserialization ##
Again let's say we have the following Java object:

```
public class Message {
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```

and we want the response body to be deserialized into a Message object.

### Content-Type based Deserialization ###
Let's assume then that the server returns a JSON body like this:
```
{"message":"My message"}
```

To deserialize this to a Message object we simply to like this:
```
Message message = get("/message").as(Message.class);
```

For this to work the response content-type must be "application/json" (or something that contains "json"). If the server instead returned

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<message>
      <message>My message</message>
</message>
```

and a content-type of "application/xml" you wouldn't have to change the code at all:
```
Message message = get("/message").as(Message.class);
```

#### Custom Content-Type Deserialization ####
If the server returns a custom content-type, let's say "application/something", and you still want to use the object mapping in REST Assured there are a couple of different ways to go about. You can either use the [explicit](http://code.google.com/p/rest-assured/wiki/Usage#Using_an_Explicit_Deserializer) approach or register a parser for the custom content-type:

```
Message message = expect().parser("application/something", Parser.XML).when().get("/message").as(Message.class);
```

or

```
Message message = expect().defaultParser(Parser.XML).when().get("/message").as(Message.class);
```

You can also register a default or custom parser [statically](http://code.google.com/p/rest-assured/wiki/Usage#Default_values) or using [specifications](http://code.google.com/p/rest-assured/wiki/Usage#Specification_Re-use).

### Using an Explicit Deserializer ###
If you have multiple object mappers in the classpath at the same time  or don't care about the response content-type you can specify a deserializer explicitly. E.g.

```
Message message = get("/message").as(Message.class, ObjectMapperType.GSON);
```

## Configuration ##
You can configure the pre-defined object mappers by using a [ObjectMapperConfig](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/ObjectMapperConfig.html) and pass it to [detailed configuration](https://code.google.com/p/rest-assured/wiki/Usage#Detailed_configuration). For example to change GSON to use lower case with underscores as field naming policy you can do like this:

```
RestAssured.config = RestAssuredConfig.config().objectMapperConfig(objectMapperConfig().gsonObjectMapperFactory(
                new GsonObjectMapperFactory() {
                    public Gson create(Class cls, String charset) {
                        return new GsonBuilder().setFieldNamingPolicy(LOWER_CASE_WITH_UNDERSCORES).create();
                    }
                }
        ));
```

There are pre-defined object mapper factories for GSON, JAXB, Jackson and Faster Jackson.

## Custom ##
By default REST Assured will scan the classpath to find various object mappers. If you want to integrate an object mapper that is not supported by default or if you've rolled your own you can implement the
[com.jayway.restassured.mapper.ObjectMapper](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/mapper/ObjectMapper.html) interface. You tell REST Assured to use your object mapper either by passing it as a second parameter to the body:

```
given().body(myJavaObject, myObjectMapper).when().post("..")
```

or you can define it statically once and for all:
```
RestAssured.config = RestAssuredConfig.config().objectMapperConfig(new ObjectMapperConfig(myObjectMapper));
```

For an example see [here](https://github.com/jayway/rest-assured/blob/master/examples/rest-assured-itest-java/src/test/java/com/jayway/restassured/itest/java/CustomObjectMappingITest.java).

# Custom parsers #
REST Assured providers predefined parsers for e.g. HTML, XML and JSON. But you can parse other kinds of content by registering a predefined parser for unsupported content-types by using:
```
RestAssured.registerParser(<content-type>, <parser>);
```
E.g. to register that mime-type 'application/vnd.uoml+xml' should be parsed using the XML parser do:
```
RestAssured.registerParser("application/vnd.uoml+xml", Parser.XML);
```
You can also unregister a parser using:
```
RestAssured.unregisterParser("application/vnd.uoml+xml");
```

Parsers can also be specified per "request":
```
get(..).then().using().parser("application/vnd.uoml+xml", Parser.XML). ..;
```

and using a [response specification](http://code.google.com/p/rest-assured/wiki/Usage#Specification_Re-use).

# Default parser #
Sometimes it's useful to specify a default parser, e.g. if the response doesn't contain a content-type at all:

```
RestAssured.defaultParser = Parser.JSON;
```

You can also specify a default parser for a single request:
```
get("/x").then().using().defaultParser(Parser.JSON). ..
```

or using a [response specification](http://code.google.com/p/rest-assured/wiki/Usage#Specification_Re-use).

# Default values #
By default REST assured assumes host localhost and port 8080 when doing a request. If you want a different port you can do:
```
given().port(80). ..
```
or simply:
```
..when().get("http://myhost.org:80/doSomething");
```
You can also change the default base URI, base path, port and authentication scheme for all subsequent requests:
```
RestAssured.baseURI = "http://myhost.org";
RestAssured.port = 80;
RestAssured.basePath = "/resource";
RestAssured.authentication = basic("username", "password");
RestAssured.rootPath = "x.y.z";
```
This means that a request like e.g. `get("/hello")` goes to: http://myhost.org:80/resource/hello with basic authentication credentials "username" and "password". See [rootPath](http://code.google.com/p/rest-assured/wiki/Usage#Root_path) for more info about setting the root paths. Other default values you can specify are:

```
RestAssured.filters(..); // List of default filters
RestAssured.requestContentType(..); // Specify the default request content type
RestAssured.responseContentType(..); // Specify the default response content type
RestAssured.requestSpecification = .. // Default request specification
RestAssured.responseSpecification = .. // Default response specification
RestAssured.urlEncodingEnabled = .. // Specify if Rest Assured should URL encoding the parameters
RestAssured.defaultParser = .. // Specify a default parser for response bodies if no registered parser can handle data of the response content-type
RestAssured.registerParser(..) // Specify a parser for the given content-type
RestAssured.unregisterParser(..) // Unregister a parser for the given content-type

```

You can reset to the standard baseURI (localhost), basePath (empty), standard port (8080), standard root path (""), default authentication scheme (none) and url encoding enabled (true) using:
```
RestAssured.reset();
```

# Specification Re-use #
Instead of having to duplicate response expectations and/or request parameters for different tests you can re-use an entire specification. To do this you define a specification using either the [RequestSpecBuilder](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/builder/RequestSpecBuilder.html) or [ResponseSpecBuilder](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/builder/ResponseSpecBuilder.html).

E.g. let's say you want to make sure that the expected status code is 200 and that the size of the JSON array "x.y" has size 2 in several tests you can define a ResponseSpecBuilder like this:

```
ResponseSpecBuilder builder = new ResponseSpecBuilder();
builder.expectStatusCode(200);
builder.expectBody("x.y.size()", is(2));
ResponseSpecification responseSpec = builder.build();

// Now you can re-use the "responseSpec" in many different tests:
when().
       get("/something").
then().
       spec(responseSpec).
       body("x.y.z", equalTo("something"));
```

In this example the data defined in "responseSpec" is merged with the additional body expectation and all expectations must be fulfilled in order for the test to pass.

You can do the same thing if you need to re-use request data in different tests. E.g.
```
RequestSpecBuilder builder = new RequestSpecBuilder();
builder.addParameter("parameter1", "parameterValue");
builder.addHeader("header1", "headerValue");
RequestSpecification requestSpec = builder.build();
  
given().
        spec(requestSpec).
        param("parameter2", "paramValue").
when().
        get("/something").
then().
        body("x.y.z", equalTo("something"));        
```

Here the request's data is merged with the data in the "requestSpec" so the request will contain two parameters ("parameter1" and "parameter2") and one header ("header1").

# Filters #
A filter allows you to inspect and alter a request before it's actually committed and also inspect and [alter](#Response_Builder.md) the response before it's returned to the expectations. You can regard it as an "around advice" in AOP terms. Filters can be used to implement custom authentication schemes, session management, logging etc. To create a filter you need to implement the [com.jayway.restassured.filter.Filter](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/filter/Filter.html) interface. To use a filter you can do:

```
given().filter(new MyFilter()). ..
```

There are a couple of filters provided by REST Assured that are ready to use:
  1. `com.jayway.restassured.filter.log.RequestLoggingFilter`: A filter that'll print the request specification details.
  1. `com.jayway.restassured.filter.log.ResponseLoggingFilter`: A filter that'll print the response details if the response matches a given status code.
  1. `com.jayway.restassured.filter.log.ErrorLoggingFilter`: A filter that'll print the response body if an error occurred (status code is between 400 and 500).

## Response Builder ##

If you need to change the [Response](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/response/Response.html) from a filter you can use the [ResponseBuilder](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/builder/ResponseBuilder.html) to create a new Response based on the original response. For example if you want to change the body of the original response to something else you can do:
```
Response newResponse = new ResponseBuilder().clone(originalResponse).setBody("Something").build();
```

# Logging #
In many cases it can be useful to print the response and/or request details in order to help you create the correct expectations and send the correct requests. To do help you do this you can use one of the predefined [filters](#Filters.md) supplied with REST Assured or you can use one of the shortcuts.

## Request Logging ##
Since version 1.5 REST Assured supports logging the _[request specification](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/specification/RequestSpecification.html)_ before it's sent to the server using the [RequestLoggingFilter](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/filter/log/RequestLoggingFilter.html). Note that the HTTP Builder and HTTP Client may add additional headers then what's printed in the log. The filter will _only_ log details specified in the request specification. I.e. you can NOT regard the details logged by the [RequestLoggingFilter](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/filter/log/RequestLoggingFilter.html) to be what's actually sent to the server. Also subsequent filters may alter the request _after_ the logging has taken place. If you need to log what's _actually_ sent on the wire refer to the [HTTP Client logging docs](http://hc.apache.org/httpcomponents-client-ga/logging.html) or use an external tool such [Wireshark](http://www.wireshark.org/). Examples:

```
given().log().all(). .. // Log all request specification details including parameters, headers and body
given().log().params(). .. // Log only the parameters of the request
given().log().body(). .. // Log only the request body
given().log().headers(). .. // Log only the request headers
given().log().cookies(). .. // Log only the request cookies
given().log().method(). .. // Log only the request method
given().log().path(). .. // Log only the request path
```

## Response Logging ##
If you want to print the response body regardless of the status code you can do:

```
get("/x").then().log().body() ..
```

This will print the response body regardless if an error occurred. If you're only interested in printing the response body if an error occur then you can use:

```
get("/x").then().log().ifError(). .. 
```

You can also log all details in the response including status line, headers and cookies:

```
get("/x").then().log().all(). .. 
```

as well as only status line, headers or cookies:
```
get("/x").then().log().statusLine(). .. // Only log the status line
get("/x").then().log().headers(). .. // Only log the response headers
get("/x").then().log().cookies(). .. // Only log the response cookies
```

You can also configure to log the response only if the status code matches some value:
```
get("/x").then().log().ifStatusCodeIsEqualTo(302). .. // Only log if the status code is equal to 302
get("/x").then().log().ifStatusCodeMatches(matcher). .. // Only log if the status code matches the supplied Hamcrest matcher
```

## Log if validation fails ##

Since REST Assured 2.3.1 you can log the request or response only if the validation fails. To log the request do:
```
given().log().ifValidationFails(). ..
```

To log the response do:
```
.. .then().log().ifValidationFails(). ..
```

It's also possible to enable this for both the request and the response at the same time using the [LogConfig](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/LogConfig.html):

```
given().config(RestAssured.config().logConfig(logConfig().enableLoggingOfRequestAndResponseIfValidationFails(HEADERS))). ..
```

This will log only the headers if validation fails.

There's also a shortcut for enabling logging of the request and response for all requests if validation fails:

```
RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
```

# Root path #
To avoid duplicated paths in body expectations you can specify a root path. E.g. instead of writing:
```
when().
         get("/something").
then().
         body("x.y.firstName", is(..)).
         body("x.y.lastName", is(..)).
         body("x.y.age", is(..)).
         body("x.y.gender", is(..));
```

you can use a root path and do:

```
when().
        get("/something").
then().
         rootPath("x.y"). // You can also use the "root" method
         body("firstName", is(..)).
         body("lastName", is(..)).
         body("age", is(..)).
         body("gender", is(..));
```
You can also set a default root path using:
```
RestAssured.rootPath = "x.y";
```

In more advanced use cases it may also be useful to append additional root arguments to existing root arguments. To do this you can use the `appendRoot` method, for example:
```
when().
         get("/jsonStore").
then().
         root("store.%s", withArgs("book")).
         body("category.size()", equalTo(4)).
         appendRoot("%s.%s", withArgs("author", "size()")).
         body(withNoArgs(), equalTo(4));
```

It's also possible to detach a root. For example:
```
when().
         get("/jsonStore").
then().
         root("store.category").
         body("size()", equalTo(4)).
         detachRoot("category").
         body("size()", equalTo(1));
```

# Path arguments #
Path arguments are useful in situations where you have e.g. pre-defined variables that constitutes the path. For example
```
String someSubPath = "else";
int index = 1;
get("/x").then().body("something.%s[%d]", withArgs(someSubPath, index), equalTo("some value")). ..
```

will expect that the body path "`something.else[0]`" is equal to "some value".

Another usage is if you have complex [root paths](http://code.google.com/p/rest-assured/wiki/Usage#Root_path) and don't wish to duplicate the path for small variations:
```
when().
       get("/x").
then().
       root("filters.filterConfig[%d].filterConfigGroups.find { it.name == 'GroupName' }.includes").
       body(withArgs(0), hasItem("first")).
       body(withArgs(1), hasItem("second")).
       ..
```

The path arguments follows the standard [formatting syntax](http://download.oracle.com/javase/1,5.0/docs/api/java/util/Formatter.html#syntax) of Java.

Note that the `withArgs` method can be statically imported from the [com.jayway.restassured.RestAssured](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/RestAssured.html) class.

Sometimes it's also useful to validate a body without any additional arguments when all arguments have already been specified in the root path. This is where `withNoArgs` come into play. For example:
```
when().
         get("/jsonStore").
then().
         root("store.%s", withArgs("book")).
         body("category.size()", equalTo(4)).
         appendRoot("%s.%s", withArgs("author", "size()")).
         body(withNoArgs(), equalTo(4));
```

# Session support #
REST Assured provides a simplified way for managing sessions. You can define a session id value in the DSL:
```
given().sessionId("1234"). .. 
```

This is actually just a short-cut for:
```
given().cookie("JSESSIONID", "1234"). .. 
```

You can also specify a default `sessionId` that'll be supplied with all subsequent requests:
```
RestAssured.sessionId = "1234";
```

By default the session id name is `JSESSIONID` but you can change it using the [SessionConfig](#Session_Config.md):
```
RestAssured.config = newConfig().sessionConfig(new SessionConfig().sessionIdName("phpsessionid"));
```

You can also specify a sessionId using the `RequestSpecBuilder` and reuse it in many tests:
```
RequestSpecBuilder spec = new RequestSpecBuilder().setSessionId("value1").build();
   
// Make the first request with session id equal to value1
given().spec(spec). .. 
// Make the second request with session id equal to value1
given().spec(spec). .. 
```

It's also possible to get the session id from the response object:
```
String sessionId = get("/something").sessionId();
```

## Session Filter ##
As of version 2.0.0 you can use a [session filter](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/filter/session/SessionFilter.html) to automatically capture and apply the session, for example:
```
SessionFilter sessionFilter = new SessionFilter();

given().
          auth().form("John", "Doe").
          filter(sessionFilter).
when().
          get("/formAuth").
then().
          statusCode(200);


given().
          filter(sessionFilter). // Reuse the same session filter instance to automatically apply the session id from the previous response
when().
          get("/x").
then().
          statusCode(200);
```

To get session id caught by the `SessionFilter` you can do like this:
```
String sessionId = sessionFilter.getSessionId();
```

# SSL #
In most situations SSL should just work out of the box thanks to the excellent work of HTTP Builder and HTTP Client. There are how ever some cases where you'll run into trouble. You may for example run into a SSLPeerUnverifiedException if the server is using an invalid certificate. The easiest way to workaround this is to use "relaxed HTTPs validation". For example:
```
given().relaxedHTTPSValidation().when().get("https://some_server.com"). .. 
```
You can also define this statically for all requests:
```
RestAssured.useRelaxedHTTPSValidation();
```
or in a [request specification](Usage#Specification_Re-use.md).

This will assume an SSLContext protocol of  `SSL`. To change to another protocol use an overloaded versionen of  `relaxedHTTPSValidation`. For example:

```
given().relaxedHTTPSValidation("TLS").when().get("https://some_server.com"). .. 
```

You can also be more fine-grained and create Java keystore file and use it with REST Assured. It's not too difficult, first follow the guide [here](http://groovy.codehaus.org/modules/http-builder/doc/ssl.html) and then use the keystore in Rest Assured like this:

```
given().keystore("/pathToJksInClassPath", <password>). .. 
```

or you can specify it for every request:

```
RestAssured.keystore("/pathToJksInClassPath", <password>);
```

You can also define a keystore in a re-usable [specification](http://code.google.com/p/rest-assured/wiki/Usage#Specification_Re-use).

If you already loaded a keystore with a password you can use it as a truststore:
```
RestAssured.trustStore(keystore);
```

You can find a working example [here](https://github.com/jayway/rest-assured/blob/master/examples/rest-assured-itest-java/src/test/java/com/jayway/restassured/itest/java/SSLTest.java).

For more advanced SSL Configuration refer to the [SSL Configuration](https://code.google.com/p/rest-assured/wiki/Usage#SSL_Config) section.

## SSL invalid hostname ##
If the certificate is specifying an invalid hostname you don't need to create and import a keystore. As of version `2.2.0` you can do:
```
RestAssured.config = RestAssured.config().sslConfig(sslConfig().allowAllHostnames());
```

to allow all hostnames for all requests or:

```
given().config(RestAssured.config().sslConfig(sslConfig().allowAllHostnames()). .. ;
```
for a single request.

Note that if you use "relaxed HTTPs validation" then `allowAllHostnames` is activated by default.

# URL Encoding #
Usually you don't have to think about URL encoding since Rest Assured provides this automatically out of the box. In some cases though it may be useful to turn URL Encoding off. One reason may be that you already the have some parameters encoded before you supply them to Rest Assured. To prevent double URL encoding you need to tell Rest Assured to disable it's URL encoding. E.g.

```
String response = given().urlEncodingEnabled(false).get("https://jira.atlassian.com:443/rest/api/2.0.alpha1/search?jql=project%20=%20BAM%20AND%20issuetype%20=%20Bug").asString();
..
```

or

```
RestAssured.baseURI = "https://jira.atlassian.com";
RestAssured.port = 443;
RestAssured.urlEncodingEnabled = false;
final String query = "project%20=%20BAM%20AND%20issuetype%20=%20Bug";
String response = get("/rest/api/2.0.alpha1/search?jql={q}", query);
..
```

# Proxy Configuration #
Starting from version 2.3.2 REST Assured has better support for proxies. For example if you have a proxy at localhost port 8888 you can do:
```
given().proxy("localhost", 8888). .. 
```

Actually you don't even have to specify the hostname if the server is running on your local environment:

```
given().proxy(8888). .. // Will assume localhost
```

To use HTTPS you need to supply a third parameter (scheme) or use the `com.jayway.restassured.specification.ProxySpecification`. For example:

```
given().proxy(host("localhost").withScheme("https")). ..
```

where `host` is statically imported from `com.jayway.restassured.specification.ProxySpecification`.

## Static Proxy Configuration ##

It's also possible to configure a proxy statically for all requests, for example:
```
RestAssured.proxy("localhost", 8888);    
```

or:

```
RestAssured.proxy = host("localhost").withPort(8888);
```

## Request Specificaiton Proxy Configuration ##
You can also create a request specification and specify the proxy there:

```
RequestSpecification specification = new RequestSpecBuilder().setProxy("localhost").build();
given().spec(specification). ..
```

# Detailed configuration #
Detailed configuration is provided by the [RestAssuredConfig](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/RestAssuredConfig.html) instance with which you can configure the parameters of [HTTP Client](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/HttpClientConfig.html) as well as [Redirect](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/RedirectConfig.html), [Log](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/LogConfig.html), [Encoder](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/EncoderConfig.html), [Decoder](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/DecoderConfig.html), [Session](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/SessionConfig.html), [ObjectMapper](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/ObjectMapperConfig.html), [Connection](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/ConnectionConfig.html) and [SSL](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/SSLConfig.html) settings. Examples:

For a specific request:
```
given().config(newConfig().redirect(redirectConfig().followRedirects(false))). ..
```
or using a RequestSpecBuilder:
```
RequestSpecification spec = new RequestSpecBuilder().setConfig(newConfig().redirect(redirectConfig().followRedirects(false))).build();
```
or for all requests:
```
RestAssured.config = config().redirect(redirectConfig().followRedirects(true).and().maxRedirects(0));
```
`config()` and `newConfig()` can be statically imported from `com.jayway.restassured.config.RestAssuredConfig`.

## Encoder Config ##
With the [EncoderConfig](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/EncoderConfig.html) you can specify the default content encoding charset (if it's not specified in the content-type header) and query parameter charset for all requests. If no content charset is specified then ISO-8859-1 is used and if no query parameter charset is specified then UTF-8 is used. Usage example:
```
RestAssured.config = newConfig().encoderConfig(encoderConfig().defaultContentCharset("US-ASCII"));
```

## Decoder Config ##
With the [DecoderConfig](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/DecoderConfig.html) you can set the default response content decoding charset for all responses. This is useful if you expect a different content charset than ISO-8859-1 (which is the default charset) and the response doesn't define the charset in the content-type header. Usage example:
```
RestAssured.config = newConfig().decoderConfig(decoderConfig().defaultContentCharset("UTF-8"));
```

You can also use the `DecoderConfig` to specify which content decoders to apply. When you do this the `Accept-Encoding` header will be added automatically to the request and the response body will be decoded automatically. By default GZIP and DEFLATE decoders are enabled. To for example to remove GZIP decoding but retain DEFLATE decoding you can do the following:
```
given().config(newConfig().decoderConfig(decoderConfig().contentDecoders(DEFLATE))). ..
```

## Session Config ##
With the session config you can configure the default session id name that's used by REST Assured. The default session id name is `JSESSIONID` and you only need to change it if the name in your application is different and you want to make use of REST Assured's [session support](#Session_support.md). Usage:

```
RestAssured.config = newConfig().sessionConfig(new SessionConfig().sessionIdName("phpsessionid"));
```

## Redirect DSL ##
Redirect configuration can also be specified using the DSL. E.g.
```
given().redirects().max(12).and().redirects().follow(true).when(). .. 
```

## Connection Config ##
Lets you configure connection settings for REST Assured. For example if you want to force-close the Apache HTTP Client connection after each response. You may want to do this if you make a lot of fast consecutive requests with small amount of data in the response. How ever if you're downloading large amount of (chunked) data you must not close connections after each response. By default connections are _not_ closed after each response.

```
RestAssured.config = newConfig().connectionConfig(connectionConfig().closeIdleConnectionsAfterEachResponse());
```

## `Json Config` ##
[JsonPathConfig](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/path/json/config/JsonPathConfig.html) allows you to configure the Json settings either when used by REST Assured or by [JsonPath](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/path/json/JsonPath.html). It let's you configure how JSON numbers should be treated.
```
RestAssured.config = newConfig().jsonConfig(jsonConfig().numberReturnType(NumberReturnType.BIG_DECIMAL))
```

## HTTP Client Config ##
Let's you configure properties for the HTTP Client instance that REST Assured will be using when executing requests. By default REST Assured creates a new instance of http client for each "given" statement. To configure reuse do the following:
```
RestAssured.config = newConfig().httpClient(httpClientConfig().reuseHttpClientInstance());
```

You can also supply a custom HTTP Client instance by using the `httpClientFactory` method, for example:
```
RestAssured.config = newConfig().httpClient(httpClientConfig().httpClientFactory(
         new HttpClientConfig.HttpClientFactory() {

            @Override
            public HttpClient createHttpClient() {
                return new SystemDefaultHttpClient();
            }
        }));
```

**Note that currently you need to supply an instance of `AbstractHttpClient`.**

It's also possible to configure default parameters etc.

## SSL Config ##
The [SSLConfig](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/config/SSLConfig.html) allows you to specify more advanced SSL configuration such as truststore, keystore type and host name verifier. For example:
```
RestAssured.config = RestAssured.config().sslConfig(sslConfig().with().keystoreType(<type>).and().strictHostnames());
```

# Spring Mock Mvc Module #

REST Assured 2.2.0 introduced support for [Spring Mock Mvc](http://docs.spring.io/spring/docs/4.0.0.RELEASE/javadoc-api/org/springframework/test/web/servlet/MockMvc.html) using the `spring-mock-mvc` module. This means that you can unit test Spring Mvc Controllers. For example given the following Spring controller:
```
@Controller
public class GreetingController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping(value = "/greeting", method = GET)
    public @ResponseBody Greeting greeting(
            @RequestParam(value="name", required=false, defaultValue="World") String name) {
        return new Greeting(counter.incrementAndGet(), String.format(template, name));
    }
}
```
you can test it using [RestAssuredMockMvc](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/mockmvc/RestAssuredMockMvc.html) like this:
```
given().
        standaloneSetup(new GreetingController()).
        param("name", "Johan").
when().
        get("/greeting").
then().
        statusCode(200).
        body("id", equalTo(1)).
        body("content", equalTo("Hello, Johan!"));  
```
i.e. it's very similar to the standard REST Assured syntax. This makes it really fast to run your tests and it's also easier to bootstrap the environment and use mocks (if needed) than standard REST Assured. Most things that you're used to in standard REST Assured works with RestAssured Mock Mvc as well. For example (certain) configuration, static specifications, logging etc etc. To use it you need to depend on the Spring Mock Mvc module:
```
<dependency>
      <groupId>com.jayway.restassured</groupId>
      <artifactId>spring-mock-mvc</artifactId>
      <version>2.4.1</version>
      <scope>test</scope>
</dependency>
```
Or [download](https://rest-assured.googlecode.com/files/spring-mock-mvc-2.4.1-dist.zip) it from the download page if you're not using Maven.

## Bootstrapping RestAssuredMockMvc ##

First of all you should statically import methods in:
  * `com.jayway.restassured.module.mockmvc.RestAssuredMockMvc.*`
  * `com.jayway.restassured.module.mockmvc.matcher.RestAssuredMockMvcMatchers.*`
instead of those defined in
  * `com.jayway.restassured.RestAssured.*`
  * `com.jayway.restassured.matcher.RestAssuredMatchers.*`
Refer to [static import](Usage#Static_imports.md) section of the documentation for additional static imports.

In order to start a test using RestAssuredMockMvc you need to initialize it with a either a set of Controllers, a MockMvc instance or a WebApplicationContext from Spring. You can do this for a single request as seen in the previous example (`given().standaloneSetup(new GreetingController()). ..`) or you can do it statically:
```
RestAssuredMockMvc.standaloneSetup(new GreetingController());
```
If defined statically you don't have to specify any Controllers (or MockMvc or WebApplicationContext instance) in the DSL. This means that the previous example can be written as:
```
given().
        param("name", "Johan").
when().
        get("/greeting").
then().
        statusCode(200).
        body("id", equalTo(1)).
        body("content", equalTo("Hello, Johan!"));  
```

## Adding Result Handlers ##
Spring MockMvc has support for [Result Handlers](http://docs.spring.io/spring-framework/docs/4.0.0.RELEASE/javadoc-api/org/springframework/test/web/servlet/ResultHandler.html) and you can use these in RestAssuredMockMvc as well. For example let's say you want to use the native MockMvc logging:
```
given().resultHandlers(print()). .. 
```
where `print` is statically imported from `org.springframework.test.web.server.result.MockMvcResultHandlers`.

## Using Result Matchers ##
Spring MockMvc provides a bunch of [Result Matchers](http://docs.spring.io/spring-framework/docs/4.0.0.RELEASE/javadoc-api/org/springframework/test/web/servlet/ResultMatcher.html) that you may find useful. RestAssuredMockMvc has support for these as well if needed. For example let's say that for some reason you want to verify that the status code is equal to 200 using a ResultMatcher:
```
given().
        param("name", "Johan").
when().
        get("/greeting").
then().
        assertThat(status().isOk()).
        body("id", equalTo(1)).
        body("content", equalTo("Hello, Johan!"));  
```
where `status` is statically imported from `org.springframework.test.web.server.result.MockMvcResultMatchers`. Note that you can also use the `expect` method which is the same as `assertThat` but more close to the syntax of native MockMvc.

## Interceptors ##
For more advanced use cases you can also get ahold of and modify the [MockHttpServletRequestBuilder](http://docs.spring.io/spring-framework/docs/4.0.0.RELEASE/javadoc-api/org/springframework/test/web/servlet/request/MockHttpServletRequestBuilder.html) before the request is performed. To do this define a [MockHttpServletRequestBuilderInterceptor](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/mockmvc/intercept/MockHttpServletRequestBuilderInterceptor.html) and use it with RestAssuredMockMvc:

```
given().interceptor(myInterceptor). ..
```

## Specifications ##
Just as with standard Rest Assured you can use [specifications](Usage#Specification_Re-use.md) to allow for better re-use. Note that the request specification builder for RestAssuredMockMvc is called [MockMvcRequestSpecBuilder](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/mockmvc/specification/MockMvcRequestSpecBuilder.html). The same [ResponseSpecBuilder](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/builder/ResponseSpecBuilder.html) can be used in RestAssuredMockMvc as well though. Specifications can be defined statically as well just as with standard Rest Assured. For example:
```
RestAssuredMockMvc.requestSpecification = new MockMvcRequestSpecBuilder().addQueryParam("name", "Johan").build();
RestAssuredMockMvc.responseSpecification = new ResponseSpecBuilder().expectStatusCode(200).expectBody("content", equalTo("Hello, Johan!")).build();

given().
        standaloneSetup(new GreetingController()).
when().
        get("/greeting").
then().
        body("id", equalTo(1));
```

## Resetting RestAssuredMockMvc ##
If you've used any static configuration you can easily reset RestAssuredMockMvc to its default state by callin the `RestAssuredMockMvc.reset()` method.

## Spring MVC Authentication ##
Version `2.3.0` of `spring-mock-mvc` supports authentication. For example:
```
given().auth().principal(..). ..
```
Some authentication methods require Spring Security to be on the classpath (optional). It's also possible to define authentication statically:
```
RestAssuredMockMvc.authentication = principal("username", "password");
```
where the `principal` method is statically imported from [RestAssuredMockMvc](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/mockmvc/RestAssuredMockMvc.html). It's also possible to define an authentication scheme in a request builder:
```
MockMvcRequestSpecification spec = new MockMvcRequestSpecBuilder.setAuth(principal("username", "password")).build();
```

## Note on parameters ##
MockMvc doesn't differentiate between different kinds of parameters so `param`, `formParam` and `queryParam` currently just delegates to param in MockMvc. `formParam` adds the `application/x-www-form-urlencoded` content-type header automatically though just as standard Rest Assured does.

# More info #
For more information refer to the [javadoc](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/index.html):
  * [RestAssured](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/RestAssured.html)
  * [RestAssuredMockMvc Javadoc](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/module/mockmvc/RestAssuredMockMvc.html)
  * [Specification package](http://rest-assured.googlecode.com/svn/tags/2.4.1/apidocs/com/jayway/restassured/specification/package-summary.html)

You can also have a look at some code examples:
  * REST Assured [tests](https://github.com/jayway/rest-assured/tree/master/examples/rest-assured-itest-java/src/test/java/com/jayway/restassured/itest/java)
  * [JsonPathTest](https://github.com/jayway/rest-assured/blob/master/json-path/src/test/java/com/jayway/restassured/path/json/JsonPathTest.java)
  * [XmlPathTest](https://github.com/jayway/rest-assured/blob/master/xml-path/src/test/java/com/jayway/restassured/path/xml/XmlPathTest.java)

If you need support then join the [mailing list](http://groups.google.com/group/rest-assured).

For professional support please contact [Jayway](http://www.jayway.com).