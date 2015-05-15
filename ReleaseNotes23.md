# Release Notes for REST Assured 2.3.0 #

## Highlights ##
  * Improved [SSL configuration](Usage#SSL_Config.md). Fixed several regression bugs and allows for defining a trust store and a `SSLSocketFactory`.
  * It's now much easier to connect to sites with invalid SSL certificates. All you have to do is to use the `relaxedHTTPSValidation` method. For example:
```
given().relaxedHTTPSValidation().when().get("https://some_server.com"). .. 
```
> You can also define this statically for all requests:
```
RestAssured.useRelaxedHTTPSValidation();
```
> or in a [request specification](Usage#Specification_Re-use.md).
  * Added support for authentication to [RestAssuredMockMvc](Usage#Spring_Mock_Mvc_Module.md). You can now do e.g.
```
given().auth().principal(..). ..
```
> Some authentication methods require Spring Security to be on the classpath (optional). It's also possible to define authentication statically:
```
RestAssuredMockMvc.authentication = principal("username", "password");
```
> where the `principal` method is statically imported from [RestAssuredMockMvc](http://rest-assured.googlecode.com/svn/tags/2.3.0/apidocs/com/jayway/restassured/module/mockmvc/RestAssuredMockMvc.html). It's also possible to define an authentication scheme in a request builder:
```
 MockMvcRequestSpecification spec = new MockMvcRequestSpecBuilder.setAuth(principal("username", "password")).build();
```
  * Added support for using data from a response to verify another part of the response. For example consider the following JSON document returned from service x:
```
{ "userId" : "some-id", "href" : "http://localhost:8080/some-id" }
```
> You may notice that the "href" attribute ends with the value of the "userId" attribute. If we want to verify this we can implement a `com.jayway.restassured.matcher.ResponseAwareMatcher` and use it like this:
```
get("/x").then().body("href", new ResponseAwareMatcher<Response>() {
                                  public Matcher<?> matcher(Response response) {
                                          return equalTo("http://localhost:8080/" + response.path("userId"));
                                  }
                       });
```
> There are some predefined matchers that you can use defined in the `com.jayway.restassured.matcher.RestAssuredMatchers` (or `com.jayway.restassured.module.mockmvc.matcher.RestAssuredMockMvcMatchers` if using the spring-mock-mvc module). For example:
```
get("/x").then().body("href", endsWithPath("userId"));
```
> `ResponseAwareMatchers` can also be composed, either with another `ResponseAwareMatcher` or with a Hamcrest Matcher. For example:
```
get("/x").then().body("href", endsWithPath("userId").and(startsWith("http:/localhost:8080/")));
```

## Non-backward compatible changes ##
  * The json-path module accidentally depended on faster-jackson, jackson, gson and simple-json and brought then in as transitive dependencies. This has now been resolved which means that these dependencies are optional as intended ([issue 297](https://code.google.com/p/rest-assured/issues/detail?id=297)).
  * Statically defined configuration (such as `RestAssured.config = ..`) is now automatically applied to RequestSpecBuilders in both RestAssured and RestAssuredMockMvc. To revert to previous behavior you can do
```
new RequestSpecBuilder.config(newConfig()). .
```

## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details.