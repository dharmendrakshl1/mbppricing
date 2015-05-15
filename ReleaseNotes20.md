# Release Notes for REST Assured 2.0.0 #

## Highlights ##
  * Introducing support for Given-When-Then expressions! This means that assertions can be defined at the end of the expression. For example:
```
get("/x").then().assertThat().body("x.y", equalTo("z"));
```

> or using the parameters etc:
```
given().
        contentType(JSON).
        body(dto).
when().
        post("/myresource").
then().
        statusCode(200).
        header("headerName", not(nullValue())).
        body("x.y", equalTo("y")).
        body("x.z", equalTo("z"));
```
  * Added static method `when` to `com.jayway.restassured.RestAssured` that allows you to write specifications without the use of parameters, headers etc. For example:
```
when().
        get("/x").
then().
        body("x.y.z1", equalTo("Z1")).
        body("x.y.z2", equalTo("Z2"));
```
  * You can extract values from the response or return the response instance itself after you've done validating the response by using the `extract` method. This is useful for example if you want to use values from the response in sequent requests. For example given that a resource called `title` returns the following JSON:
```
 {
     "title" : "My Title",
      "_links": {
              "self": { "href": "/title" },
              "next": { "href": "/title?page=2" }
           }
 }
```
> and you want to validate that content type is equal to `JSON` and the title is equal to `My Title` but you also want to extract the link to the `next` title to use that in a subsequent request. This is how:
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
## Other notable changes ##
  * Fixed so that the path method in the Response can be invoked multiple times, for example:
```
Response response = get("/jsonStore");
float minPrice = response.path("store.book.price.min()");
float maxPrice = response.path("store.book.price.max()");
```
  * Added support for performing requests with URI's and URL's, for example:
```
URI myUri = new URI(..)
Response response = get(myUri);
```
  * Added possibility to call request methods without any parameters. This is useful if you want to call the root resource. For example:
```
RestAssured.baseURI = "http://localhost:8080/hello";
String y = get().path("x.y");
```
## Minor changes ##
  * It's now possible to call asString() on a Response object after asByteArray() has been called and vice versa.
  * Fixed so that JsonPath and XmlPath and path expressions work after the "prettyPrint" and "print" methods have been called on a Response instance.
  * Fixed several regression bugs introduce in version 1.9.0.

See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details