# Release Notes for REST Assured 2.2.0 #

## Highlights ##
  * Introducing support for Spring MVC unit testing using the REST Assured DSL on top of [MockMvc](http://docs.spring.io/spring/docs/4.0.0.RELEASE/javadoc-api/org/springframework/test/web/servlet/MockMvc.html). For example given the following Spring controller:
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
> you can test it using [RestAssuredMockMvc](http://rest-assured.googlecode.com/svn/tags/2.2.0/apidocs/com/jayway/restassured/module/mockmvc/RestAssuredMockMvc.html) like this:
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
> i.e. it's very similar to the standard REST Assured syntax. This makes it really fast to run your tests and it's also easier to bootstrap the environment and use mocks (if needed) than standard REST Assured. Most things that you're used to in standard REST Assured works with RestAssured Mock Mvc as well. For example (certain) configuration, static specifications, logging etc etc. For more info refer to the [usage guide](Usage#Spring_Mock_Mvc_Module.md). To use it you need to depend on the Spring Mock Mvc module:
```
<dependency>
      <groupId>com.jayway.restassured</groupId>
      <artifactId>spring-mock-mvc</artifactId>
      <version>2.2.0</version>
      <scope>test</scope>
</dependency>
```
> Or [download](https://rest-assured.googlecode.com/files/spring-mock-mvc-2.2.0-dist.zip) it from the download page if you're not using Maven.
  * Added support for oauth2 using the [Scribe](https://github.com/fernandezpablo85/scribe-java) framework (whcih needs to be downloaded and put it classpath separately). For example:
```
given().auth().oauth2("accessToken"). .. 
```
> Big thanks to Waseem Shaik for helping out with this!

## Non-backward compatible changes ##
  * OAuth 1 authentication now uses the [Scribe](https://github.com/fernandezpablo85/scribe-java)  framework instead of [SignPost](https://code.google.com/p/oauth-signpost/) since Scribe has support for both oauth 1 and 2. Please download scribe and replace the signpost dependencies that you have in classpath if you're currently using oauth 1.

## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details.