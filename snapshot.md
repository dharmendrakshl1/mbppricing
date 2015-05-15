In order to try out REST Assured versions before they are released you need to add the following repository in your Maven `pom.xml` file:

```
<repositories>
        <repository>
            <id>sonatype</id>
            <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
            <snapshots />
        </repository>
</repositories>
```

The latest snapshot version usually has the same version number as the latest released version but with an increased patch version. For example if the latest released version is `2.4.0` then the lastest snapshot release should be `2.4.1-SNAPSHOT`.