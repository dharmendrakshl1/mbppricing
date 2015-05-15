# Release Notes for REST Assured 2.1.0 #

## Highlights ##
  * Introducing support for [Json Schema](http://json-schema.org/) validation. For example given the following schema located in the classpath as `products-schema.json`:
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
> you can validate that a resource (`/products`) conforms with the schema:
```
get("/products").then().assertThat().body(matchesJsonSchemaInClasspath("products-schema.json"));
```
> `matchesJsonSchemaInClasspath` is statically imported from `com.jayway.restassured.module.jsv.JsonSchemaValidator` and it's recommended to statically import all methods from this class. However in order to use it you need to depend on the `json-schema-validator` module by either downloading it from the download page or add the following dependency from Maven:
```
<dependency>
    <groupId>com.jayway.restassured</groupId>
    <artifactId>json-schema-validator</artifactId>
    <version>2.1.0</version>
</dependency>
```
  * Added support to for mixing text and path assertions. For example:
```
 get("/lotto").then().body(containsString("\"numbers\":[52")).and().body("lotto.winners.winnerId", hasItems(23, 54));
```
  * Added support for disabling hostname verification during certificate authentication by using the CertificateAuthSettings:
```
 given().auth().certificate(certUrl, password, certAuthSettings().using().allowAllHostnames(). ..
```
  * Added [SSLConfig](http://rest-assured.googlecode.com/svn/tags/2.1.0/apidocs/com/jayway/restassured/config/SSLConfig.html) which allows you to better configure SSL configuration such as KeyStore and host name verification strategies. It's also much simpler to allow all host names (when a server has a bad certificate specifying an invalid host name). Instead of having to create and import a KeyStore you can now do:
```
RestAssured.config = newConfig().sslConfig(sslConifg().allowAllHostnames());
```

## Non-backward compatible changes ##
  * It's no longer possible to assert that an empty response object has a path that is null, for example let's say that the "/statusCode409WithNoBody" resource returns an empty body:
```
expect().contentType(ContentType.JSON).body("error", equalTo(null)).when().get("/statusCode409WithNoBody"); // This will now throw assertion error
```
  * Changed default response content charset from ISO-8859-1 to system default charset. The reason for this that most users would probably expect the system default charset. To change the behaviour use the [DecoderConfig](http://rest-assured.googlecode.com/svn/tags/2.1.0/apidocs/com/jayway/restassured/config/DecoderConfig.html).
  * Changed default request content charset from ISO-8859-1 to system default charset. The reason for this that most users would probably expect the system default charset. To change the behaviour use the [EncoderConfig](http://rest-assured.googlecode.com/svn/tags/2.1.0/apidocs/com/jayway/restassured/config/EncoderConfig.html).
  * Removed the following methods from the RestAssured and AuthenticationSpecification API:
    * `certificate(String certURL, String password, String certType, int port, KeystoreProvider trustStoreProvider)`
> They are replaced by the `certificate(String certURL, String password, CertificateAuthSettings certificateAuthSettings)` method. For example:
```
    RestAssured.authentication = certificate(certUrl, password, certAuthSettings().with().port(435));
```
> > and:
```
 given().auth().certificate(certUrl, password, certAuthSettings().with().port(435)). ..
```
  * Removed static method "RestAssured.keystore()". You can now get the keystore settings from the [SSLConfig](http://rest-assured.googlecode.com/svn/tags/2.1.0/apidocs/com/jayway/restassured/config/SSLConfig.html) instead.
  * Removed the `com.jayway.restassured.authentication.KeyStoreProvider` interface. The `KeyStoreProvider` was actually NOT used to create a KeyStore but rather a trust store. To specify the trust store after this change use the [SSLConfig](http://rest-assured.googlecode.com/svn/tags/2.1.0/apidocs/com/jayway/restassured/config/SSLConfig.html) or certificate authentication.
  * All `keystore` related methods in the RestAssured API now returns `void` instead of `KeyStoreSpec`.
  * Removed method "RestAssured.keyStore()". If you want to get the configured "keystore" configuration you can now call "RestAssured.config().getSSLConfig();".

## Deprecations ##
  * Deprecated `RestAssured#certificate(String certURL, String password, String certType, int port)`
  * Deprecated `AuthenticationSpecification#certificate(String certURL, String password, String certType, int port)`

## Minor changes ##
See [change log](http://github.com/jayway/rest-assured/raw/master/changelog.txt) for more details.