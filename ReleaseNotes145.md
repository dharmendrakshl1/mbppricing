# Release Notes for REST Assured 1.4.5 #

## Highlights ##
  * Better support for cookies:
    * You can now create multi-value cookies using e.g.
```
    given().cookie("cookieName", "value1", "value2"). ..
```
> > This will create _two_ cookies, `cookieName=value1` and `cookieName=value2`.
    * Fixed a serious issue with the cookie parsing that caused cookie attributes to be parsed as a new cookie ([issue 130](https://code.google.com/p/rest-assured/issues/detail?id=130)).
    * Support for getting [detailed cookies](http://rest-assured.googlecode.com/svn/tags/1.4.5/apidocs/com/jayway/restassured/response/Cookie.html) using the [Response.getDetailedCookies()](http://rest-assured.googlecode.com/svn/tags/1.4.5/apidocs/com/jayway/restassured/response/Response.html#getDetailedCookies()) method. You can also get a single detailed cookie using the [Response.getDetailedCookie(java.lang.String)](http://rest-assured.googlecode.com/svn/tags/1.4.5/apidocs/com/jayway/restassured/response/Response.html#getDetailedCookie(java.lang.String)) method. Detailed cookies contains e.g. comment, path and expiry date.
    * Creation of detailed cookies:
```
    Cookie someCookie = new Cookie.Builder("some_cookie", "some_value").setSecured(true).build();
    given().cookie(someCookie).and().expect().body(equalTo("x")).when().get("/cookie");
```
  * Better support for headers:
    * You can now create multi-value headers using e.g.
```
    given().header("headerName", "value1", "value2"). ..
```
> > This will create _two_ headers, `headerName=value1` and `headerName=value2`.

## Non-backward compatible changes ##
  * To allow for multi-value headers the old [Response.getHeaders()](http://rest-assured.googlecode.com/svn/tags/1.4/apidocs/com/jayway/restassured/response/Response.html#getHeaders()) and [Response.headers()](http://rest-assured.googlecode.com/svn/tags/1.4/apidocs/com/jayway/restassured/response/Response.html#headers()) no longer returns `Map<String,String>`. Now these methods returns a [Headers](http://rest-assured.googlecode.com/svn/tags/1.4.5/apidocs/com/jayway/restassured/response/Headers.html) instance instead.

## Other notable changes ##
  * Added support for serializing objects to a parameter if the content-type is set:
```
  given().
          contentType("application/json").
          queryParam("category", "Games").
          formParam("object", new GameObject(..)). // GameObject will be serialized to JSON
  when().
          post("/somewhere");
```
  * Added support for mapping a path to a Java object in [JsonPath](http://rest-assured.googlecode.com/svn/tags/1.4.5/apidocs/com/jayway/restassured/path/json/JsonPath.html), e.g:
```
Book book = from(JSON).getObject("store.book[2]", Book.class);
```
## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details